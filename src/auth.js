import { sign, verify } from "hono/jwt";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";

const COOKIE_NAME = "portfolio_session";
const SESSION_HOURS = 8;

function bytesToHex(bytes) {
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(hex) {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
	return bytes;
}

export async function pbkdf2Hash(password, saltHex, iterations = 100000) {
	const enc = new TextEncoder();
	const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
	const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, keyMaterial, 256);
	return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt), iterations };
}

export async function verifyPassword(password, storedHashHex, saltHex, iterations) {
	const { hash } = await pbkdf2Hash(password, saltHex, iterations);
	// Constant-time-ish compare (length-checked, XOR accumulate) — avoids trivial timing leaks.
	if (hash.length !== storedHashHex.length) return false;
	let diff = 0;
	for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ storedHashHex.charCodeAt(i);
	return diff === 0;
}

export async function createSessionCookie(c, { username, tokenVersion }) {
	const secret = c.env.SESSION_SECRET;
	const exp = Math.floor(Date.now() / 1000) + SESSION_HOURS * 60 * 60;
	const token = await sign({ username, tokenVersion, exp }, secret, "HS256");
	setCookie(c, COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: "Lax",
		secure: true,
		path: "/",
		maxAge: SESSION_HOURS * 60 * 60,
	});
}

export function clearSessionCookie(c) {
	deleteCookie(c, COOKIE_NAME, { path: "/" });
}

export async function getSession(c) {
	const token = getCookie(c, COOKIE_NAME);
	if (!token) return null;
	try {
		const payload = await verify(token, c.env.SESSION_SECRET, "HS256");
		return payload;
	} catch {
		return null;
	}
}

// Verifies the JWT signature/expiry AND that its tokenVersion still matches the
// live admin row — gives real server-side revocation (logout / password change)
// despite the cookie being stateless, at the cost of one D1 read per admin request.
export async function requireAuth(c, next) {
	const session = await getSession(c);
	if (!session) return c.redirect("/portfolio/admin/login");
	const admin = await c.env.DB.prepare("SELECT token_version, username FROM admin WHERE id = 1").first();
	if (!admin || admin.token_version !== session.tokenVersion) {
		clearSessionCookie(c);
		return c.redirect("/portfolio/admin/login");
	}
	c.set("adminUsername", admin.username);
	await next();
}
