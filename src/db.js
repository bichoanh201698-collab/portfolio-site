import { randHex, slugify, uniqueSlug } from "./helpers.js";

// ---------------------------------------------------------------------------
// Generic block helpers (shared shape between project_blocks and post_blocks)
// ---------------------------------------------------------------------------

async function getBlocks(db, table, fkCol, parentId) {
	const { results } = await db
		.prepare(`SELECT * FROM ${table} WHERE ${fkCol} = ? ORDER BY position ASC`)
		.bind(parentId)
		.all();
	return results.map((r) => ({
		id: r.id,
		type: r.type,
		text_vi: r.text_vi,
		text_en: r.text_en,
		src: r.src,
		caption_vi: r.caption_vi,
		caption_en: r.caption_en,
	}));
}

async function addBlock(db, table, fkCol, parentId, block) {
	const maxRow = await db
		.prepare(`SELECT COALESCE(MAX(position), -1) AS maxPos FROM ${table} WHERE ${fkCol} = ?`)
		.bind(parentId)
		.first();
	const position = (maxRow?.maxPos ?? -1) + 1;
	await db
		.prepare(
			`INSERT INTO ${table} (id, ${fkCol}, position, type, text_vi, text_en, src, caption_vi, caption_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		)
		.bind(block.id, parentId, position, block.type, block.text_vi || null, block.text_en || null, block.src || null, block.caption_vi || null, block.caption_en || null)
		.run();
}

async function updateBlock(db, table, fkCol, parentId, blockId, fields) {
	const sets = [];
	const vals = [];
	for (const key of ["type", "text_vi", "text_en", "src", "caption_vi", "caption_en"]) {
		if (key in fields) {
			sets.push(`${key} = ?`);
			vals.push(fields[key]);
		}
	}
	if (!sets.length) return;
	vals.push(parentId, blockId);
	await db
		.prepare(`UPDATE ${table} SET ${sets.join(", ")} WHERE ${fkCol} = ? AND id = ?`)
		.bind(...vals)
		.run();
}

async function deleteBlock(db, table, fkCol, parentId, blockId) {
	await db.prepare(`DELETE FROM ${table} WHERE ${fkCol} = ? AND id = ?`).bind(parentId, blockId).run();
}

async function moveBlock(db, table, fkCol, parentId, blockId, direction) {
	const { results } = await db
		.prepare(`SELECT id, position FROM ${table} WHERE ${fkCol} = ? ORDER BY position ASC`)
		.bind(parentId)
		.all();
	const idx = results.findIndex((r) => r.id === blockId);
	if (idx === -1) return;
	const swapIdx = direction === "up" ? idx - 1 : idx + 1;
	if (swapIdx < 0 || swapIdx >= results.length) return;
	const a = results[idx];
	const b = results[swapIdx];
	await db.batch([
		db.prepare(`UPDATE ${table} SET position = ? WHERE ${fkCol} = ? AND id = ?`).bind(b.position, parentId, a.id),
		db.prepare(`UPDATE ${table} SET position = ? WHERE ${fkCol} = ? AND id = ?`).bind(a.position, parentId, b.id),
	]);
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function getProjects(db) {
	const { results } = await db.prepare("SELECT * FROM projects ORDER BY sort_order ASC").all();
	return results;
}

export async function getProject(db, id) {
	const project = await db.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first();
	if (!project) return null;
	project.blocks = await getBlocks(db, "project_blocks", "project_id", id);
	return project;
}

export async function createProject(db, fields) {
	const id = randHex(6);
	const maxRow = await db.prepare("SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM projects").first();
	const order = fields.order ? Number(fields.order) : (maxRow?.maxOrder ?? 0) + 1;
	await db
		.prepare(
			"INSERT INTO projects (id, sort_order, title_vi, title_en, tag1_vi, tag1_en, tag2_vi, tag2_en, desc_vi, desc_en, link, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		)
		.bind(
			id, order,
			fields.title_vi || "", fields.title_en || "",
			fields.tag1_vi || "", fields.tag1_en || "",
			fields.tag2_vi || "", fields.tag2_en || "",
			fields.desc_vi || "", fields.desc_en || "",
			fields.link || "",
			fields.image || "/assets/images/feature-1.png",
		)
		.run();
	return id;
}

export async function updateProject(db, id, fields, newImage) {
	const existing = await db.prepare("SELECT image, sort_order FROM projects WHERE id = ?").bind(id).first();
	if (!existing) return false;
	const order = fields.order ? Number(fields.order) : existing.sort_order;
	const image = newImage || existing.image;
	await db
		.prepare(
			"UPDATE projects SET sort_order=?, title_vi=?, title_en=?, tag1_vi=?, tag1_en=?, tag2_vi=?, tag2_en=?, desc_vi=?, desc_en=?, link=?, image=? WHERE id=?",
		)
		.bind(
			order,
			fields.title_vi || "", fields.title_en || "",
			fields.tag1_vi || "", fields.tag1_en || "",
			fields.tag2_vi || "", fields.tag2_en || "",
			fields.desc_vi || "", fields.desc_en || "",
			fields.link || "",
			image,
			id,
		)
		.run();
	return true;
}

export async function deleteProject(db, id) {
	await db.batch([
		db.prepare("DELETE FROM project_blocks WHERE project_id = ?").bind(id),
		db.prepare("DELETE FROM projects WHERE id = ?").bind(id),
	]);
}

export const addProjectBlock = (db, projectId, block) => addBlock(db, "project_blocks", "project_id", projectId, block);
export const updateProjectBlock = (db, projectId, blockId, fields) => updateBlock(db, "project_blocks", "project_id", projectId, blockId, fields);
export const deleteProjectBlock = (db, projectId, blockId) => deleteBlock(db, "project_blocks", "project_id", projectId, blockId);
export const moveProjectBlock = (db, projectId, blockId, direction) => moveBlock(db, "project_blocks", "project_id", projectId, blockId, direction);

export async function getProjectBlock(db, projectId, blockId) {
	return db.prepare("SELECT * FROM project_blocks WHERE project_id = ? AND id = ?").bind(projectId, blockId).first();
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export async function getPosts(db) {
	const { results } = await db.prepare("SELECT * FROM posts ORDER BY sort_order ASC").all();
	return results;
}

export async function getPost(db, id) {
	const post = await db.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
	if (!post) return null;
	post.blocks = await getBlocks(db, "post_blocks", "post_id", id);
	return post;
}

export async function getPostBySlug(db, slug) {
	const post = await db.prepare("SELECT * FROM posts WHERE slug = ?").bind(slug).first();
	if (!post) return null;
	post.blocks = await getBlocks(db, "post_blocks", "post_id", post.id);
	return post;
}

export async function createPost(db, fields) {
	const id = randHex(6);
	const maxRow = await db.prepare("SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM posts").first();
	const order = fields.order ? Number(fields.order) : (maxRow?.maxOrder ?? 0) + 1;
	const base = slugify(fields.slug || fields.title_vi || fields.title_en);
	const slug = await uniqueSlug(db, base, null);
	await db
		.prepare(
			"INSERT INTO posts (id, sort_order, date, date_display_vi, date_display_en, title_vi, title_en, excerpt_vi, excerpt_en, tag_vi, tag_en, slug, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		)
		.bind(
			id, order,
			fields.date || "", fields.date_display_vi || "", fields.date_display_en || "",
			fields.title_vi || "", fields.title_en || "",
			fields.excerpt_vi || "", fields.excerpt_en || "",
			fields.tag_vi || "", fields.tag_en || "",
			slug,
			fields.image || "/assets/images/feature-1.png",
		)
		.run();
	return id;
}

export async function updatePost(db, id, fields, newImage) {
	const existing = await db.prepare("SELECT image, sort_order FROM posts WHERE id = ?").bind(id).first();
	if (!existing) return false;
	const order = fields.order ? Number(fields.order) : existing.sort_order;
	const image = newImage || existing.image;
	const base = slugify(fields.slug || fields.title_vi || fields.title_en);
	const slug = await uniqueSlug(db, base, id);
	await db
		.prepare(
			"UPDATE posts SET sort_order=?, date=?, date_display_vi=?, date_display_en=?, title_vi=?, title_en=?, excerpt_vi=?, excerpt_en=?, tag_vi=?, tag_en=?, slug=?, image=? WHERE id=?",
		)
		.bind(
			order,
			fields.date || "", fields.date_display_vi || "", fields.date_display_en || "",
			fields.title_vi || "", fields.title_en || "",
			fields.excerpt_vi || "", fields.excerpt_en || "",
			fields.tag_vi || "", fields.tag_en || "",
			slug,
			image,
			id,
		)
		.run();
	return true;
}

export async function deletePost(db, id) {
	await db.batch([
		db.prepare("DELETE FROM post_blocks WHERE post_id = ?").bind(id),
		db.prepare("DELETE FROM posts WHERE id = ?").bind(id),
	]);
}

export const addPostBlock = (db, postId, block) => addBlock(db, "post_blocks", "post_id", postId, block);
export const updatePostBlock = (db, postId, blockId, fields) => updateBlock(db, "post_blocks", "post_id", postId, blockId, fields);
export const deletePostBlock = (db, postId, blockId) => deleteBlock(db, "post_blocks", "post_id", postId, blockId);
export const movePostBlock = (db, postId, blockId, direction) => moveBlock(db, "post_blocks", "post_id", postId, blockId, direction);

export async function getPostBlock(db, postId, blockId) {
	return db.prepare("SELECT * FROM post_blocks WHERE post_id = ? AND id = ?").bind(postId, blockId).first();
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function getAdmin(db) {
	return db.prepare("SELECT * FROM admin WHERE id = 1").first();
}

export async function setAdminPassword(db, { hash, salt, iterations }) {
	await db
		.prepare("UPDATE admin SET password_hash=?, pbkdf2_salt=?, pbkdf2_iterations=?, token_version = token_version + 1 WHERE id = 1")
		.bind(hash, salt, iterations)
		.run();
}

export async function bumpTokenVersion(db) {
	await db.prepare("UPDATE admin SET token_version = token_version + 1 WHERE id = 1").run();
}
