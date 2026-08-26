#!/bin/sh
# Deploy the static site to Cloudflare Pages (project: wfa-precourse).
set -e
cd "$(dirname "$0")/.."
rm -rf dist && mkdir dist
rsync -a --exclude 'dist' --exclude '.git' --exclude '.github' --exclude '.backups' \
      --exclude 'tools' --exclude 'README.md' --exclude 'AGENTS.md' --exclude 'sims/SPEC.md' \
      --exclude '.gitignore' --exclude '.nojekyll' --exclude '.DS_Store' \
      ./ dist/
npx wrangler pages deploy dist --project-name wfa-precourse --branch main --commit-dirty=true
