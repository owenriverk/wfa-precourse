#!/usr/bin/env python3
"""Regenerate sitemap.xml from what is actually on disk.

Single source of truth for the sitemap. Emits EXTENSIONLESS URLs because
Cloudflare Pages strips .html and 308-redirects /foo.html -> /foo; listing the
.html form hands crawlers a list where every entry is a redirect.

lastmod is the file's last git commit date, or today when the file has
uncommitted edits (it is changing now, so say so).

Pages carrying <meta name="robots" content="noindex"> are skipped.

Regenerate: python3 tools/build_sitemap.py
"""
import os, re, subprocess, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://openwfa.com"
SKIP_DIRS = {"dist", "tools", ".git", ".github", ".backups", ".gstack",
             ".claude", ".wrangler", "assets"}
TODAY = datetime.date.today().isoformat()

NOINDEX = re.compile(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'][^"\']*noindex', re.I)


def git_date(rel):
    """Last commit date, or today if the file is dirty/untracked."""
    dirty = subprocess.run(["git", "status", "--porcelain", "--", rel],
                           cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if dirty:
        return TODAY
    d = subprocess.run(["git", "log", "-1", "--format=%cs", "--", rel],
                       cwd=ROOT, capture_output=True, text=True).stdout.strip()
    return d or TODAY


def url_for(rel):
    if rel == "index.html":
        return BASE + "/"
    return "%s/%s" % (BASE, rel[:-5])          # drop the .html


pages = []
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if d not in SKIP_DIRS and not d.startswith(".")]
    for f in sorted(fn):
        if not f.endswith(".html"):
            continue
        rel = os.path.relpath(os.path.join(dp, f), ROOT)
        src = open(os.path.join(dp, f), encoding="utf-8", errors="replace").read()
        if NOINDEX.search(src):
            continue
        pages.append(rel)

# homepage first, then a stable alphabetical order
pages.sort(key=lambda r: (r != "index.html", r))

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for rel in pages:
    out.append("  <url><loc>%s</loc><lastmod>%s</lastmod></url>" % (url_for(rel), git_date(rel)))
out.append("</urlset>")
open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("sitemap.xml: %d urls (extensionless), lastmod from git" % len(pages))
