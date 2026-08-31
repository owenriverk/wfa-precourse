#!/bin/sh
# Deploy the site to Cloudflare Pages (project: openwfa).
#
# The target environment follows your git branch:
#   main          -> PRODUCTION  (openwfa.com, D1 "openwfa")
#   anything else -> PREVIEW     (https://<branch>.wfa-precourse.pages.dev, D1 "openwfa-preview",
#                                 DEV_MODE=true: sign-in links returned directly, no email needed)
set -e
cd "$(dirname "$0")/.."
BRANCH=$(git branch --show-current)
if [ -z "$BRANCH" ]; then
  echo "Cannot determine git branch (detached HEAD?)." >&2; exit 1
fi
if [ "$BRANCH" = "main" ]; then
  echo "==> Deploying PRODUCTION (branch main -> openwfa.com)"
else
  echo "==> Deploying PREVIEW (branch $BRANCH -> https://$BRANCH.wfa-precourse.pages.dev)"
fi
rm -rf dist && mkdir dist
rsync -a --exclude 'dist' --exclude '.git' --exclude '.github' --exclude '.backups' \
      --exclude 'functions' --exclude 'db' --exclude 'wrangler.jsonc' --exclude '.dev.vars' \
      --exclude 'node_modules' --exclude '.wrangler' --exclude 'WFA_Lessons_Compiled.pdf' \
      --exclude 'tools' --exclude 'README.md' --exclude 'AGENTS.md' --exclude 'sims/SPEC.md' \
      --exclude '.gitignore' --exclude '.nojekyll' --exclude '.DS_Store' \
      ./ dist/
npx wrangler pages deploy dist --project-name openwfa --branch "$BRANCH" --commit-dirty=true
