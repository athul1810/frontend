# Git Usage Guide

## ✅ How Git Works

**Git does NOT automatically push changes.** You have full control:

- **Making changes:** Edit files normally - nothing happens automatically
- **When YOU want to push:** Run `git push` manually
- **No auto-sync:** Changes stay local until you decide to push

## 📝 Normal Workflow

1. **Make changes** to your files (edit HTML, CSS, JS, etc.)
2. **Test locally** - open `index.html` in browser
3. **When ready to update GitHub:**
   ```bash
   cd ~/Desktop/backend-team-website
   git add .
   git commit -m "Your commit message"
   git push
   ```

## 🚫 What Git Does NOT Do

- ❌ Does NOT auto-push on file save
- ❌ Does NOT sync automatically
- ❌ Does NOT update GitHub without your command
- ✅ Only pushes when YOU run `git push`

## 🎯 One-Time Setup (Only Once)

```bash
cd ~/Desktop/backend-team-website
git init
git remote add origin https://github.com/athul1810/frontend.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

After this, you only push when you want to!

## 📤 Push When You Want

```bash
cd ~/Desktop/backend-team-website
git add .
git commit -m "Description of your changes"
git push
```

That's it! You're in full control. 🎉
