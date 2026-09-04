import { Hono } from "hono";
import { requireAuth, getSession, createSessionCookie, clearSessionCookie, verifyPassword, pbkdf2Hash } from "../src/auth.js";
import * as db from "../src/db.js";
import { randHex, resolveVideoBlock, buildBlockFromBody, extOf, COVER_EXTS, BLOCK_EXTS, COVER_MAX_BYTES, BLOCK_MAX_BYTES } from "../src/helpers.js";
import { serveUpload } from "../src/uploads.js";
import * as views from "../src/views.js";
import { HOME_HTML, ABOUT_HTML, CONTACT_HTML } from "../src/static-pages.js";

const app = new Hono();

// Served through the Function (not as plain static files) because Cloudflare
// Pages unconditionally 308-redirects static *.html files to their
// extension-less URL, with no config to disable it — that would break every
// existing /about.html-style link across the site.
app.get("/", (c) => c.html(HOME_HTML));
app.get("/about.html", (c) => c.html(ABOUT_HTML));
app.get("/contact.html", (c) => c.html(CONTACT_HTML));

function siteUrlOf(c) {
	return (c.env.SITE_URL || "https://shinetu.net").replace(/\/+$/, "");
}

async function uploadFileToR2(env, file) {
	const ext = extOf(file.name) || "";
	const key = `uploads/${randHex(8)}${ext}`;
	await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
	return `/assets/uploads/${key.slice("uploads/".length)}`;
}

function pickFile(body, field, allowedExts, maxBytes) {
	const f = body[field];
	if (!f || typeof f === "string" || !f.size) return { file: null, error: null };
	const ext = extOf(f.name);
	if (!allowedExts.includes(ext)) return { file: null, error: "Định dạng file không được hỗ trợ." };
	if (f.size > maxBytes) return { file: null, error: `File vượt quá dung lượng tối đa (${Math.round(maxBytes / 1024 / 1024)}MB).` };
	return { file: f, error: null };
}

// ---------------------------------------------------------------------------
// Static R2-backed uploads
// ---------------------------------------------------------------------------
app.get("/assets/uploads/:filename", serveUpload);

// ---------------------------------------------------------------------------
// Portfolio — admin (registered before the generic /portfolio/:id catch-all)
// ---------------------------------------------------------------------------

app.get("/portfolio/admin/login", async (c) => {
	const session = await getSession(c);
	if (session) return c.redirect("/portfolio/admin");
	return c.html(views.adminLoginPage({ error: null }));
});

app.post("/portfolio/admin/login", async (c) => {
	const body = await c.req.parseBody();
	const admin = await db.getAdmin(c.env.DB);
	const ok = admin && (await verifyPassword(body.username === admin.username ? body.password : "__no__", admin.password_hash, admin.pbkdf2_salt, admin.pbkdf2_iterations));
	if (!admin || body.username !== admin.username || !ok) {
		return c.html(views.adminLoginPage({ error: "Sai tên đăng nhập hoặc mật khẩu." }));
	}
	await createSessionCookie(c, { username: admin.username, tokenVersion: admin.token_version });
	return c.redirect("/portfolio/admin");
});

app.post("/portfolio/admin/logout", requireAuth, async (c) => {
	await db.bumpTokenVersion(c.env.DB);
	clearSessionCookie(c);
	return c.redirect("/portfolio/admin/login");
});

app.get("/portfolio/admin/change-password", requireAuth, async (c) => {
	return c.html(views.adminChangePasswordPage({ error: null, success: null }));
});

