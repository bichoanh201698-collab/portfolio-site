import { html, raw } from "hono/html";
import { resolveVideoBlock } from "./helpers.js";

const ICON_SUN = raw(
	`<svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>`,
);
const ICON_MOON = raw(
	`<svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg>`,
);
const ICON_LINKEDIN = raw(
	`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>`,
);
const ICON_BEHANCE = raw(
	`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z"/></svg>`,
);
const ICON_TELEGRAM = raw(
	`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
);
const ICON_EMAIL = raw(
	`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>`,
);

const THEME_BOOTSTRAP_SCRIPT = raw(
	`<script>document.documentElement.setAttribute('data-i18n-loading', '');(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();</script>`,
);

function head({ title, description, canonical, ogType = "website", ogTitle, ogDesc, ogImage, extraHead }) {
	return html`
		${THEME_BOOTSTRAP_SCRIPT}
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${title}</title>
		<meta name="description" content="${description}">
		<link rel="canonical" href="${canonical}">
		<meta property="og:type" content="${ogType}">
		<meta property="og:title" content="${ogTitle || title}">
		<meta property="og:description" content="${ogDesc || description}">
		<meta property="og:url" content="${canonical}">
		${ogImage ? html`<meta property="og:image" content="${ogImage}">` : ""}
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:title" content="${ogTitle || title}">
		<meta name="twitter:description" content="${ogDesc || description}">
		${ogImage ? html`<meta name="twitter:image" content="${ogImage}">` : ""}
		<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/icon-32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/icon-16.png">
		<link rel="icon" type="image/png" sizes="192x192" href="/assets/favicon/icon-192.png">
		<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/icon-180.png">
		${extraHead || ""}
		<link rel="stylesheet" href="/css/style.css">
	`;
}

function headerNav({ activeNav }) {
	const navItem = (href, key, label) => html`<a href="${href}" ${activeNav === key ? 'class="is-active"' : raw("")} data-i18n="${"nav." + key}">${label}</a>`;
	return html`
		<div class="mobile-header">
			<a href="/" class="site-title" data-i18n="site.name">Shine Tu</a>
			<div class="mobile-header-right">
				<div class="lang-toggle" role="group" data-i18n-aria="lang.groupLabel" aria-label="Chọn ngôn ngữ">
					<button type="button" class="lang-btn is-active" data-lang="vi">VI</button>
					<button type="button" class="lang-btn" data-lang="en">EN</button>
				</div>
				<button type="button" class="theme-toggle" data-i18n-aria-vi="Chuyển giao diện sáng/tối" data-i18n-aria-en="Toggle light/dark mode" aria-label="Chuyển giao diện sáng/tối">
					${ICON_SUN}${ICON_MOON}
				</button>
				<button class="menu-toggle" data-i18n-aria="menu.toggleLabel" aria-label="Mở menu" aria-expanded="false">
					<span></span><span></span><span></span>
				</button>
			</div>
		</div>
		<nav class="mobile-nav">
			${navItem("/", "home", "Trang chủ")}
			${navItem("/portfolio", "portfolio", "Portfolio")}
			${navItem("/blog.html", "blog", "Blog")}
			${navItem("/about.html", "about", "Giới thiệu")}
			${navItem("/contact.html", "contact", "Liên hệ")}
		</nav>

		<div class="layout">
			<aside class="sidebar">
				<a href="/" class="site-title" data-i18n="site.name">Shine Tu</a>
				<nav class="sidebar-nav">
					${navItem("/", "home", "Trang chủ")}
					${navItem("/portfolio", "portfolio", "Portfolio")}
					${navItem("/blog.html", "blog", "Blog")}
					${navItem("/about.html", "about", "Giới thiệu")}
					${navItem("/contact.html", "contact", "Liên hệ")}
				</nav>
				<div class="sidebar-bottom">
					<div class="lang-toggle" role="group" data-i18n-aria="lang.groupLabel" aria-label="Chọn ngôn ngữ">
						<button type="button" class="lang-btn is-active" data-lang="vi">VI</button>
						<button type="button" class="lang-btn" data-lang="en">EN</button>
					</div>
					<button type="button" class="theme-toggle" data-i18n-aria-vi="Chuyển giao diện sáng/tối" data-i18n-aria-en="Toggle light/dark mode" aria-label="Chuyển giao diện sáng/tối">
						${ICON_SUN}${ICON_MOON}
					</button>
					<div class="sidebar-social">
						<a href="https://www.linkedin.com/in/oanh-tu-833847175/" target="_blank" rel="noopener" aria-label="LinkedIn">${ICON_LINKEDIN}</a>
						<a href="https://www.behance.net/shinetu" target="_blank" rel="noopener" aria-label="Behance">${ICON_BEHANCE}</a>
						<a href="https://t.me/Shinetu" target="_blank" rel="noopener" aria-label="Telegram">${ICON_TELEGRAM}</a>
						<a href="mailto:shinetu.ds@gmail.com" aria-label="Email">${ICON_EMAIL}</a>
					</div>
				</div>
			</aside>

			<div class="content">
	`;
}

function footerAndClose() {
	return html`
				<footer class="site-footer">
					<div><strong data-i18n="footer.copyright">© 2026 Shine Tu</strong></div>
				</footer>
			</div>
		</div>
		<script src="/js/main.js"></script>
	`;
}

function publicPage({ head: headOpts, activeNav, body }) {
	return html`<!DOCTYPE html>
<html lang="vi">
<head>
${head(headOpts)}
</head>
<body>
${headerNav({ activeNav })}
${body}
${footerAndClose()}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Public: Portfolio
// ---------------------------------------------------------------------------

export function portfolioListPage({ projects, siteUrl }) {
	const body = html`
		<section class="section-tight">
			<p class="eyebrow" data-i18n="portfolio.eyebrow">Sản phẩm của tôi</p>
			<h1>Portfolio</h1>
			<p data-i18n="portfolio.desc">Tuyển chọn các dự án nhận diện thương hiệu, chiến dịch và trải nghiệm số tôi đã trực tiếp thực hiện, từ concept đầu tiên đến sản phẩm hoàn chỉnh.</p>
		</section>
		<hr class="separator">
		<section class="section">
			${
				projects.length === 0
					? html`<p class="text-secondary" data-i18n-vi="Chưa có dự án nào. Vào trang quản trị để thêm dự án đầu tiên." data-i18n-en="No projects yet. Go to the admin dashboard to add your first project.">Chưa có dự án nào. Vào trang quản trị để thêm dự án đầu tiên.</p>`
					: html`<div class="grid">
							${projects.map(
								(p) => html`
								<div class="card">
									<a href="/portfolio/${p.id}"><img src="${p.image}" alt="${p.title_vi}"></a>
									<div class="card-body">
										<div class="card-tags">
											${p.tag1_vi || p.tag1_en ? html`<span class="tag" data-i18n-vi="${p.tag1_vi}" data-i18n-en="${p.tag1_en}">${p.tag1_vi}</span>` : ""}
											${p.tag2_vi || p.tag2_en ? html`<span class="tag" data-i18n-vi="${p.tag2_vi}" data-i18n-en="${p.tag2_en}">${p.tag2_vi}</span>` : ""}
										</div>
										<h6 data-i18n-vi="${p.title_vi}" data-i18n-en="${p.title_en}">${p.title_vi}</h6>
										<p data-i18n-vi="${p.desc_vi}" data-i18n-en="${p.desc_en}">${p.desc_vi}</p>
										<div><a href="/portfolio/${p.id}" class="btn btn-dark" data-i18n="portfolio.viewDetails">Xem chi tiết</a></div>
									</div>
								</div>
							`,
							)}
						</div>`
			}
		</section>
		${ctaBox()}
	`;
	return publicPage({
		activeNav: "portfolio",
		head: {
			title: "Portfolio — Shine Tu",
			description: "Portfolio thiết kế của Shine Tu — tổng hợp các dự án Graphic Design, Branding và Creative Direction cho nhiều thương hiệu trong và ngoài nước.",
			canonical: `${siteUrl}/portfolio`,
			ogDesc: "Tổng hợp các dự án Graphic Design, Branding và Creative Direction của Shine Tu.",
		},
		body,
	});
}

function ctaBox() {
	return html`
		<section class="section">
			<div class="cta-box">
				<h3 data-i18n="portfolio.cta.title">Có dự án muốn hợp tác?</h3>
				<p data-i18n="portfolio.cta.desc">Tôi luôn sẵn sàng lắng nghe những ý tưởng mới. Hãy để lại lời nhắn cho tôi.</p>
				<hr class="separator-small">
				<a href="/contact.html" class="btn btn-outline" data-i18n="portfolio.cta.btn">Liên hệ ngay</a>
			</div>
		</section>
	`;
}

function detailBlock(b, fallbackAlt) {
	if (b.type === "text") return null; // handled per-page (raw vs escaped differs)
	if (b.type === "image") {
		return html`
			<figure class="detail-figure">
				<img class="detail-block-image" src="${b.src}" alt="${b.caption_vi || fallbackAlt || ""}">
				${b.caption_vi || b.caption_en ? html`<figcaption class="detail-caption" data-i18n-vi="${b.caption_vi}" data-i18n-en="${b.caption_en}">${b.caption_vi}</figcaption>` : ""}
			</figure>
		`;
	}
	if (b.type === "video" && b.src) {
		const video = resolveVideoBlock(b);
		return html`
			<figure class="detail-figure">
				${
					video.kind === "embed"
						? html`<div class="detail-video-wrapper"><iframe src="${video.embedUrl}" title="video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
						: html`<video class="detail-block-video" src="${video.src}" controls></video>`
				}
				${b.caption_vi || b.caption_en ? html`<figcaption class="detail-caption" data-i18n-vi="${b.caption_vi}" data-i18n-en="${b.caption_en}">${b.caption_vi}</figcaption>` : ""}
			</figure>
		`;
	}
	return "";
}

export function portfolioDetailPage({ project, siteUrl }) {
	const blocks = project.blocks || [];
	const hasTextBlock = blocks.some((b) => b.type === "text");
	const jsonLd = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: project.title_vi,
		description: project.desc_vi,
		image: siteUrl + project.image,
		url: `${siteUrl}/portfolio/${project.id}`,
		creator: { "@type": "Person", name: "Shine Tu" },
	});
	const body = html`
		<a href="/portfolio" class="detail-back" data-i18n-vi="← Quay lại Portfolio" data-i18n-en="← Back to Portfolio">← Quay lại Portfolio</a>
		<section class="section-tight detail-text">
			<div class="card-tags">
				${project.tag1_vi || project.tag1_en ? html`<span class="tag" data-i18n-vi="${project.tag1_vi}" data-i18n-en="${project.tag1_en}">${project.tag1_vi}</span>` : ""}
				${project.tag2_vi || project.tag2_en ? html`<span class="tag" data-i18n-vi="${project.tag2_vi}" data-i18n-en="${project.tag2_en}">${project.tag2_vi}</span>` : ""}
			</div>
			<h1 data-i18n-vi="${project.title_vi}" data-i18n-en="${project.title_en}">${project.title_vi}</h1>
		</section>
		<img class="detail-image" src="${project.image}" alt="${project.title_vi}">
		<section class="section-tight detail-text">
			${!hasTextBlock ? html`<p class="detail-content" data-i18n-vi="${project.desc_vi}" data-i18n-en="${project.desc_en}">${project.desc_vi}</p>` : ""}
			${
				blocks.length > 0
					? blocks.map((b) =>
							b.type === "text"
								? html`<p class="detail-content" data-i18n-html-vi="${b.text_vi}" data-i18n-html-en="${b.text_en}">${raw(b.text_vi || "")}</p>`
								: detailBlock(b, project.title_vi),
						)
					: html`<p class="detail-content" data-i18n-vi="${project.desc_vi}" data-i18n-en="${project.desc_en}">${project.desc_vi}</p>`
			}
			${
				project.link && project.link !== "#"
					? html`<div class="detail-actions"><a href="${project.link}" target="_blank" rel="noopener" class="btn btn-primary" data-i18n-vi="Xem liên kết ngoài ↗" data-i18n-en="View external link ↗">Xem liên kết ngoài ↗</a></div>`
					: ""
			}
		</section>
		${ctaBox()}
	`;
	return publicPage({
		activeNav: "portfolio",
		head: {
			title: `${project.title_vi} — Shine Tu`,
			description: project.desc_vi,
			canonical: `${siteUrl}/portfolio/${project.id}`,
			ogType: "article",
			ogImage: siteUrl + project.image,
			extraHead: html`<script type="application/ld+json">${raw(jsonLd)}</script>`,
		},
		body,
	});
}

// ---------------------------------------------------------------------------
// Public: Blog
// ---------------------------------------------------------------------------

export function blogListPage({ posts, siteUrl }) {
	const body = html`
		<section class="section-tight">
			<p class="eyebrow" data-i18n="blog.eyebrow">Nhật ký</p>
			<h1>Blog</h1>
			<p data-i18n="blog.desc">Những bài viết về công việc, quá trình sáng tạo và những điều tôi học được trên đường đi.</p>
		</section>
		<hr class="separator">
		<section class="section">
			${
				posts.length === 0
					? html`<p class="text-secondary" data-i18n-vi="Chưa có bài viết nào. Vào trang quản trị để thêm bài viết đầu tiên." data-i18n-en="No posts yet. Go to the admin dashboard to add your first post.">Chưa có bài viết nào. Vào trang quản trị để thêm bài viết đầu tiên.</p>`
					: html`<div class="grid">
							${posts.map(
								(p) => html`
								<article class="post-card">
									<a href="/blog/${p.slug}"><img src="${p.image}" alt="${p.title_vi}"></a>
									${p.tag_vi || p.tag_en ? html`<span class="tag" data-i18n-vi="${p.tag_vi}" data-i18n-en="${p.tag_en}">${p.tag_vi}</span>` : ""}
									<span class="post-date" data-i18n-vi="${p.date_display_vi}" data-i18n-en="${p.date_display_en}">${p.date_display_vi}</span>
									<h6 class="post-title"><a href="/blog/${p.slug}" data-i18n-vi="${p.title_vi}" data-i18n-en="${p.title_en}">${p.title_vi}</a></h6>
									<p class="post-excerpt" data-i18n-vi="${p.excerpt_vi}" data-i18n-en="${p.excerpt_en}">${p.excerpt_vi}</p>
								</article>
							`,
							)}
						</div>`
			}
		</section>
	`;
	return publicPage({
		activeNav: "blog",
		head: {
			title: "Blog — Shine Tu",
			description: "Blog cá nhân của Shine Tu — những bài viết về thiết kế, sáng tạo và cuộc sống.",
			canonical: `${siteUrl}/blog.html`,
			ogDesc: "Những bài viết về thiết kế, sáng tạo và cuộc sống.",
		},
		body,
	});
}

export function blogPostPage({ post, siteUrl }) {
	const blocks = post.blocks || [];
	const jsonLd = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title_vi,
		description: post.excerpt_vi,
		image: siteUrl + post.image,
		url: `${siteUrl}/blog/${post.slug}`,
		datePublished: post.date,
		author: { "@type": "Person", name: "Oanh Tu" },
	});
	const body = html`
		<a href="/blog.html" class="detail-back" data-i18n-vi="← Quay lại Blog" data-i18n-en="← Back to Blog">← Quay lại Blog</a>
		<section class="section-tight detail-text">
			<div class="card-tags">
				${post.tag_vi || post.tag_en ? html`<span class="tag" data-i18n-vi="${post.tag_vi}" data-i18n-en="${post.tag_en}">${post.tag_vi}</span>` : ""}
				<span class="post-date" data-i18n-vi="${post.date_display_vi}" data-i18n-en="${post.date_display_en}">${post.date_display_vi}</span>
			</div>
			<h1 data-i18n-vi="${post.title_vi}" data-i18n-en="${post.title_en}">${post.title_vi}</h1>
		</section>
		<img class="detail-image" src="${post.image}" alt="${post.title_vi}">
		<section class="section-tight detail-text">
			${
				blocks.length > 0
					? blocks.map((b) =>
							b.type === "text"
								? html`<p class="detail-content" data-i18n-vi="${b.text_vi}" data-i18n-en="${b.text_en}">${b.text_vi}</p>`
								: detailBlock(b, post.title_vi),
						)
					: html`<p class="detail-content" data-i18n-vi="${post.excerpt_vi}" data-i18n-en="${post.excerpt_en}">${post.excerpt_vi}</p>`
			}
		</section>
	`;
	return publicPage({
		activeNav: "blog",
		head: {
			title: `${post.title_vi} — Shine Tu`,
			description: post.excerpt_vi,
			canonical: `${siteUrl}/blog/${post.slug}`,
			ogType: "article",
			ogImage: siteUrl + post.image,
			extraHead: html`<meta property="article:published_time" content="${post.date}"><script type="application/ld+json">${raw(jsonLd)}</script>`,
		},
		body,
	});
}

// ---------------------------------------------------------------------------
// Admin: shared shell
// ---------------------------------------------------------------------------

function adminAuthPage({ title, heading, subtitle, error, success, formHtml, backHref, backLabel }) {
	return html`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div class="admin-auth">
	<div class="card-panel">
		<p class="eyebrow">Portfolio CMS</p>
		<h3 class="mb-0">${heading}</h3>
		${subtitle ? html`<p class="text-secondary">${subtitle}</p>` : ""}
		${error ? html`<div class="admin-error">${error}</div>` : ""}
		${success ? html`<div class="admin-success">${success}</div>` : ""}
		${formHtml}
	</div>
	<p class="text-secondary" style="text-align:center; margin-top:1.5em;"><a href="${backHref}">&larr; ${backLabel}</a></p>
</div>
</body>
</html>`;
}

function adminShell({ title, eyebrow, heading, topActions, error, body }) {
	return html`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div class="admin-shell">
	<div class="admin-topbar">
		<div>
			<p class="eyebrow mb-0">${eyebrow}</p>
			<h3 class="mb-0">${heading}</h3>
		</div>
		<div class="admin-topbar-actions">${topActions}</div>
	</div>
	${error ? html`<div class="admin-error">${error}</div>` : ""}
	${body}
</div>
</body>
</html>`;
}

export function adminLoginPage({ error }) {
	return adminAuthPage({
		title: "Đăng nhập quản trị — Portfolio",
		heading: "Đăng nhập quản trị",
		subtitle: "Đăng nhập để quản lý danh sách dự án tại /portfolio.",
		error,
		backHref: "/portfolio",
		backLabel: "Quay lại trang Portfolio",
		formHtml: html`
			<form method="POST" action="/portfolio/admin/login">
				<div class="form-row">
					<label for="username">Tên đăng nhập</label>
					<input type="text" id="username" name="username" required autofocus>
				</div>
				<div class="form-row">
					<label for="password">Mật khẩu</label>
					<input type="password" id="password" name="password" required>
				</div>
				<button type="submit" class="btn btn-primary">Đăng nhập</button>
			</form>
		`,
	});
}

export function adminChangePasswordPage({ error, success }) {
	return adminAuthPage({
		title: "Đổi mật khẩu — Portfolio CMS",
		heading: "Đổi mật khẩu",
		error,
		success,
		backHref: "/portfolio/admin",
		backLabel: "Quay lại trang quản trị",
		formHtml: html`
			<form method="POST" action="/portfolio/admin/change-password">
				<div class="form-row">
					<label for="currentPassword">Mật khẩu hiện tại</label>
					<input type="password" id="currentPassword" name="currentPassword" required>
				</div>
				<div class="form-row">
					<label for="newPassword">Mật khẩu mới (tối thiểu 8 ký tự)</label>
					<input type="password" id="newPassword" name="newPassword" minlength="8" required>
				</div>
				<div class="form-row">
					<label for="confirmPassword">Xác nhận mật khẩu mới</label>
					<input type="password" id="confirmPassword" name="confirmPassword" minlength="8" required>
				</div>
				<button type="submit" class="btn btn-primary">Cập nhật mật khẩu</button>
			</form>
		`,
	});
}

const topbarCommon = () => html`
	<a href="/portfolio/admin/change-password" class="btn btn-outline btn-small">Đổi mật khẩu</a>
	<form method="POST" action="/portfolio/admin/logout"><button type="submit" class="btn btn-dark btn-small">Đăng xuất</button></form>
`;

export function adminDashboardPage({ projects, username }) {
	const body = html`
		<div style="margin-bottom:1.5em;"><a href="/portfolio/admin/new" class="btn btn-primary">+ Thêm dự án mới</a></div>
		${
			projects.length === 0
				? html`<p class="text-secondary">Chưa có dự án nào. Bấm "Thêm dự án mới" để bắt đầu.</p>`
				: html`<div style="overflow-x:auto;">
						<table class="admin-table">
							<thead><tr><th>Ảnh</th><th>Thứ tự</th><th>Tên dự án (VI / EN)</th><th>Hành động</th></tr></thead>
							<tbody>
								${projects.map(
									(p) => html`
									<tr>
										<td><img src="${p.image}" alt=""></td>
										<td>${p.sort_order}</td>
										<td>${p.title_vi}<br><span class="text-secondary">${p.title_en}</span></td>
										<td>
											<div class="admin-table-actions">
												<a href="/portfolio/admin/${p.id}/edit" class="btn btn-outline btn-small">Sửa</a>
												<form method="POST" action="/portfolio/admin/${p.id}/delete" onsubmit="return confirm('Xoá dự án này? Hành động không thể hoàn tác.');">
													<button type="submit" class="btn btn-danger btn-small">Xoá</button>
												</form>
											</div>
										</td>
									</tr>
								`,
								)}
							</tbody>
						</table>
					</div>`
		}
	`;
	return adminShell({
		title: "Quản trị Portfolio",
		eyebrow: "Portfolio CMS",
		heading: "Quản lý dự án",
		topActions: html`
			<a href="/portfolio" target="_blank" class="btn btn-outline btn-small">Xem trang Portfolio</a>
			${topbarCommon()}
		`,
		body: html`<p class="text-secondary mb-0" style="margin-top:-1em;margin-bottom:1.5em;">Đăng nhập với: <strong>${username}</strong></p>${body}`,
	});
}

function blockTypeLabel(type) {
	return type === "text" ? "Văn bản" : type === "image" ? "Ảnh" : "Video";
}

function blockList({ blocks, baseUrl }) {
	if (blocks.length === 0) return html`<p class="text-secondary">Chưa có khối nội dung nào.</p>`;
	return html`<div class="block-list">
		${blocks.map(
			(b, i) => html`
			<div class="block-item">
				<span class="block-item-type">${blockTypeLabel(b.type)}</span>
				<span class="block-item-preview">
					${
						b.type === "text"
							? (b.text_vi || b.text_en || "").slice(0, 90)
							: b.type === "image"
								? html`<img src="${b.src}" alt="">${b.caption_vi || b.src}`
								: b.caption_vi || b.src
					}
				</span>
				<div class="block-item-actions">
					<form method="POST" action="${baseUrl}/${b.id}/move">
						<input type="hidden" name="direction" value="up">
						<button type="submit" class="btn btn-outline" ${i === 0 ? "disabled" : ""}>↑</button>
					</form>
					<form method="POST" action="${baseUrl}/${b.id}/move">
						<input type="hidden" name="direction" value="down">
						<button type="submit" class="btn btn-outline" ${i === blocks.length - 1 ? "disabled" : ""}>↓</button>
					</form>
					<a href="${baseUrl}/${b.id}/edit" class="btn btn-outline">Sửa</a>
					<form method="POST" action="${baseUrl}/${b.id}/delete" onsubmit="return confirm('Xoá khối này?');">
						<button type="submit" class="btn btn-danger">Xoá</button>
					</form>
				</div>
			</div>
		`,
		)}
	</div>`;
}

const ADD_BLOCK_SCRIPT = raw(`<script>
(function () {
	var select = document.getElementById("type");
	var groups = document.querySelectorAll(".block-type-fields");
	var captionFields = document.querySelectorAll("[data-caption-field]");
	function sync() {
		var value = select.value;
		groups.forEach(function (g) { g.classList.toggle("is-visible", g.getAttribute("data-block-type") === value); });
		captionFields.forEach(function (f) { f.style.display = value === "text" ? "none" : ""; });
	}
	select.addEventListener("change", sync);
	sync();
})();
</script>`);

function addBlockPanel({ addUrl }) {
	return html`
		<div class="add-block-panel">
			<h6 class="mb-0" style="margin-bottom:1em;">+ Thêm khối nội dung</h6>
			<form method="POST" action="${addUrl}" enctype="multipart/form-data" id="add-block-form">
				<div class="form-row">
					<label for="type">Loại khối</label>
					<select id="type" name="type">
						<option value="text">Đoạn văn</option>
						<option value="image">Ảnh</option>
						<option value="video">Video</option>
					</select>
				</div>
				<div class="block-type-fields" data-block-type="text">
					<div class="form-row"><label for="text_vi">Nội dung (Tiếng Việt)</label><textarea id="text_vi" name="text_vi" rows="4"></textarea></div>
					<div class="form-row"><label for="text_en">Nội dung (English)</label><textarea id="text_en" name="text_en" rows="4"></textarea></div>
				</div>
				<div class="block-type-fields" data-block-type="image">
					<div class="form-row"><label for="image_media">Ảnh</label><input type="file" id="image_media" name="media" accept=".png,.jpg,.jpeg,.webp,.gif"></div>
				</div>
				<div class="block-type-fields" data-block-type="video">
					<div class="form-row"><label for="video_media">Upload file video (mp4/webm/mov, tối đa 30MB)</label><input type="file" id="video_media" name="media" accept=".mp4,.webm,.mov"></div>
					<div class="form-row">
						<label for="videoUrl">Hoặc dán link YouTube / Vimeo</label>
						<input type="text" id="videoUrl" name="videoUrl" placeholder="https://youtube.com/watch?v=...">
						<p class="field-hint">Chỉ cần điền một trong hai — nếu có file upload thì ưu tiên dùng file.</p>
					</div>
				</div>
				<div class="form-row" data-caption-field><label for="caption_vi">Chú thích (Tiếng Việt, tuỳ chọn)</label><input type="text" id="caption_vi" name="caption_vi"></div>
				<div class="form-row" data-caption-field><label for="caption_en">Chú thích (English, tuỳ chọn)</label><input type="text" id="caption_en" name="caption_en"></div>
				<button type="submit" class="btn btn-primary">Thêm khối</button>
			</form>
		</div>
		${ADD_BLOCK_SCRIPT}
	`;
}

export function adminFormPage({ project, error }) {
	const isEdit = !!(project && project.id);
	const body = html`
		<form method="POST" action="${isEdit ? `/portfolio/admin/${project.id}/edit` : "/portfolio/admin/new"}" enctype="multipart/form-data">
			${
				project && project.image
					? html`<div class="current-image"><label class="mb-0">Ảnh hiện tại</label><img src="${project.image}" alt=""></div>`
					: ""
			}
			<div class="form-row">
				<label for="image">Ảnh dự án ${isEdit ? "(bỏ trống nếu giữ ảnh cũ)" : ""}</label>
				<input type="file" id="image" name="image" accept=".png,.jpg,.jpeg,.webp,.gif">
			</div>
			<div class="admin-form-grid">
				<div class="form-row"><label for="title_vi">Tên dự án (Tiếng Việt)</label><input type="text" id="title_vi" name="title_vi" value="${(project && project.title_vi) || ""}" required></div>
				<div class="form-row"><label for="title_en">Tên dự án (English)</label><input type="text" id="title_en" name="title_en" value="${(project && project.title_en) || ""}" required></div>
				<div class="form-row"><label for="tag1_vi">Tag 1 (Tiếng Việt)</label><input type="text" id="tag1_vi" name="tag1_vi" value="${(project && project.tag1_vi) || ""}"></div>
				<div class="form-row"><label for="tag1_en">Tag 1 (English)</label><input type="text" id="tag1_en" name="tag1_en" value="${(project && project.tag1_en) || ""}"></div>
				<div class="form-row"><label for="tag2_vi">Tag 2 (Tiếng Việt)</label><input type="text" id="tag2_vi" name="tag2_vi" value="${(project && project.tag2_vi) || ""}"></div>
				<div class="form-row"><label for="tag2_en">Tag 2 (English)</label><input type="text" id="tag2_en" name="tag2_en" value="${(project && project.tag2_en) || ""}"></div>
				<div class="form-row form-row-full"><label for="desc_vi">Mô tả ngắn — hiện ở thẻ dự án (Tiếng Việt)</label><textarea id="desc_vi" name="desc_vi" rows="3" required>${(project && project.desc_vi) || ""}</textarea></div>
				<div class="form-row form-row-full"><label for="desc_en">Mô tả ngắn — hiện ở thẻ dự án (English)</label><textarea id="desc_en" name="desc_en" rows="3" required>${(project && project.desc_en) || ""}</textarea></div>
				<div class="form-row">
					<label for="link">Link ngoài (tuỳ chọn — demo, GitHub, Behance...)</label>
					<input type="text" id="link" name="link" value="${(project && project.link) || ""}" placeholder="https://...">
					<p class="field-hint">Nếu để trống, trang chi tiết sẽ không hiện nút này.</p>
				</div>
				<div class="form-row">
					<label for="order">Thứ tự hiển thị</label>
					<input type="number" id="order" name="order" value="${(project && project.sort_order) || ""}">
					<p class="field-hint">Số nhỏ hơn hiển thị trước.</p>
				</div>
			</div>
			<button type="submit" class="btn btn-primary">${isEdit ? "Lưu thay đổi" : "Thêm dự án"}</button>
		</form>
		${
			isEdit
				? html`
					<hr class="separator" style="margin:3em 0;">
					<h3>Nội dung chi tiết</h3>
					<p class="text-secondary">Thêm đoạn văn, ảnh, video — hiển thị theo đúng thứ tự bên dưới ở trang "Xem chi tiết". Dùng nút ↑ ↓ để sắp xếp lại.</p>
					${blockList({ blocks: project.blocks || [], baseUrl: `/portfolio/admin/${project.id}/blocks` })}
					${addBlockPanel({ addUrl: `/portfolio/admin/${project.id}/blocks` })}
				`
				: html`<p class="text-secondary" style="margin-top:2em;">Lưu dự án trước, sau đó bạn có thể thêm đoạn văn / ảnh / video cho trang chi tiết.</p>`
		}
	`;
	return adminShell({
		title: `${isEdit ? "Sửa dự án" : "Thêm dự án"} — Portfolio CMS`,
		eyebrow: "Portfolio CMS",
		heading: isEdit ? "Sửa dự án" : "Thêm dự án mới",
		topActions: html`<a href="/portfolio/admin" class="btn btn-outline btn-small">&larr; Quay lại danh sách</a>`,
		error,
		body,
	});
}

export function adminBlockFormPage({ project, block }) {
	const body = html`
		<form method="POST" action="/portfolio/admin/${project.id}/blocks/${block.id}/edit" enctype="multipart/form-data">
			${
				block.type === "text"
					? html`
						<div class="form-row"><label for="text_vi">Nội dung (Tiếng Việt)</label><textarea id="text_vi" name="text_vi" rows="6">${block.text_vi || ""}</textarea></div>
						<div class="form-row"><label for="text_en">Nội dung (English)</label><textarea id="text_en" name="text_en" rows="6">${block.text_en || ""}</textarea></div>
					`
					: ""
			}
			${
				block.type === "image"
					? html`
						${block.src ? html`<div class="current-image"><label class="mb-0">Ảnh hiện tại</label><img src="${block.src}" alt=""></div>` : ""}
						<div class="form-row"><label for="media">Thay ảnh mới (bỏ trống nếu giữ ảnh cũ)</label><input type="file" id="media" name="media" accept=".png,.jpg,.jpeg,.webp,.gif"></div>
						<div class="form-row"><label for="caption_vi">Chú thích (Tiếng Việt)</label><input type="text" id="caption_vi" name="caption_vi" value="${block.caption_vi || ""}"></div>
						<div class="form-row"><label for="caption_en">Chú thích (English)</label><input type="text" id="caption_en" name="caption_en" value="${block.caption_en || ""}"></div>
					`
					: ""
			}
			${
				block.type === "video"
					? html`
						<p class="field-hint" style="margin-top:0;">Nguồn hiện tại: ${block.src || "(chưa có)"}</p>
						<div class="form-row"><label for="media">Thay bằng file video mới (bỏ trống nếu giữ nguồn cũ)</label><input type="file" id="media" name="media" accept=".mp4,.webm,.mov"></div>
						<div class="form-row"><label for="videoUrl">Hoặc thay bằng link YouTube / Vimeo mới</label><input type="text" id="videoUrl" name="videoUrl" placeholder="https://youtube.com/watch?v=..."></div>
						<div class="form-row"><label for="caption_vi">Chú thích (Tiếng Việt)</label><input type="text" id="caption_vi" name="caption_vi" value="${block.caption_vi || ""}"></div>
						<div class="form-row"><label for="caption_en">Chú thích (English)</label><input type="text" id="caption_en" name="caption_en" value="${block.caption_en || ""}"></div>
					`
					: ""
			}
			<button type="submit" class="btn btn-primary">Lưu thay đổi</button>
		</form>
	`;
	return adminShell({
		title: "Sửa khối nội dung — Portfolio CMS",
		eyebrow: "Portfolio CMS",
		heading: `Sửa khối: ${blockTypeLabel(block.type)}`,
		topActions: html`<a href="/portfolio/admin/${project.id}/edit" class="btn btn-outline btn-small">&larr; Quay lại dự án</a>`,
		body,
	});
}

// ---------------------------------------------------------------------------
// Admin: Blog (mirrors the portfolio admin views above)
// ---------------------------------------------------------------------------

export function blogAdminDashboardPage({ posts, username }) {
	const body = html`
		<div style="margin-bottom:1.5em;"><a href="/blog/admin/new" class="btn btn-primary">+ Thêm bài viết mới</a></div>
		${
			posts.length === 0
				? html`<p class="text-secondary">Chưa có bài viết nào. Bấm "Thêm bài viết mới" để bắt đầu.</p>`
				: html`<div style="overflow-x:auto;">
						<table class="admin-table">
							<thead><tr><th>Ảnh</th><th>Thứ tự</th><th>Ngày đăng</th><th>Tiêu đề (VI / EN)</th><th>Hành động</th></tr></thead>
							<tbody>
								${posts.map(
									(p) => html`
									<tr>
										<td><img src="${p.image}" alt=""></td>
										<td>${p.sort_order}</td>
										<td>${p.date_display_vi || p.date}</td>
										<td>${p.title_vi}<br><span class="text-secondary">${p.title_en}</span></td>
										<td>
											<div class="admin-table-actions">
												<a href="/blog/${p.slug}" target="_blank" class="btn btn-outline btn-small">Xem</a>
												<a href="/blog/admin/${p.id}/edit" class="btn btn-outline btn-small">Sửa</a>
												<form method="POST" action="/blog/admin/${p.id}/delete" onsubmit="return confirm('Xoá bài viết này? Hành động không thể hoàn tác.');">
													<button type="submit" class="btn btn-danger btn-small">Xoá</button>
												</form>
											</div>
										</td>
									</tr>
								`,
								)}
							</tbody>
						</table>
					</div>`
		}
	`;
	return adminShell({
		title: "Quản trị Blog",
		eyebrow: "Blog CMS",
		heading: "Quản lý bài viết",
		topActions: html`
			<a href="/blog.html" target="_blank" class="btn btn-outline btn-small">Xem trang Blog</a>
			<a href="/portfolio/admin" class="btn btn-outline btn-small">Portfolio CMS</a>
			${topbarCommon()}
		`,
		body: html`<p class="text-secondary mb-0" style="margin-top:-1em;margin-bottom:1.5em;">Đăng nhập với: <strong>${username}</strong></p>${body}`,
	});
}

export function blogAdminFormPage({ post, error }) {
	const isEdit = !!(post && post.id);
	const body = html`
		<form method="POST" action="${isEdit ? `/blog/admin/${post.id}/edit` : "/blog/admin/new"}" enctype="multipart/form-data">
			${post && post.image ? html`<div class="current-image"><label class="mb-0">Ảnh hiện tại</label><img src="${post.image}" alt=""></div>` : ""}
			<div class="form-row">
				<label for="image">Ảnh bài viết ${isEdit ? "(bỏ trống nếu giữ ảnh cũ)" : ""}</label>
				<input type="file" id="image" name="image" accept=".png,.jpg,.jpeg,.webp,.gif">
			</div>
			<div class="admin-form-grid">
				<div class="form-row"><label for="title_vi">Tiêu đề (Tiếng Việt)</label><input type="text" id="title_vi" name="title_vi" value="${(post && post.title_vi) || ""}" required></div>
				<div class="form-row"><label for="title_en">Tiêu đề (English)</label><input type="text" id="title_en" name="title_en" value="${(post && post.title_en) || ""}" required></div>
				<div class="form-row"><label for="date">Ngày đăng (YYYY-MM-DD, dùng để sắp xếp)</label><input type="date" id="date" name="date" value="${(post && post.date) || ""}"></div>
				<div class="form-row">
					<label for="order">Thứ tự hiển thị</label>
					<input type="number" id="order" name="order" value="${(post && post.sort_order) || ""}">
					<p class="field-hint">Số nhỏ hơn hiển thị trước.</p>
				</div>
				<div class="form-row"><label for="date_display_vi">Ngày hiển thị (Tiếng Việt)</label><input type="text" id="date_display_vi" name="date_display_vi" value="${(post && post.date_display_vi) || ""}" placeholder="VD: 03 Th06 2025"></div>
				<div class="form-row"><label for="date_display_en">Ngày hiển thị (English)</label><input type="text" id="date_display_en" name="date_display_en" value="${(post && post.date_display_en) || ""}" placeholder="e.g. Jun 3, 2025"></div>
				<div class="form-row"><label for="tag_vi">Tag (Tiếng Việt)</label><input type="text" id="tag_vi" name="tag_vi" value="${(post && post.tag_vi) || ""}"></div>
				<div class="form-row"><label for="tag_en">Tag (English)</label><input type="text" id="tag_en" name="tag_en" value="${(post && post.tag_en) || ""}"></div>
				<div class="form-row form-row-full"><label for="excerpt_vi">Tóm tắt ngắn — hiện ở thẻ bài viết (Tiếng Việt)</label><textarea id="excerpt_vi" name="excerpt_vi" rows="3" required>${(post && post.excerpt_vi) || ""}</textarea></div>
				<div class="form-row form-row-full"><label for="excerpt_en">Tóm tắt ngắn — hiện ở thẻ bài viết (English)</label><textarea id="excerpt_en" name="excerpt_en" rows="3" required>${(post && post.excerpt_en) || ""}</textarea></div>
				<div class="form-row form-row-full">
					<label for="slug">Đường dẫn (slug, tuỳ chọn)</label>
					<input type="text" id="slug" name="slug" value="${(post && post.slug) || ""}" placeholder="vi-du-duong-dan-bai-viet">
					<p class="field-hint">Để trống để tự tạo từ tiêu đề. URL công khai: /blog/&lt;slug&gt;</p>
				</div>
			</div>
			<button type="submit" class="btn btn-primary">${isEdit ? "Lưu thay đổi" : "Thêm bài viết"}</button>
		</form>
		${
			isEdit
				? html`
					<hr class="separator" style="margin:3em 0;">
					<h3>Nội dung chi tiết</h3>
					<p class="text-secondary">Thêm đoạn văn, ảnh, video — hiển thị theo đúng thứ tự bên dưới ở trang bài viết. Dùng nút ↑ ↓ để sắp xếp lại.</p>
					${blockList({ blocks: post.blocks || [], baseUrl: `/blog/admin/${post.id}/blocks` })}
					${addBlockPanel({ addUrl: `/blog/admin/${post.id}/blocks` })}
				`
				: html`<p class="text-secondary" style="margin-top:2em;">Lưu bài viết trước, sau đó bạn có thể thêm đoạn văn / ảnh / video.</p>`
		}
	`;
	return adminShell({
		title: `${isEdit ? "Sửa bài viết" : "Thêm bài viết"} — Blog CMS`,
		eyebrow: "Blog CMS",
		heading: isEdit ? "Sửa bài viết" : "Thêm bài viết mới",
		topActions: html`<a href="/blog/admin" class="btn btn-outline btn-small">&larr; Quay lại danh sách</a>`,
		error,
		body,
	});
}

export function blogAdminBlockFormPage({ post, block }) {
	const body = html`
		<form method="POST" action="/blog/admin/${post.id}/blocks/${block.id}/edit" enctype="multipart/form-data">
			${
				block.type === "text"
					? html`
						<div class="form-row"><label for="text_vi">Nội dung (Tiếng Việt)</label><textarea id="text_vi" name="text_vi" rows="6">${block.text_vi || ""}</textarea></div>
						<div class="form-row"><label for="text_en">Nội dung (English)</label><textarea id="text_en" name="text_en" rows="6">${block.text_en || ""}</textarea></div>
					`
					: ""
			}
			${
				block.type === "image"
					? html`
						${block.src ? html`<div class="current-image"><label class="mb-0">Ảnh hiện tại</label><img src="${block.src}" alt=""></div>` : ""}
						<div class="form-row"><label for="media">Thay ảnh mới (bỏ trống nếu giữ ảnh cũ)</label><input type="file" id="media" name="media" accept=".png,.jpg,.jpeg,.webp,.gif"></div>
						<div class="form-row"><label for="caption_vi">Chú thích (Tiếng Việt)</label><input type="text" id="caption_vi" name="caption_vi" value="${block.caption_vi || ""}"></div>
						<div class="form-row"><label for="caption_en">Chú thích (English)</label><input type="text" id="caption_en" name="caption_en" value="${block.caption_en || ""}"></div>
					`
					: ""
			}
			${
				block.type === "video"
					? html`
						<p class="field-hint" style="margin-top:0;">Nguồn hiện tại: ${block.src || "(chưa có)"}</p>
						<div class="form-row"><label for="media">Thay bằng file video mới (bỏ trống nếu giữ nguồn cũ)</label><input type="file" id="media" name="media" accept=".mp4,.webm,.mov"></div>
						<div class="form-row"><label for="videoUrl">Hoặc thay bằng link YouTube / Vimeo mới</label><input type="text" id="videoUrl" name="videoUrl" placeholder="https://youtube.com/watch?v=..."></div>
						<div class="form-row"><label for="caption_vi">Chú thích (Tiếng Việt)</label><input type="text" id="caption_vi" name="caption_vi" value="${block.caption_vi || ""}"></div>
						<div class="form-row"><label for="caption_en">Chú thích (English)</label><input type="text" id="caption_en" name="caption_en" value="${block.caption_en || ""}"></div>
					`
					: ""
			}
			<button type="submit" class="btn btn-primary">Lưu thay đổi</button>
		</form>
	`;
	return adminShell({
		title: "Sửa khối nội dung — Blog CMS",
		eyebrow: "Blog CMS",
		heading: `Sửa khối: ${blockTypeLabel(block.type)}`,
		topActions: html`<a href="/blog/admin/${post.id}/edit" class="btn btn-outline btn-small">&larr; Quay lại bài viết</a>`,
		body,
	});
}
