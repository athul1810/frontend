#!/bin/bash
# One-command push script

cd ~/Desktop/backend-team-website

echo "🚀 Pushing to GitHub..."
echo ""

# Remove any existing incomplete git setup
rm -rf .git 2>/dev/null

# Initialize git
echo "📦 Initializing git..."
git init

# Add remote
echo "🔗 Adding remote..."
git remote add origin https://github.com/athul1810/frontend.git

# Add all files
echo "📝 Adding files..."
git add .

# Commit
echo "💾 Committing..."
git commit -m "Initial commit: AutoEdit AI website with modern design, login page, and pricing page"

# Set branch
echo "🌿 Setting branch to main..."
git branch -M main

# Push
echo "⬆️  Pushing to GitHub..."
echo ""
git push -u origin main

echo ""
echo "✅ Successfully pushed to https://github.com/athul1810/frontend"
