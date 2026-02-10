Netlify Deployment Notes

This project is prepared for static hosting on Netlify.

What I changed for Netlify:

- Split inline CSS into `assets/css/styles.css`
- Split inline JS into `assets/js/app.js`
- Updated `suryasetu-solar-calculator.html` to reference the external files
- Added `netlify.toml` with `publish = .` so Netlify serves the repo root

How to deploy:

1. Push the repository to GitHub.
2. In Netlify, click "New site from Git" and connect your Git provider.
3. Select the repository and branch. No build command is required.
4. Set the publish directory to the repository root (default).

Local testing:

```powershell
python -m http.server 8000
# then open http://localhost:8000/suryasetu-solar-calculator.html
```

If you want, I can:
- create a Git commit and push the changes
- create a GitHub repo and push
- open a PR with these changes
- add a minimal CI to run linting/tests

Tell me which of the above you'd like me to do next.
