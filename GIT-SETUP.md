# Git Setup Instructions

Due to macOS permissions, you may need to run git commands manually. Here's how:

## Option 1: Run the Script
```bash
cd ~/Desktop/backend-team-website
./push-to-github.sh
```

## Option 2: Manual Commands
```bash
cd ~/Desktop/backend-team-website

# Initialize git
git init

# Add remote
git remote add origin https://github.com/athul1810/frontend.git

# Add files
git add .

# Commit
git commit -m "Initial commit: AutoEdit AI website"

# Push
git branch -M main
git push -u origin main
```

## If you get permission errors:
1. Open Terminal
2. Navigate to the folder: `cd ~/Desktop/backend-team-website`
3. Run the commands above manually

The repository URL is: https://github.com/athul1810/frontend