app.post("/portfolio/admin/change-password", requireAuth, async (c) => {
	const body = await c.req.parseBody();
	const admin = await db.getAdmin(c.env.DB);
	const currentOk = await verifyPassword(body.currentPassword, admin.password_hash, admin.pbkdf2_salt, admin.pbkdf2_iterations);
	if (!currentOk) return c.html(views.adminChangePasswordPage({ error: "Mật khẩu hiện tại không đúng.", success: null }));
	if (String(body.newPassword).length < 8) return c.html(views.adminChangePasswordPage({ error: "Mật khẩu mới phải có ít nhất 8 ký tự.", success: null }));
	if (body.newPassword !== body.confirmPassword) return c.html(views.adminChangePasswordPage({ error: "Xác nhận mật khẩu không khớp.", success: null }));
	const { hash, salt, iterations } = await pbkdf2Hash(body.newPassword);
	await db.setAdminPassword(c.env.DB, { hash, salt, iterations });
	const fresh = await db.getAdmin(c.env.DB);
	await createSessionCookie(c, { username: fresh.username, tokenVersion: fresh.token_version });
	return c.html(views.adminChangePasswordPage({ error: null, success: "Đã cập nhật mật khẩu thành công." }));
});

app.get("/portfolio/admin", requireAuth, async (c) => {
	const projects = await db.getProjects(c.env.DB);
	return c.html(views.adminDashboardPage({ projects, username: c.get("adminUsername") }));
});

app.get("/portfolio/admin/new", requireAuth, async (c) => {
	return c.html(views.adminFormPage({ project: null, error: null }));
});

app.post("/portfolio/admin/new", requireAuth, async (c) => {
	const body = await c.req.parseBody();
	const { file, error } = pickFile(body, "image", COVER_EXTS, COVER_MAX_BYTES);
	if (error) return c.html(views.adminFormPage({ project: null, error }));
	const image = file ? await uploadFileToR2(c.env, file) : undefined;
	const id = await db.createProject(c.env.DB, { ...body, image });
	return c.redirect("/portfolio/admin");
});

app.get("/portfolio/admin/:id/edit", requireAuth, async (c) => {
	const project = await db.getProject(c.env.DB, c.req.param("id"));
	if (!project) return c.redirect("/portfolio/admin");
	return c.html(views.adminFormPage({ project, error: null }));
});

app.post("/portfolio/admin/:id/edit", requireAuth, async (c) => {
	const id = c.req.param("id");
	const body = await c.req.parseBody();
	const { file, error } = pickFile(body, "image", COVER_EXTS, COVER_MAX_BYTES);
	if (error) {
		const project = await db.getProject(c.env.DB, id);
		return c.html(views.adminFormPage({ project, error }));
	}
	const newImage = file ? await uploadFileToR2(c.env, file) : null;
	await db.updateProject(c.env.DB, id, body, newImage);
	return c.redirect("/portfolio/admin");
});

app.post("/portfolio/admin/:id/delete", requireAuth, async (c) => {
	await db.deleteProject(c.env.DB, c.req.param("id"));
	return c.redirect("/portfolio/admin");
});

app.post("/portfolio/admin/:id/toggle-featured", requireAuth, async (c) => {
	await db.toggleProjectFeatured(c.env.DB, c.req.param("id"));
	return c.redirect("/portfolio/admin");
});

app.post("/portfolio/admin/:id/blocks", requireAuth, async (c) => {
	const id = c.req.param("id");
	const body = await c.req.parseBody();
	const { file } = pickFile(body, "media", BLOCK_EXTS, BLOCK_MAX_BYTES);
	const fileUrl = file ? await uploadFileToR2(c.env, file) : null;
	const block = buildBlockFromBody(body, file, fileUrl);
	if (block) await db.addProjectBlock(c.env.DB, id, block);
	return c.redirect(`/portfolio/admin/${id}/edit`);
});

app.get("/portfolio/admin/:id/blocks/:blockId/edit", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	const project = await db.getProject(c.env.DB, id);
	const block = await db.getProjectBlock(c.env.DB, id, blockId);
	if (!project || !block) return c.redirect(`/portfolio/admin/${id}/edit`);
	return c.html(views.adminBlockFormPage({ project, block }));
});

