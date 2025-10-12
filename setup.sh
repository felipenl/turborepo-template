#!/bin/bash

# Turborepo Template Setup Script

echo "🚀 Setting up Turborepo Template..."

# Get project name from user
read -p "Enter your project name: " PROJECT_NAME

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name is required"
    exit 1
fi

echo "📝 Updating project name to: $PROJECT_NAME"

# Update root package.json
sed -i "s/\"turborepo-template\"/\"$PROJECT_NAME\"/" package.json

# Update README title
sed -i "s/# Turborepo Template/# $PROJECT_NAME/" README.md

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. pnpm install"
echo "2. pnpm dev"
echo "3. Start building your project!"