const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");
const SECRET_FILE = path.join(DATA_DIR, "session-secret.txt");
const UPLOADS_DIR = path.join(__dirname, "assets", "uploads");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function loadJSON(file, fallback) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf8"));
	} catch (err) {
		return fallback;
	}
}

function saveJSON(file, data) {
	fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

// ---------------------------------------------------------------------------
// First-run setup: seed sample projects, generate a session secret, and
// bootstrap a single admin account (credentials are printed once to the
// console so nothing sensitive lives in the repo).
// ---------------------------------------------------------------------------

if (!fs.existsSync(PROJECTS_FILE)) {
	saveJSON(PROJECTS_FILE, [
		{ id: crypto.randomBytes(6).toString("hex"), order: 1, title_vi: "Dự án số 01", title_en: "Project 01", tag1_vi: "Thiết kế UI", tag1_en: "UI Design", tag2_vi: "Web", tag2_en: "Web", desc_vi: "Mô tả ngắn gọn về dự án: bài toán cần giải quyết, vai trò của bạn và kết quả đạt được.", desc_en: "Short project description: the problem you solved, your role, and the outcome.", link: "", image: "/assets/images/feature-1.png" },
		{ id: crypto.randomBytes(6).toString("hex"), order: 2, title_vi: "Dự án số 02", title_en: "Project 02", tag1_vi: "Phát triển", tag1_en: "Development", tag2_vi: "Mobile", tag2_en: "Mobile", desc_vi: "Mô tả ngắn gọn về dự án: bài toán cần giải quyết, vai trò của bạn và kết quả đạt được.", desc_en: "Short project description: the problem you solved, your role, and the outcome.", link: "", image: "/assets/images/feature-2.png" },
		{ id: crypto.randomBytes(6).toString("hex"), order: 3, title_vi: "Dự án số 03", title_en: "Project 03", tag1_vi: "Thương hiệu", tag1_en: "Branding", tag2_vi: "Illustration", tag2_en: "Illustration", desc_vi: "Mô tả ngắn gọn về dự án: bài toán cần giải quyết, vai trò của bạn và kết quả đạt được.", desc_en: "Short project description: the problem you solved, your role, and the outcome.", link: "", image: "/assets/images/feature-3.png" },
		{ id: crypto.randomBytes(6).toString("hex"), order: 4, title_vi: "Dự án số 04", title_en: "Project 04", tag1_vi: "Web App", tag1_en: "Web App", tag2_vi: "", tag2_en: "", desc_vi: "Mô tả ngắn gọn về dự án: bài toán cần giải quyết, vai trò của bạn và kết quả đạt được.", desc_en: "Short project description: the problem you solved, your role, and the outcome.", link: "", image: "/assets/images/feature-1.png" },
		{ id: crypto.randomBytes(6).toString("hex"), order: 5, title_vi: "Dự án số 05", title_en: "Project 05", tag1_vi: "Nội dung", tag1_en: "Content", tag2_vi: "", tag2_en: "", desc_vi: "Mô tả ngắn gọn về dự án: bài toán cần giải quyết, vai trò của bạn và kết quả đạt được.", desc_en: "Short project description: the problem you solved, your role, and the outcome.", link: "", image: "/assets/images/feature-2.png" },
		{ id: crypto.randomBytes(6).toString("hex"), order: 6, title_vi: "Dự án số 06", title_en: "Project 06", tag1_vi: "Thử nghiệm", tag1_en: "Experiment", tag2_vi: "", tag2_en: "", desc_vi: "Mô tả ngắn gọn về dự án: bài toán cần giải quyết, vai trò của bạn và kết quả đạt được.", desc_en: "Short project description: the problem you solved, your role, and the outcome.", link: "", image: "/assets/images/feature-3.png" }
	]);
}

let sessionSecret;
if (fs.existsSync(SECRET_FILE)) {
	sessionSecret = fs.readFileSync(SECRET_FILE, "utf8").trim();
} else {
	sessionSecret = crypto.randomBytes(32).toString("hex");
	fs.writeFileSync(SECRET_FILE, sessionSecret, "utf8");
}

if (!fs.existsSync(ADMIN_FILE)) {
	const username = process.env.ADMIN_USER || "admin";
	const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(6).toString("hex");
	saveJSON(ADMIN_FILE, { username: username, passwordHash: bcrypt.hashSync(password, 10) });

	console.log("================================================================");
	console.log(" Tài khoản CMS admin vừa được tạo (chỉ hiện MỘT LẦN DUY NHẤT):");
	console.log("   Đăng nhập tại : /portfolio/admin/login");
	console.log("   Tên đăng nhập : " + username);
	console.log("   Mật khẩu      : " + password);
	console.log(" Hãy đổi mật khẩu ngay sau khi đăng nhập lần đầu.");
	console.log("================================================================");
}

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.use(session({
	name: "portfolio.sid",
	secret: sessionSecret,
	resave: false,
	saveUninitialized: false,
	cookie: { httpOnly: true, sameSite: "lax", maxAge: 8 * 60 * 60 * 1000 }
}));

function requireAuth(req, res, next) {
	if (req.session && req.session.isAdmin) return next();
	return res.redirect("/portfolio/admin/login");
}

const upload = multer({
	storage: multer.diskStorage({
		destination: UPLOADS_DIR,
		filename: function (req, file, cb) {
			cb(null, crypto.randomBytes(8).toString("hex") + path.extname(file.originalname).toLowerCase());
		}
	}),
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: function (req, file, cb) {
		const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
		const ok = allowed.includes(path.extname(file.originalname).toLowerCase());
		cb(ok ? null : new Error("Chỉ chấp nhận file ảnh (png, jpg, jpeg, webp, gif)."), ok);
	}
});

const blockUpload = multer({
	storage: multer.diskStorage({
		destination: UPLOADS_DIR,
		filename: function (req, file, cb) {
			cb(null, crypto.randomBytes(8).toString("hex") + path.extname(file.originalname).toLowerCase());
		}
	}),
	limits: { fileSize: 30 * 1024 * 1024 },
	fileFilter: function (req, file, cb) {
		const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".webm", ".mov"];
		const ok = allowed.includes(path.extname(file.originalname).toLowerCase());
		cb(ok ? null : new Error("Định dạng file không được hỗ trợ."), ok);
	}
});

