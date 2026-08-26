-- TechVora database schema (SQL)
-- This schema is a starting point for a relational CMS-backed site.

CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  published_at DATETIME,
  updated_at DATETIME,
  reading_time INTEGER,
  canonical_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN DEFAULT 0,
  FOREIGN KEY(author_id) REFERENCES authors(id),
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE article_tags (
  article_id INTEGER,
  tag_id INTEGER,
  PRIMARY KEY(article_id, tag_id),
  FOREIGN KEY(article_id) REFERENCES articles(id),
  FOREIGN KEY(tag_id) REFERENCES tags(id)
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
