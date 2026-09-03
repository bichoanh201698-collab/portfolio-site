// Snapshot the live D1 content and any new R2 uploads back into
// data/projects.json, data/blog.json and assets/uploads/ — an independent,
// human-readable, git-backed copy of the live site, separate from D1's own
// Time Travel (7-day point-in-time recovery). Run periodically, or whenever
// you want a fresh archive point, then `git add -A && git commit`.
//
// Usage: node migration/export-backup.mjs
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const wranglerBin = path.join(ROOT, "node_modules", ".bin", process.platform === "win32" ? "wrangler.cmd" : "wrangler");

function runWrangler(args) {
	return new Promise((resolve, reject) => {
		const quote = (s) => (/\s/.test(s) ? `"${s}"` : s);
		const child = spawn(`"${wranglerBin}"`, args.map(quote), { cwd: ROOT, shell: true });
		let stdout = "";
		let stderr = "";
		child.stdout.on("data", (d) => (stdout += d));
		child.stderr.on("data", (d) => (stderr += d));
		child.on("close", (code) => {
			if (code === 0) resolve(stdout);
			else reject(new Error(`wrangler ${args.join(" ")} failed: ${stderr.slice(-500)}`));
		});
	});
}

async function query(sql) {
	const out = await runWrangler(["d1", "execute", "portfolio-db", "--remote", "--json", `--command=${sql}`]);
	const parsed = JSON.parse(out);
	return parsed[0].results;
}

function nullToEmpty(v) {
	return v === null || v === undefined ? "" : v;
}

async function exportProjects() {
	const projects = await query("SELECT * FROM projects ORDER BY sort_order ASC");
	const blocks = await query("SELECT * FROM project_blocks ORDER BY project_id ASC, position ASC");
	const blocksByProject = new Map();
	for (const b of blocks) {
		if (!blocksByProject.has(b.project_id)) blocksByProject.set(b.project_id, []);
		blocksByProject.get(b.project_id).push({
			id: b.id,
			type: b.type,
			...(b.type === "text" ? { text_vi: nullToEmpty(b.text_vi), text_en: nullToEmpty(b.text_en) } : {}),
			...(b.type !== "text" ? { src: nullToEmpty(b.src) } : {}),
			...(b.type !== "text" ? { caption_vi: nullToEmpty(b.caption_vi), caption_en: nullToEmpty(b.caption_en) } : {}),
		});
	}
	const out = projects.map((p) => ({
		id: p.id,
		order: p.sort_order,
		title_vi: nullToEmpty(p.title_vi),
		title_en: nullToEmpty(p.title_en),
		tag1_vi: nullToEmpty(p.tag1_vi),
		tag1_en: nullToEmpty(p.tag1_en),
		tag2_vi: nullToEmpty(p.tag2_vi),
		tag2_en: nullToEmpty(p.tag2_en),
		desc_vi: nullToEmpty(p.desc_vi),
		desc_en: nullToEmpty(p.desc_en),
		link: nullToEmpty(p.link),
		image: nullToEmpty(p.image),
		blocks: blocksByProject.get(p.id) || [],
	}));
	fs.writeFileSync(path.join(ROOT, "data", "projects.json"), JSON.stringify(out, null, 2) + "\n", "utf8");
	return out.length;
}

async function exportPosts() {
	const posts = await query("SELECT * FROM posts ORDER BY sort_order ASC");
	const blocks = await query("SELECT * FROM post_blocks ORDER BY post_id ASC, position ASC");
	const blocksByPost = new Map();
	for (const b of blocks) {
		if (!blocksByPost.has(b.post_id)) blocksByPost.set(b.post_id, []);
		blocksByPost.get(b.post_id).push({
			id: b.id,
			type: b.type,
			...(b.type === "text" ? { text_vi: nullToEmpty(b.text_vi), text_en: nullToEmpty(b.text_en) } : {}),
			...(b.type !== "text" ? { src: nullToEmpty(b.src) } : {}),
			...(b.type !== "text" ? { caption_vi: nullToEmpty(b.caption_vi), caption_en: nullToEmpty(b.caption_en) } : {}),
		});
	}
	const out = posts.map((p) => ({
		id: p.id,
		order: p.sort_order,
		date: nullToEmpty(p.date),
		date_display_vi: nullToEmpty(p.date_display_vi),
		date_display_en: nullToEmpty(p.date_display_en),
		title_vi: nullToEmpty(p.title_vi),
		title_en: nullToEmpty(p.title_en),
		excerpt_vi: nullToEmpty(p.excerpt_vi),
		excerpt_en: nullToEmpty(p.excerpt_en),
		tag_vi: nullToEmpty(p.tag_vi),
		tag_en: nullToEmpty(p.tag_en),
		slug: p.slug,
		image: nullToEmpty(p.image),
		blocks: blocksByPost.get(p.id) || [],
	}));
	fs.writeFileSync(path.join(ROOT, "data", "blog.json"), JSON.stringify(out, null, 2) + "\n", "utf8");
	return out.length;
}

async function downloadNewR2Uploads() {
	const uploadsDir = path.join(ROOT, "assets", "uploads");
	const localFiles = new Set(fs.readdirSync(uploadsDir));

	// Collect every image/src path referenced in the freshly-exported JSON,
	// then diff against what's already on disk — anything missing was
	// uploaded via the live admin CMS since the original migration.
	const projects = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "projects.json"), "utf8"));
	const posts = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "blog.json"), "utf8"));
	const referenced = new Set();
	for (const p of [...projects, ...posts]) {
		if (p.image && p.image.startsWith("/assets/uploads/")) referenced.add(p.image.slice("/assets/uploads/".length));
		for (const b of p.blocks || []) {
			if (b.src && b.src.startsWith("/assets/uploads/")) referenced.add(b.src.slice("/assets/uploads/".length));
		}
	}

	const missing = [...referenced].filter((f) => !localFiles.has(f));
	console.log(`${missing.length} file(s) referenced in D1 but not yet in assets/uploads/ locally — downloading from R2...`);
	for (const filename of missing) {
		await runWrangler(["r2", "object", "get", `portfolio-media/uploads/${filename}`, `--file=${path.join(uploadsDir, filename)}`, "--remote"]);
		console.log(`  downloaded ${filename}`);
	}
	return missing.length;
}

async function main() {
	const projectCount = await exportProjects();
	const postCount = await exportPosts();
	const newFiles = await downloadNewR2Uploads();
	console.log(`\nBackup snapshot written:`);
	console.log(`  data/projects.json — ${projectCount} projects`);
	console.log(`  data/blog.json — ${postCount} posts`);
	console.log(`  assets/uploads/ — ${newFiles} new file(s) pulled from R2`);
	console.log(`\nReview with 'git status'/'git diff', then commit as a backup snapshot.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