function getProjects() {
	return loadJSON(PROJECTS_FILE, []).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
}

// Turns a YouTube/Vimeo URL into an embeddable iframe URL; anything else
// (an uploaded file path, or a direct .mp4 link) is played with <video>.
function resolveVideoBlock(block) {
	const src = block.src || "";
	const youtube = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);
	if (youtube) return { kind: "embed", embedUrl: "https://www.youtube.com/embed/" + youtube[1] };
	const vimeo = src.match(/vimeo\.com\/(\d+)/);
	if (vimeo) return { kind: "embed", embedUrl: "https://player.vimeo.com/video/" + vimeo[1] };
	return { kind: "native", src: src };
}

// ---------------------------------------------------------------------------
// Public portfolio page
// ---------------------------------------------------------------------------

app.get("/portfolio", function (req, res) {
	res.render("portfolio", { projects: getProjects() });
});

// ---------------------------------------------------------------------------
// Admin: auth
// ---------------------------------------------------------------------------

app.get("/portfolio/admin/login", function (req, res) {
	if (req.session && req.session.isAdmin) return res.redirect("/portfolio/admin");
	res.render("admin-login", { error: null });
});

app.post("/portfolio/admin/login", function (req, res) {
	const admin = loadJSON(ADMIN_FILE, null);
	const username = req.body.username || "";
	const password = req.body.password || "";

	if (admin && username === admin.username && bcrypt.compareSync(password, admin.passwordHash)) {
		req.session.isAdmin = true;
		req.session.username = username;
		return res.redirect("/portfolio/admin");
	}
	res.render("admin-login", { error: "Sai tên đăng nhập hoặc mật khẩu." });
});

app.post("/portfolio/admin/logout", requireAuth, function (req, res) {
	req.session.destroy(function () {
		res.redirect("/portfolio/admin/login");
	});
});

app.get("/portfolio/admin/change-password", requireAuth, function (req, res) {
	res.render("admin-change-password", { error: null, success: null });
});

app.post("/portfolio/admin/change-password", requireAuth, function (req, res) {
	const admin = loadJSON(ADMIN_FILE, null);
	const currentPassword = req.body.currentPassword || "";
	const newPassword = req.body.newPassword || "";
	const confirmPassword = req.body.confirmPassword || "";

	if (!admin || !bcrypt.compareSync(currentPassword, admin.passwordHash)) {
		return res.render("admin-change-password", { error: "Mật khẩu hiện tại không đúng.", success: null });
	}
	if (newPassword.length < 8) {
		return res.render("admin-change-password", { error: "Mật khẩu mới phải có ít nhất 8 ký tự.", success: null });
	}
	if (newPassword !== confirmPassword) {
		return res.render("admin-change-password", { error: "Xác nhận mật khẩu không khớp.", success: null });
	}

	admin.passwordHash = bcrypt.hashSync(newPassword, 10);
	saveJSON(ADMIN_FILE, admin);
	res.render("admin-change-password", { error: null, success: "Đổi mật khẩu thành công." });
});

