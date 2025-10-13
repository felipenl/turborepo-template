#!/usr/bin/env sh

# Bump main project version
# Usage: ./scripts/bump-main-version.sh

set -e

echo "🔄 Bumping main project version..."

if [ -f "package.json" ]; then
    echo "📦 Bumping main project version"
    npm version patch --no-git-tag-version
    git add package.json
    
    if ! git diff --cached --quiet; then
        echo "💾 Committing main version bump..."
        git commit -m "chore: bump main project version [skip ci]"
        echo "✅ Main version bump completed"
    else
        echo "✅ No version changes made"
    fi
else
    echo "❌ No package.json found in root"
    exit 1
fi