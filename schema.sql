CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  title_vi TEXT, title_en TEXT,
  tag1_vi TEXT, tag1_en TEXT,
  tag2_vi TEXT, tag2_en TEXT,
  desc_vi TEXT, desc_en TEXT,
  link TEXT, image TEXT
);

CREATE TABLE project_blocks (
  id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  type TEXT NOT NULL,
  text_vi TEXT, text_en TEXT,
  src TEXT, caption_vi TEXT, caption_en TEXT,
  PRIMARY KEY (project_id, id)
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  date TEXT, date_display_vi TEXT, date_display_en TEXT,
  title_vi TEXT, title_en TEXT,
  excerpt_vi TEXT, excerpt_en TEXT,
  tag_vi TEXT, tag_en TEXT,
  slug TEXT UNIQUE, image TEXT
);

CREATE TABLE post_blocks (
  id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  type TEXT NOT NULL,
  text_vi TEXT, text_en TEXT,
  src TEXT, caption_vi TEXT, caption_en TEXT,
  PRIMARY KEY (post_id, id)
);

CREATE TABLE admin (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  pbkdf2_salt TEXT NOT NULL,
  pbkdf2_iterations INTEGER NOT NULL DEFAULT 100000,
  token_version INTEGER NOT NULL DEFAULT 1
);
