#!/usr/bin/env sh

# Version bump script for monorepo
# Usage: ./scripts/version-bump.sh [base_sha] [head_sha]
# If no SHAs provided, uses git diff to detect changes

set -e

BASE_SHA=${1:-""}
HEAD_SHA=${2:-""}

echo "🔄 Running version bump..."

# Determine git diff command based on arguments
if [ -n "$BASE_SHA" ] && [ -n "$HEAD_SHA" ]; then
    echo "📋 Comparing $BASE_SHA..$HEAD_SHA"
    CHANGED_FILES=$(git diff --name-only "$BASE_SHA".."$HEAD_SHA")
else
    echo "📋 Detecting local changes"
    CHANGED_FILES=$(git diff --name-only @{push}..HEAD 2>/dev/null || git diff --name-only HEAD~1..HEAD 2>/dev/null || echo "")
fi

if [ -n "$CHANGED_FILES" ]; then
    PROJECTS=$(echo "$CHANGED_FILES" | grep -E "^(apps|packages)/" | cut -d'/' -f1,2 | sort -u)
    
    if [ -n "$PROJECTS" ]; then
        echo "📝 Modified projects: $(echo "$PROJECTS" | tr '\n' ' ')"
        
        for project in $PROJECTS; do
            if [ -f "$project/package.json" ]; then
                echo "📦 Bumping $project"
                (cd "$project" && npm version patch --no-git-tag-version)
                git add "$project/package.json"
            fi
        done
        
        if ! git diff --cached --quiet; then
            echo "💾 Committing version bumps..."
            git commit -m "chore: bump versions [skip ci]"
            echo "✅ Version bump completed with changes"
            exit 0
        fi
    else
        echo "✅ No apps/packages modified"
    fi
else
    echo "✅ No changes detected"
fi

echo "✅ Version bump completed (no changes)"