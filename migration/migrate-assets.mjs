// One-time script: upload every file under assets/uploads/ to the R2 bucket,
// preserving the same relative path so existing image/src URLs in D1 stay valid.
// Run with: node migration/migrate-assets.mjs
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const UPLOADS_DIR = path.join(ROOT, "assets", "uploads");
const BUCKET = "portfolio-media";
const CONCURRENCY = 6;

const MIME = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".mp4": "video/mp4",
	".webm": "video/webm",
	".mov": "video/quicktime",
};

function walk(dir) {
	let out = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out = out.concat(walk(full));
		else if (entry.isFile()) out.push(full);
	}
	return out;
}

function uploadOne(filePath) {
	return new Promise((resolve, reject) => {
		const rel = path.relative(UPLOADS_DIR, filePath).split(path.sep).join("/");
		if (rel === ".gitkeep") return resolve({ rel, skipped: true });
		const key = `uploads/${rel}`;
		const ext = path.extname(filePath).toLowerCase();
		const contentType = MIME[ext] || "application/octet-stream";
		const wranglerBin = path.join(ROOT, "node_modules", ".bin", process.platform === "win32" ? "wrangler.cmd" : "wrangler");
		const rawArgs = ["r2", "object", "put", `${BUCKET}/${key}`, `--file=${filePath}`, "--remote", `--content-type=${contentType}`];
		const quote = (s) => (/\s/.test(s) ? `"${s}"` : s);
		const args = rawArgs.map(quote);
		const child = spawn(`"${wranglerBin}"`, args, { cwd: ROOT, shell: true });
		let stderr = "";
		child.stderr.on("data", (d) => (stderr += d));
		child.on("close", (code) => {
			if (code === 0) resolve({ rel, key });
			else reject(new Error(`Failed uploading ${rel} (exit ${code}): ${stderr.slice(-500)}`));
		});
	});
}

async function main() {
	const files = walk(UPLOADS_DIR);
	console.log(`Found ${files.length} files under assets/uploads/`);

	let idx = 0;
	let done = 0;
	let failed = [];

	async function worker() {
		while (idx < files.length) {
			const file = files[idx++];
			try {
				const r = await uploadOne(file);
				done++;
				if (!r.skipped) process.stdout.write(`\r${done}/${files.length} uploaded...`);
			} catch (err) {
				failed.push({ file, error: err.message });
				console.error(`\nFAILED: ${file}: ${err.message}`);
			}
		}
	}

	await Promise.all(Array.from({ length: CONCURRENCY }, worker));

	console.log(`\nDone. ${done - failed.length}/${files.length} succeeded, ${failed.length} failed.`);
	if (failed.length) {
		fs.writeFileSync(path.join(__dirname, "failed-uploads.json"), JSON.stringify(failed, null, 2));
		console.log(`Failed list written to migration/failed-uploads.json — re-run this script to retry (it will re-upload everything; cheap/idempotent since R2 put overwrites by key).`);
		process.exit(1);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
