# How to View Your Website

## ⚠️ Important: HTML files are NOT executable code!

HTML files need to be opened in a **web browser**, not run as code in an IDE.

## Method 1: Open Directly in Browser (Easiest)

1. **Navigate to Desktop → backend-team-website folder**
2. **Double-click `index.html`** - This will open it in your default browser
3. Or **right-click → Open With → Safari/Chrome/Firefox**

## Method 2: Use Local Server (Recommended)

### Quick Start:
```bash
cd ~/Desktop/backend-team-website
python3 -m http.server 8000
```

Then open your browser and go to: **http://localhost:8000**

### Or use the script:
```bash
cd ~/Desktop/backend-team-website
./start-server.sh
```

## Method 3: Double-click the Launcher

1. Double-click **`OPEN-WEBSITE.command`** in the folder
2. It will open the website in your browser

## Troubleshooting

### If you see "code language not supported":
- **Don't click "Run"** in your IDE/editor
- HTML files are meant to be **opened in a browser**, not executed
- Use one of the methods above instead

### If styles don't load:
- Make sure you're using a **local server** (Method 2)
- Opening `file://` directly sometimes blocks CSS/JS for security reasons

### If nothing happens:
- Check that `styles.css` and `script.js` are in the same folder as `index.html`
- Try the local server method (Method 2)

## Quick Test

Open your browser and type:
```
file:///Users/athulkrishnaboban/Desktop/backend-team-website/index.html
```

Or better yet, use the local server:
```
http://localhost:8000
```
