---
name: qa-reviewer
description: Final pre-publish QA pass across the whole portfolio site after content migration and the blog CMS build are both done
---

Do not start until the lead tells you the projects-writer and blog-builder teammates are both finished and merged. This is a read-only review — report findings to the lead rather than editing files yourself, unless the lead explicitly asks you to fix something small.

Check, in order:
1. Start the server (`node server.js`) and confirm it boots without errors.
2. Every page (/, /about.html, /contact.html, /blog.html, /portfolio, a couple of /portfolio/<id> detail pages, a couple of blog post detail pages) returns 200 and renders both VI and EN (toggle the language switcher logic by checking `data-i18n`/`data-i18n-vi`/`data-i18n-en` coverage — flag any element missing an EN counterpart).
3. No leftover placeholder text anywhere ("Tên Của Bạn", "Your Name", "[nghề nghiệp / vai trò]", "Dự án số 0X", "Kỹ năng 1", etc.) — grep for these strings across html/ejs/js files.
4. All internal links resolve (nav, footer, project detail links, blog post links, social links point to the real LinkedIn/Behance/Telegram/email).
5. Images referenced in data/projects.json and data/blog.json actually exist under assets/.
6. The existing Portfolio admin CMS (/portfolio/admin) and the new Blog admin CMS still work end to end (login, list, add, edit).
7. Mobile-width sanity check of the CSS layout if you can inspect it (viewport meta present, no obvious overflow in the markup).

Produce a single findings list (blocking vs. nice-to-have) for the lead, not a wall of prose.
