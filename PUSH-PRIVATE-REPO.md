# Push to Private GitHub Repository

Since the repository is private, you'll need to authenticate. Here are the steps:

## 🔐 Method 1: Using Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name (e.g., "AutoEdit AI Website")
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using the token:**
```bash
cd ~/Desktop/backend-team-website

# Add remote
git remote add origin https://github.com/athul1810/frontend.git 2>/dev/null || git remote set-url origin https://github.com/athul1810/frontend.git

# Add files
git add .

# Commit
git commit -m "Initial commit: AutoEdit AI website with modern design, login page, and pricing page"

# Set branch
git branch -M main

# Push (use token as password when prompted)
git push -u origin main
# Username: athul1810
# Password: [paste your personal access token here]
```

## 🔐 Method 2: Using SSH (Alternative)

1. **Set up SSH key** (if not already done):
```bash
# Check if you have SSH key
ls -la ~/.ssh/id_rsa.pub

# If not, generate one
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_rsa.pub
# Add this to GitHub: Settings → SSH and GPG keys → New SSH key
```

2. **Change remote to SSH:**
```bash
cd ~/Desktop/backend-team-website
git remote set-url origin git@github.com:athul1810/frontend.git
git push -u origin main
```

## 🔐 Method 3: GitHub CLI (Easiest)

```bash
# Install GitHub CLI if not installed
# brew install gh

# Authenticate
gh auth login

# Then push normally
cd ~/Desktop/backend-team-website
git remote add origin https://github.com/athul1810/frontend.git
git add .
git commit -m "Initial commit: AutoEdit AI website"
git branch -M main
git push -u origin main
```

## 📝 Quick Commands (Copy & Paste)

```bash
cd ~/Desktop/backend-team-website && \
git remote add origin https://github.com/athul1810/frontend.git 2>/dev/null || \
git remote set-url origin https://github.com/athul1810/frontend.git && \
git add . && \
git commit -m "Initial commit: AutoEdit AI website" && \
git branch -M main && \
git push -u origin main
```

## ⚠️ Troubleshooting

**If you get "permission denied":**
- Make sure you're authenticated with GitHub
- Check that you have write access to the repository
- Verify the repository URL is correct

**If you get "repository not found":**
- Make sure the repository exists at https://github.com/athul1810/frontend
- Check that you have access to this private repository
- Verify your GitHub username is correct
