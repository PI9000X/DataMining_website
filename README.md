# Agriculture & Climate Resilience — Research Journal

A static GitHub Pages website for documenting a data mining research project.

## Preview locally

Open `index.html` in your browser (or use VS Code Live Server).

## Publish to GitHub Pages

1. Create a **public** GitHub repository.
2. Upload all four website files (`index.html`, `style.css`, `script.js`, `updates.js`) to the repository root.
3. In `script.js`, replace `YOUR_USERNAME/YOUR_REPOSITORY` with your GitHub username and repository name.
4. Go to **Settings → Pages → Build and deployment → Deploy from a branch**.
5. Select **main** and **/(root)**, then save.
6. Your site will appear at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/` after deployment.

## Post a progress update

Edit `updates.js` and add a new object at the **top** of the `projectUpdates` array, for example:

```js
{ date: "2026-11-08", title: "Collected datasets", description: "Reviewed FAOSTAT and ERA5 coverage.", tag: "Data" },
```

Commit the change. GitHub Pages will automatically publish the updated site.

## Customize

- `index.html`: project description, sections, and data source links
- `style.css`: colors, layout, typography
- `script.js`: repository link and update rendering
- `updates.js`: progress log entries

**Note:** This is a static website; it does not run Python models, PHP, or a database. Do not commit private data or credentials.