// ---------------------------------------------------------------------------
// Admin: dashboard + CRUD for projects
// ---------------------------------------------------------------------------

app.get("/portfolio/admin", requireAuth, function (req, res) {
	res.render("admin-dashboard", { projects: getProjects(), username: req.session.username });
});

app.get("/portfolio/admin/new", requireAuth, function (req, res) {
	res.render("admin-form", { project: null, error: null });
});

app.post("/portfolio/admin/new", requireAuth, function (req, res, next) {
	upload.single("image")(req, res, function (err) {
		if (err) return res.render("admin-form", { project: req.body, error: err.message });

		const projects = loadJSON(PROJECTS_FILE, []);
		const maxOrder = projects.reduce(function (m, p) { return Math.max(m, p.order || 0); }, 0);

		projects.push({
			id: crypto.randomBytes(6).toString("hex"),
			order: req.body.order ? parseInt(req.body.order, 10) : maxOrder + 1,
			title_vi: req.body.title_vi || "",
			title_en: req.body.title_en || "",
			tag1_vi: req.body.tag1_vi || "",
			tag1_en: req.body.tag1_en || "",
			tag2_vi: req.body.tag2_vi || "",
			tag2_en: req.body.tag2_en || "",
			desc_vi: req.body.desc_vi || "",
			desc_en: req.body.desc_en || "",
			link: req.body.link || "",
			blocks: [],
			image: req.file ? "/assets/uploads/" + req.file.filename : "/assets/images/feature-1.png"
		});

		saveJSON(PROJECTS_FILE, projects);
		res.redirect("/portfolio/admin");
	});
});

app.get("/portfolio/admin/:id/edit", requireAuth, function (req, res) {
	const project = loadJSON(PROJECTS_FILE, []).find(function (p) { return p.id === req.params.id; });
	if (!project) return res.redirect("/portfolio/admin");
	res.render("admin-form", { project: project, error: null });
});

app.post("/portfolio/admin/:id/edit", requireAuth, function (req, res) {
	upload.single("image")(req, res, function (err) {
		const projects = loadJSON(PROJECTS_FILE, []);
		const project = projects.find(function (p) { return p.id === req.params.id; });
		if (!project) return res.redirect("/portfolio/admin");

		if (err) return res.render("admin-form", { project: Object.assign({}, project, req.body), error: err.message });

		Object.assign(project, {
			order: req.body.order ? parseInt(req.body.order, 10) : project.order,
			title_vi: req.body.title_vi || "",
			title_en: req.body.title_en || "",
			tag1_vi: req.body.tag1_vi || "",
			tag1_en: req.body.tag1_en || "",
			tag2_vi: req.body.tag2_vi || "",
			tag2_en: req.body.tag2_en || "",
			desc_vi: req.body.desc_vi || "",
			desc_en: req.body.desc_en || "",
			link: req.body.link || ""
		});
		if (req.file) project.image = "/assets/uploads/" + req.file.filename;

		saveJSON(PROJECTS_FILE, projects);
		res.redirect("/portfolio/admin");
	});
});

app.post("/portfolio/admin/:id/delete", requireAuth, function (req, res) {
	const projects = loadJSON(PROJECTS_FILE, []).filter(function (p) { return p.id !== req.params.id; });
	saveJSON(PROJECTS_FILE, projects);
	res.redirect("/portfolio/admin");
});

// ---------------------------------------------------------------------------
// Admin: content blocks (text / image / video) for a project's detail page
// ---------------------------------------------------------------------------

function buildBlockFromBody(body, file) {
	const type = body.type;
	const block = { id: crypto.randomBytes(6).toString("hex"), type: type };

	if (type === "text") {
		block.text_vi = body.text_vi || "";
		block.text_en = body.text_en || "";
	} else if (type === "image") {
		if (file) block.src = "/assets/uploads/" + file.filename;
		block.caption_vi = body.caption_vi || "";
		block.caption_en = body.caption_en || "";
	} else if (type === "video") {
		if (file) {
			block.src = "/assets/uploads/" + file.filename;
		} else if (body.videoUrl) {
			block.src = body.videoUrl.trim();
		}
		block.caption_vi = body.caption_vi || "";
		block.caption_en = body.caption_en || "";
	} else {
		return null;
	}
	return block;
}

