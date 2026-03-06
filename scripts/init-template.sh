#!/usr/bin/env bash
set -euo pipefail

# One-shot initialization script for creating a new project from the template.
# Prompts for project name and author, updates package.json, removes .git, and can install deps.

usage() {
  echo "Usage: $0 [--install] [--git] [--remote <git-url>]"
  echo "  --install      Run npm install after initialization"
  echo "  --git          Initialize git and make initial commit"
  echo "  --remote URL   Add remote origin URL after git init"
  exit 1
}

INSTALL_DEPS=false
INIT_GIT=false
GIT_REMOTE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --install) INSTALL_DEPS=true; shift ;;
    --git) INIT_GIT=true; shift ;;
    --remote) GIT_REMOTE="$2"; shift 2 ;;
    -h|--help) usage ;;
    *) echo "Unknown arg: $1"; usage ;;
  esac
done

read -rp "New project name (kebab-case) [my-portfolio]: " NEW_NAME
NEW_NAME=${NEW_NAME:-my-portfolio}
read -rp "Author name [Your Name]: " NEW_AUTHOR
NEW_AUTHOR=${NEW_AUTHOR:-Your Name}

echo "Updating package.json..."
node -e "
const fs = require('fs');
const p = JSON.parse(fs.readFileSync('package.json','utf8'));
p.name='"${NEW_NAME}"';
p.author='"${NEW_AUTHOR}"';
if(p.private) p.private=false;
fs.writeFileSync('package.json', JSON.stringify(p, null, 2)+'\n');
console.log('package.json updated');
"

if [[ -d .git ]]; then
  echo "Removing git history (rm -rf .git)..."
  rm -rf .git
fi

if [[ -f .env.example && ! -f .env.local ]]; then
  cp .env.example .env.local
  echo "Created .env.local from .env.example"
fi

if $INSTALL_DEPS; then
  echo "Installing dependencies..."
  npm install
fi

if $INIT_GIT; then
  echo "Initializing new git repository..."
  git init
  git add .
  git commit -m "Initial commit"
  if [[ -n "$GIT_REMOTE" ]]; then
    git remote add origin "$GIT_REMOTE"
    echo "Added remote origin: $GIT_REMOTE"
  fi
fi

echo "Initialization finished. Next steps:
- edit package.json (name/description)
- run npm run dev to start the dev server"
