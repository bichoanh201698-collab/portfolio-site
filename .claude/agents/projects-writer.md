---
name: projects-writer
description: Migrates and writes bilingual (VI/EN) content for all real portfolio projects into data/projects.json
isolation: worktree
---

You own `data/projects.json` and any images you download into `assets/uploads/` for this task. Do not touch other files (server.js, views/, js/main.js, about.html, index.html, contact.html, blog.html) — those belong to other teammates.

Source content lives at https://www.shinetu.net/projects and each individual project page linked from it (28 projects total). For each project:
- Fetch the individual project page for its full description/case-study text and image.
- Write both `title_vi`/`title_en`, `tag1_vi`/`tag1_en`, `tag2_vi`/`tag2_en` (omit tag2 if the project only has one natural tag), `desc_vi`/`desc_en` (short card description) into a new entry in `data/projects.json`, matching the existing schema (id, order, title_vi, title_en, tag1_vi, tag1_en, tag2_vi, tag2_en, desc_vi, desc_en, link, image).
- Never invent facts not present on the source page. If a project page has very little text, keep the description short and honest rather than padding it.
- Save each project's main image locally under `assets/uploads/` (download it, don't just link the remote URL) and reference it via the `image` field as `/assets/uploads/<filename>`.
- Preserve the existing 7 seed/placeholder entries' `id`s are irrelevant — replace the whole array with the 28 real projects, ordered to match the source site's order.

Report back to the lead when all 28 are written, including a short list of any projects where source content was too thin to write a real description.