app.post("/portfolio/admin/:id/blocks", requireAuth, function (req, res) {
	blockUpload.single("media")(req, res, function (err) {
		const projects = loadJSON(PROJECTS_FILE, []);
		const project = projects.find(function (p) { return p.id === req.params.id; });
		if (!project) return res.redirect("/portfolio/admin");
		if (err) return res.redirect("/portfolio/admin/" + project.id + "/edit");

		const block = buildBlockFromBody(req.body, req.file);
		if (!block || ((block.type === "image" || block.type === "video") && !block.src)) {
			return res.redirect("/portfolio/admin/" + project.id + "/edit");
		}

		if (!project.blocks) project.blocks = [];
		project.blocks.push(block);
		saveJSON(PROJECTS_FILE, projects);
		res.redirect("/portfolio/admin/" + project.id + "/edit");
	});
});

app.get("/portfolio/admin/:id/blocks/:blockId/edit", requireAuth, function (req, res) {
	const project = loadJSON(PROJECTS_FILE, []).find(function (p) { return p.id === req.params.id; });
	const block = project && (project.blocks || []).find(function (b) { return b.id === req.params.blockId; });
	if (!project || !block) return res.redirect("/portfolio/admin");
	res.render("admin-block-form", { project: project, block: block });
});

app.post("/portfolio/admin/:id/blocks/:blockId/edit", requireAuth, function (req, res) {
	blockUpload.single("media")(req, res, function (err) {
		const projects = loadJSON(PROJECTS_FILE, []);
		const project = projects.find(function (p) { return p.id === req.params.id; });
		const block = project && (project.blocks || []).find(function (b) { return b.id === req.params.blockId; });
		if (!project || !block) return res.redirect("/portfolio/admin");
		if (err) return res.redirect("/portfolio/admin/" + project.id + "/blocks/" + block.id + "/edit");

		if (block.type === "text") {
			block.text_vi = req.body.text_vi || "";
			block.text_en = req.body.text_en || "";
		} else if (block.type === "image") {
			if (req.file) block.src = "/assets/uploads/" + req.file.filename;
			block.caption_vi = req.body.caption_vi || "";
			block.caption_en = req.body.caption_en || "";
		} else if (block.type === "video") {
			if (req.file) block.src = "/assets/uploads/" + req.file.filename;
			else if (req.body.videoUrl) block.src = req.body.videoUrl.trim();
			block.caption_vi = req.body.caption_vi || "";
			block.caption_en = req.body.caption_en || "";
		}

		saveJSON(PROJECTS_FILE, projects);
		res.redirect("/portfolio/admin/" + project.id + "/edit");
	});
});

app.post("/portfolio/admin/:id/blocks/:blockId/delete", requireAuth, function (req, res) {
	const projects = loadJSON(PROJECTS_FILE, []);
	const project = projects.find(function (p) { return p.id === req.params.id; });
	if (!project) return res.redirect("/portfolio/admin");
	project.blocks = (project.blocks || []).filter(function (b) { return b.id !== req.params.blockId; });
	saveJSON(PROJECTS_FILE, projects);
	res.redirect("/portfolio/admin/" + project.id + "/edit");
});

app.post("/portfolio/admin/:id/blocks/:blockId/move", requireAuth, function (req, res) {
	const projects = loadJSON(PROJECTS_FILE, []);
	const project = projects.find(function (p) { return p.id === req.params.id; });
	if (!project) return res.redirect("/portfolio/admin");

	const blocks = project.blocks || [];
	const index = blocks.findIndex(function (b) { return b.id === req.params.blockId; });
	const direction = req.body.direction === "up" ? -1 : 1;
	const targetIndex = index + direction;

	if (index !== -1 && targetIndex >= 0 && targetIndex < blocks.length) {
		const tmp = blocks[index];
		blocks[index] = blocks[targetIndex];
		blocks[targetIndex] = tmp;
		saveJSON(PROJECTS_FILE, projects);
	}
	res.redirect("/portfolio/admin/" + project.id + "/edit");
});

// ---------------------------------------------------------------------------
// Public project detail page — registered last so it never shadows the
// literal /portfolio/admin/* routes above.
// ---------------------------------------------------------------------------

app.get("/portfolio/:id", function (req, res) {
	const project = getProjects().find(function (p) { return p.id === req.params.id; });
	if (!project) return res.redirect("/portfolio");

	const blocks = (project.blocks || []).map(function (b) {
		return b.type === "video" ? Object.assign({}, b, { video: resolveVideoBlock(b) }) : b;
	});

	res.render("portfolio-detail", { project: project, blocks: blocks });
});

app.listen(PORT, function () {
	console.log("Portfolio site đang chạy tại http://localhost:" + PORT);
});