app.post("/portfolio/admin/:id/blocks/:blockId/edit", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	const body = await c.req.parseBody();
	const { file } = pickFile(body, "media", BLOCK_EXTS, BLOCK_MAX_BYTES);
	const fields = {};
	if (body.text_vi !== undefined) fields.text_vi = body.text_vi;
	if (body.text_en !== undefined) fields.text_en = body.text_en;
	if (body.caption_vi !== undefined) fields.caption_vi = body.caption_vi;
	if (body.caption_en !== undefined) fields.caption_en = body.caption_en;
	if (file) fields.src = await uploadFileToR2(c.env, file);
	else if (body.videoUrl) fields.src = String(body.videoUrl).trim();
	await db.updateProjectBlock(c.env.DB, id, blockId, fields);
	return c.redirect(`/portfolio/admin/${id}/edit`);
});

app.post("/portfolio/admin/:id/blocks/:blockId/delete", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	await db.deleteProjectBlock(c.env.DB, id, blockId);
	return c.redirect(`/portfolio/admin/${id}/edit`);
});

app.post("/portfolio/admin/:id/blocks/:blockId/move", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	const body = await c.req.parseBody();
	await db.moveProjectBlock(c.env.DB, id, blockId, body.direction === "up" ? "up" : "down");
	return c.redirect(`/portfolio/admin/${id}/edit`);
});

// ---------------------------------------------------------------------------
// Portfolio — public
// ---------------------------------------------------------------------------

app.get("/portfolio", async (c) => {
	const projects = await db.getFeaturedProjects(c.env.DB);
	return c.html(views.portfolioListPage({ projects, siteUrl: siteUrlOf(c) }));
});

app.get("/portfolio/archive", async (c) => {
	const projects = await db.getArchivedProjects(c.env.DB);
	return c.html(views.portfolioArchivePage({ projects, siteUrl: siteUrlOf(c) }));
});

app.get("/portfolio/:id", async (c) => {
	const project = await db.getProject(c.env.DB, c.req.param("id"));
	if (!project) return c.redirect("/portfolio");
	project.blocks = (project.blocks || []).map((b) => (b.type === "video" ? { ...b, video: resolveVideoBlock(b) } : b));
	return c.html(views.portfolioDetailPage({ project, siteUrl: siteUrlOf(c) }));
});

// ---------------------------------------------------------------------------
// Blog — admin
// ---------------------------------------------------------------------------

app.get("/blog/admin", requireAuth, async (c) => {
	const posts = await db.getPosts(c.env.DB);
	return c.html(views.blogAdminDashboardPage({ posts, username: c.get("adminUsername") }));
});

app.get("/blog/admin/new", requireAuth, async (c) => {
	return c.html(views.blogAdminFormPage({ post: null, error: null }));
});

app.post("/blog/admin/new", requireAuth, async (c) => {
	const body = await c.req.parseBody();
	const { file, error } = pickFile(body, "image", COVER_EXTS, COVER_MAX_BYTES);
	if (error) return c.html(views.blogAdminFormPage({ post: null, error }));
	const image = file ? await uploadFileToR2(c.env, file) : undefined;
	await db.createPost(c.env.DB, { ...body, image });
	return c.redirect("/blog/admin");
});

app.get("/blog/admin/:id/edit", requireAuth, async (c) => {
	const post = await db.getPost(c.env.DB, c.req.param("id"));
	if (!post) return c.redirect("/blog/admin");
	return c.html(views.blogAdminFormPage({ post, error: null }));
});

app.post("/blog/admin/:id/edit", requireAuth, async (c) => {
	const id = c.req.param("id");
	const body = await c.req.parseBody();
	const { file, error } = pickFile(body, "image", COVER_EXTS, COVER_MAX_BYTES);
	if (error) {
		const post = await db.getPost(c.env.DB, id);
		return c.html(views.blogAdminFormPage({ post, error }));
	}
	const newImage = file ? await uploadFileToR2(c.env, file) : null;
	await db.updatePost(c.env.DB, id, body, newImage);
	return c.redirect("/blog/admin");
});

app.post("/blog/admin/:id/delete", requireAuth, async (c) => {
	await db.deletePost(c.env.DB, c.req.param("id"));
	return c.redirect("/blog/admin");
});

