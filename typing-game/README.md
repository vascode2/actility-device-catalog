# Typing Sprint Game

This is a standalone typing game page. You can run it locally without any build tools.

## Play locally

1. From the `typing-game` folder, start a lightweight web server:
   ```bash
   python -m http.server 8080
   ```
2. Open your browser to `http://localhost:8080` and click **Start** to begin the 30-second sprint.

You can also double-click `index.html` to open it directly in the browser, but some browsers block local font or script access.
Using a simple server avoids those issues.

## What you get

- 30-second timer with live accuracy and WPM counters
- Session summary showing characters typed, mistakes, and your best WPM for the session
- Toggles to include or exclude punctuation and numbers when generating prompts
