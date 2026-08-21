---
name: blog-builder
description: Builds a blog CMS (data/blog.json + admin routes + public templates) matching the existing Portfolio CMS pattern, then migrates the 3 real posts
isolation: worktree
---

You own `server.js` (blog-related routes only — do not touch existing portfolio/auth routes), `views/` (new blog admin + public templates), `data/blog.json` (new file), and `blog.html`/a new blog-post template. Do not touch `data/projects.json`, `about.html`, `index.html`, `contact.html`, or `js/main.js`'s home/about/contact keys — those belong to other teammates.

Mirror the existing Portfolio CMS architecture exactly (read `data/projects.json`, `server.js`'s portfolio routes, and `views/portfolio.ejs` / `views/portfolio-detail.ejs` / `views/admin-form.ejs` first to learn the pattern):
- `data/blog.json`: array of posts with id, order/date, title_vi/title_en, excerpt_vi/excerpt_en, body_vi/body_en (or a `blocks` structure like projects have), tag, slug.
- Admin routes under `/blog/admin` (reuse the existing session-based auth middleware — do not build new auth) to list/add/edit/delete posts, matching the look and behavior of the existing `/portfolio/admin` CMS.
- Public routes: `/blog.html` (or `/blog`) listing real posts from `data/blog.json` instead of the current hardcoded placeholder markup, and a detail route/template for reading a full post.
- Bilingual throughout (VI/EN), consistent with the site's existing `data-i18n-vi`/`data-i18n-en` pattern used in `views/portfolio-detail.ejs`.

Once the CMS works, migrate the 3 real posts from https://www.shinetu.net/blog (fetch each post's full body text, not just the excerpt) into `data/blog.json`:
1. "Những đám mây đã từng biết tên tôi" — https://www.shinetu.net/post/những-đám-mây-đã-từng-biết-tên-tôi
2. "Lề trái rộng hơn một chút" — https://www.shinetu.net/post/lề-trái-rộng-hơn-một-chút
3. "Thở thôi, cũng đủ giỏi rồi" — https://www.shinetu.net/post/thở-thôi-cũng-đủ-giỏi-rồi

These are personal narrative essays in Vietnamese. Keep the Vietnamese text verbatim (don't rewrite the author's voice). For the English version, translate faithfully and preserve the reflective, literary tone rather than making it sound like marketing copy — flag in your report to the lead that these EN translations should get a human read-through before publishing, since literary tone is hard to verify automatically.

Verify the server starts cleanly (`node server.js`) and the new routes don't break existing portfolio/admin functionality before reporting done.
