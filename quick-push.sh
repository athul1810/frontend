#!/bin/bash
# Quick push script for private repository

cd ~/Desktop/backend-team-website

echo "🔐 Setting up for private repository push..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git..."
    git init
fi

# Add remote
echo "🔗 Setting remote..."
git remote add origin https://github.com/athul1810/frontend.git 2>/dev/null || \
git remote set-url origin https://github.com/athul1810/frontend.git

# Add files
echo "📝 Adding files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "Initial commit: AutoEdit AI website with modern design, login page, and pricing page" 2>/dev/null || \
git commit -m "Update: AutoEdit AI website"

# Set branch
echo "🌿 Setting branch to main..."
git branch -M main

# Push
echo ""
echo "⬆️  Pushing to private repository..."
echo "⚠️  You'll be prompted for credentials:"
echo "   Username: athul1810"
echo "   Password: Use your GitHub Personal Access Token (not your password)"
echo ""
git push -u origin main

echo ""
echo "✅ Done! Check https://github.com/athul1810/frontend"
