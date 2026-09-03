// Ported verbatim from server.js (Express app), adapted only where the
// Workers runtime requires it (Web Crypto instead of Node's crypto module).

export function randHex(n) {
	const bytes = new Uint8Array(n);
	crypto.getRandomValues(bytes);
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const accentMap = {
	à: "a", á: "a", ạ: "a", ả: "a", ã: "a", â: "a", ầ: "a", ấ: "a", ậ: "a", ẩ: "a", ẫ: "a",
	ă: "a", ằ: "a", ắ: "a", ặ: "a", ẳ: "a", ẵ: "a",
	è: "e", é: "e", ẹ: "e", ẻ: "e", ẽ: "e", ê: "e", ề: "e", ế: "e", ệ: "e", ể: "e", ễ: "e",
	ì: "i", í: "i", ị: "i", ỉ: "i", ĩ: "i",
	ò: "o", ó: "o", ọ: "o", ỏ: "o", õ: "o", ô: "o", ồ: "o", ố: "o", ộ: "o", ổ: "o", ỗ: "o",
	ơ: "o", ờ: "o", ớ: "o", ợ: "o", ở: "o", ỡ: "o",
	ù: "u", ú: "u", ụ: "u", ủ: "u", ũ: "u", ư: "u", ừ: "u", ứ: "u", ự: "u", ử: "u", ữ: "u",
	ỳ: "y", ý: "y", ỵ: "y", ỷ: "y", ỹ: "y",
	đ: "d",
};

export function slugify(str) {
	if (!str) return "bai-viet";
	let s = String(str).toLowerCase();
	s = s.replace(/[à-ỹđ]/g, (c) => accentMap[c] || c);
	s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
	s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	return s || "bai-viet";
}

export async function uniqueSlug(db, base, excludeId) {
	let slug = base;
	let i = 2;
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const row = excludeId
			? await db.prepare("SELECT id FROM posts WHERE slug = ? AND id != ?").bind(slug, excludeId).first()
			: await db.prepare("SELECT id FROM posts WHERE slug = ?").bind(slug).first();
		if (!row) return slug;
		slug = `${base}-${i}`;
		i++;
	}
}

export function resolveVideoBlock(block) {
	const src = block.src || "";
	const yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
	if (yt) return { kind: "embed", embedUrl: `https://www.youtube.com/embed/${yt[1]}` };
	const vimeo = src.match(/vimeo\.com\/(\d+)/);
	if (vimeo) return { kind: "embed", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` };
	return { kind: "native", src };
}

// `file` is a Web File object (from c.req.parseBody()) or undefined.
export function buildBlockFromBody(body, file, fileUrl) {
	const type = body.type;
	const id = randHex(6);
	if (type === "text") {
		return { id, type, text_vi: body.text_vi || "", text_en: body.text_en || "" };
	}
	if (type === "image") {
		const block = { id, type, caption_vi: body.caption_vi || "", caption_en: body.caption_en || "" };
		if (fileUrl) block.src = fileUrl;
		return block;
	}
	if (type === "video") {
		const block = { id, type, caption_vi: body.caption_vi || "", caption_en: body.caption_en || "" };
		if (fileUrl) block.src = fileUrl;
		else if (body.videoUrl) block.src = String(body.videoUrl).trim();
		return block;
	}
	return null;
}

export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const BLOCK_MAX_BYTES = 30 * 1024 * 1024;
export const COVER_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
export const BLOCK_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".webm", ".mov"];

export function extOf(filename) {
	const m = /\.[a-z0-9]+$/i.exec(filename || "");
	return m ? m[0].toLowerCase() : "";
}

const MIME_BY_EXT = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".mp4": "video/mp4",
	".webm": "video/webm",
	".mov": "video/quicktime",
};
export function mimeOf(filename) {
	return MIME_BY_EXT[extOf(filename)] || "application/octet-stream";
}
