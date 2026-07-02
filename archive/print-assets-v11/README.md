# Print-only assets (archived from book/)

These files were part of the dual-purpose (EPUB + POD) source tree in `book/`
through v11. As of v13 the ebook source of truth (`book/`) matches the KDP
EPUB exactly, which does not include them:

| File | Purpose |
|---|---|
| `print.css` | POD print stylesheet (linked via `media="print"` in pre-v13 XHTML) |
| `0-Cover.xhtml` | Cover page for the with-cover EPUB variant (KDP upload uses no-cover) |
| `cover.png` | Cover raster used by `0-Cover.xhtml` |
| `CinzelDecorative.woff2` | Display font referenced only by pre-v13 print styling |

Restore these (and re-add the `print.css` links + OPF manifest entries) if a
new POD interior build is run from `book/`.