app.post("/blog/admin/:id/blocks", requireAuth, async (c) => {
	const id = c.req.param("id");
	const body = await c.req.parseBody();
	const { file } = pickFile(body, "media", BLOCK_EXTS, BLOCK_MAX_BYTES);
	const fileUrl = file ? await uploadFileToR2(c.env, file) : null;
	const block = buildBlockFromBody(body, file, fileUrl);
	if (block) await db.addPostBlock(c.env.DB, id, block);
	return c.redirect(`/blog/admin/${id}/edit`);
});

app.get("/blog/admin/:id/blocks/:blockId/edit", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	const post = await db.getPost(c.env.DB, id);
	const block = await db.getPostBlock(c.env.DB, id, blockId);
	if (!post || !block) return c.redirect(`/blog/admin/${id}/edit`);
	return c.html(views.blogAdminBlockFormPage({ post, block }));
});

app.post("/blog/admin/:id/blocks/:blockId/edit", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	const body = await c.req.parseBody();
	const { file } = pickFile(body, "media", BLOCK_EXTS, BLOCK_MAX_BYTES);
	const fields = {};
	if (body.text_vi !== undefined) fields.text_vi = body.text_vi;
	if (body.text_en !== undefined) fields.text_en = body.text_en;
	if (body.caption_vi !== undefined) fields.caption_vi = body.caption_vi;
	if (body.caption_en !== undefined) fields.caption_en = body.caption_en;
	if (file) fields.src = await uploadFileToR2(c.env, file);
	else if (body.videoUrl) fields.src = String(body.videoUrl).trim();
	await db.updatePostBlock(c.env.DB, id, blockId, fields);
	return c.redirect(`/blog/admin/${id}/edit`);
});

app.post("/blog/admin/:id/blocks/:blockId/delete", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	await db.deletePostBlock(c.env.DB, id, blockId);
	return c.redirect(`/blog/admin/${id}/edit`);
});

app.post("/blog/admin/:id/blocks/:blockId/move", requireAuth, async (c) => {
	const { id, blockId } = c.req.param();
	const body = await c.req.parseBody();
	await db.movePostBlock(c.env.DB, id, blockId, body.direction === "up" ? "up" : "down");
	return c.redirect(`/blog/admin/${id}/edit`);
});

// ---------------------------------------------------------------------------
// Blog — public
// ---------------------------------------------------------------------------

app.get("/blog.html", async (c) => {
	const posts = await db.getPosts(c.env.DB);
	return c.html(views.blogListPage({ posts, siteUrl: siteUrlOf(c) }));
});

app.get("/blog/:slug", async (c) => {
	const post = await db.getPostBySlug(c.env.DB, c.req.param("slug"));
	if (!post) return c.redirect("/blog.html");
	post.blocks = (post.blocks || []).map((b) => (b.type === "video" ? { ...b, video: resolveVideoBlock(b) } : b));
	return c.html(views.blogPostPage({ post, siteUrl: siteUrlOf(c) }));
});

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

app.get("/sitemap.xml", async (c) => {
	const siteUrl = siteUrlOf(c);
	const projects = await db.getProjects(c.env.DB);
	const posts = await db.getPosts(c.env.DB);
	const staticUrls = ["", "/portfolio", "/blog.html", "/about.html", "/contact.html"];
	const urls = [
		...staticUrls.map((p) => `${siteUrl}${p}`),
		...projects.map((p) => `${siteUrl}/portfolio/${p.id}`),
		...posts.map((p) => `${siteUrl}/blog/${p.slug}`),
	];
	const xml =
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
		urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
		`\n</urlset>\n`;
	return c.body(xml, 200, { "Content-Type": "application/xml" });
});

app.get("/robots.txt", async (c) => {
	const siteUrl = siteUrlOf(c);
	const body = `User-agent: *\nDisallow: /portfolio/admin\nDisallow: /blog/admin\nSitemap: ${siteUrl}/sitemap.xml\n`;
	return c.body(body, 200, { "Content-Type": "text/plain" });
});

export const onRequest = (context) => app.fetch(context.request, context.env, context);
