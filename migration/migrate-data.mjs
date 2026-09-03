// One-time script: read data/projects.json + data/blog.json and generate a
// SQL file to seed D1. Run with: node migration/migrate-data.mjs
// Then apply with: npx wrangler d1 execute portfolio-db --remote --file=migration/seed-data.sql
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function sqlStr(v) {
	if (v === undefined || v === null) return "NULL";
	return "'" + String(v).replace(/'/g, "''") + "'";
}
function sqlInt(v) {
	const n = Number(v);
	return Number.isFinite(n) ? String(n) : "0";
}

function pbkdf2Hash(password, saltHex, iterations = 100000) {
	const salt = saltHex ? Buffer.from(saltHex, "hex") : crypto.randomBytes(16);
	const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256");
	return { hash: hash.toString("hex"), salt: salt.toString("hex"), iterations };
}

const projects = JSON.parse(fs.readFileSync(path.join(ROOT, "data/projects.json"), "utf8"));
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, "data/blog.json"), "utf8"));

const lines = [];

for (const p of projects) {
	lines.push(
		`INSERT INTO projects (id, sort_order, title_vi, title_en, tag1_vi, tag1_en, tag2_vi, tag2_en, desc_vi, desc_en, link, image) VALUES (` +
			[
				sqlStr(p.id),
				sqlInt(p.order),
				sqlStr(p.title_vi),
				sqlStr(p.title_en),
				sqlStr(p.tag1_vi),
				sqlStr(p.tag1_en),
				sqlStr(p.tag2_vi),
				sqlStr(p.tag2_en),
				sqlStr(p.desc_vi),
				sqlStr(p.desc_en),
				sqlStr(p.link),
				sqlStr(p.image),
			].join(", ") +
			");",
	);
	(p.blocks || []).forEach((b, i) => {
		lines.push(
			`INSERT INTO project_blocks (id, project_id, position, type, text_vi, text_en, src, caption_vi, caption_en) VALUES (` +
				[
					sqlStr(b.id),
					sqlStr(p.id),
					sqlInt(i),
					sqlStr(b.type),
					sqlStr(b.text_vi),
					sqlStr(b.text_en),
					sqlStr(b.src),
					sqlStr(b.caption_vi),
					sqlStr(b.caption_en),
				].join(", ") +
				");",
		);
	});
}

for (const p of posts) {
	lines.push(
		`INSERT INTO posts (id, sort_order, date, date_display_vi, date_display_en, title_vi, title_en, excerpt_vi, excerpt_en, tag_vi, tag_en, slug, image) VALUES (` +
			[
				sqlStr(p.id),
				sqlInt(p.order),
				sqlStr(p.date),
				sqlStr(p.date_display_vi),
				sqlStr(p.date_display_en),
				sqlStr(p.title_vi),
				sqlStr(p.title_en),
				sqlStr(p.excerpt_vi),
				sqlStr(p.excerpt_en),
				sqlStr(p.tag_vi),
				sqlStr(p.tag_en),
				sqlStr(p.slug),
				sqlStr(p.image),
			].join(", ") +
			");",
	);
	(p.blocks || []).forEach((b, i) => {
		lines.push(
			`INSERT INTO post_blocks (id, post_id, position, type, text_vi, text_en, src, caption_vi, caption_en) VALUES (` +
				[
					sqlStr(b.id),
					sqlStr(p.id),
					sqlInt(i),
					sqlStr(b.type),
					sqlStr(b.text_vi),
					sqlStr(b.text_en),
					sqlStr(b.src),
					sqlStr(b.caption_vi),
					sqlStr(b.caption_en),
				].join(", ") +
				");",
		);
	});
}

const adminUser = process.env.ADMIN_USER || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(6).toString("hex");
const { hash, salt, iterations } = pbkdf2Hash(adminPassword);
lines.push(
	`INSERT INTO admin (id, username, password_hash, pbkdf2_salt, pbkdf2_iterations, token_version) VALUES (1, ${sqlStr(adminUser)}, ${sqlStr(hash)}, ${sqlStr(salt)}, ${iterations}, 1);`,
);

const outFile = path.join(__dirname, "seed-data.sql");
fs.writeFileSync(outFile, lines.join("\n") + "\n", "utf8");

console.log(`Wrote ${lines.length} statements to ${outFile}`);
console.log(`Projects: ${projects.length}, project_blocks: ${projects.reduce((s, p) => s + (p.blocks || []).length, 0)}`);
console.log(`Posts: ${posts.length}, post_blocks: ${posts.reduce((s, p) => s + (p.blocks || []).length, 0)}`);
console.log("================================================================");
console.log(` Admin account seeded (printed ONCE, save it):`);
console.log(`   Username: ${adminUser}`);
console.log(`   Password: ${adminPassword}`);
console.log("================================================================");
