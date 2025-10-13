#!/usr/bin/env sh

# Bump main project version
# Usage: ./scripts/bump-main-version.sh

set -e

echo "🔄 Bumping main project version..."

if [ -f "package.json" ]; then
    echo "📦 Bumping main project version"
    npm version patch --no-git-tag-version
    git add package.json
    echo "✅ Main version bump completed and staged"
else
    echo "❌ No package.json found in root"
    exit 1
fi