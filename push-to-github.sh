#!/bin/bash
# Script to push to GitHub repository

cd "$(dirname "$0")"

echo "🚀 Setting up Git and pushing to GitHub..."
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add remote if not exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/athul1810/frontend.git
else
    echo "🔄 Updating remote URL..."
    git remote set-url origin https://github.com/athul1810/frontend.git
fi

# Add all files
echo "📝 Adding files..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Initial commit: AutoEdit AI website with modern design, login page, and pricing page" || echo "No changes to commit"

# Set branch to main
echo "🌿 Setting branch to main..."
git branch -M main

# Push
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Check https://github.com/athul1810/frontend"
