# TechVora content model

This file describes the canonical content structure for TechVora articles and is intended as the single source of truth for editors and automated scripts.

Fields (required)
- id: unique identifier (slug-friendly)
- title: string
- slug: URL-friendly slug (e.g., choosing-your-next-smartphone-2026)
- category: one of [Mobile, Android, Apps, Windows, Internet, Gadgets, How-To, Reviews, Comparisons]
- excerpt: short plain-text summary (150–160 chars ideal)
- featured_image: path to image (relative to site root)
- image_alt: alt text for accessibility
- author: author display name
- author_slug: slug for author page (e.g., jane-doe)
- published_at: YYYY-MM-DD (publication date)
- updated_at: YYYY-MM-DD (or null)
- reading_time: integer minutes
- tags: array of short tags
- content: markdown or HTML string (prefer markdown in future editing workflows)

SEO fields (optional but recommended)
- seo_title: title to use in the <title> tag (defaults to "{title} — TechVora")
- meta_description: meta description for the page
- canonical_url: absolute canonical URL (set after you add production domain) or leave relative to site root
- og_image: path to Open Graph image (1200x630 recommended)

Discovery fields
- related: array of article ids (slugs) for curated related-article links
- is_featured: boolean (true for homepage featured article)

Notes
- Keep content original and fact-checked. Do not invent quotes, reviews, user ratings, or unverifiable statistics.
- When publishing, ensure search/index.json is regenerated to include the article and its metadata.
