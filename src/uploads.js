import { mimeOf } from "./helpers.js";

// Serves R2 objects at the same /assets/uploads/<file> path express.static used
// to serve from local disk, including HTTP Range support (needed for <video>
// scrubbing/seeking — a naive full-object proxy silently breaks that).
export async function serveUpload(c) {
	const filename = c.req.param("filename");
	const key = `uploads/${filename}`;
	const rangeHeader = c.req.header("range");
	const headers = new Headers();
	headers.set("Content-Type", mimeOf(filename));
	headers.set("Cache-Control", "public, max-age=31536000, immutable");
	headers.set("Accept-Ranges", "bytes");

	if (!rangeHeader) {
		const obj = await c.env.BUCKET.get(key);
		if (!obj) return c.notFound();
		headers.set("Content-Length", String(obj.size));
		return new Response(obj.body, { status: 200, headers });
	}

	// Get the authoritative total size via HEAD first, so the Content-Range
	// "/total" is never guessed from the (possibly ambiguous) ranged GET result.
	const meta = await c.env.BUCKET.head(key);
	if (!meta) return c.notFound();
	const totalSize = meta.size;

	const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
	if (!match || (!match[1] && !match[2])) {
		headers.set("Content-Length", String(totalSize));
		const obj = await c.env.BUCKET.get(key);
		return new Response(obj.body, { status: 200, headers });
	}

	let start, end;
	if (match[1] !== "") {
		start = parseInt(match[1], 10);
		end = match[2] !== "" ? parseInt(match[2], 10) : totalSize - 1;
	} else {
		// suffix range: "bytes=-500" -> last 500 bytes
		const suffixLen = parseInt(match[2], 10);
		start = Math.max(0, totalSize - suffixLen);
		end = totalSize - 1;
	}
	end = Math.min(end, totalSize - 1);
	if (start > end || start >= totalSize) {
		headers.set("Content-Range", `bytes */${totalSize}`);
		return new Response(null, { status: 416, headers });
	}

	const length = end - start + 1;
	const obj = await c.env.BUCKET.get(key, { range: { offset: start, length } });
	if (!obj) return c.notFound();

	headers.set("Content-Range", `bytes ${start}-${end}/${totalSize}`);
	headers.set("Content-Length", String(length));
	return new Response(obj.body, { status: 206, headers });
}
