# Aaryan Singh — 11th Birthday Website

A responsive superhero-themed static birthday website.

## Preview locally

```powershell
cd c:\work\playground\bd
python -m http.server 5500
```

Open <http://localhost:5500>.

## Deploy with GitHub Pages

1. Create a new GitHub repository.
2. Upload or push all files in this folder to the repository's `main` branch.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. Wait for deployment. Your site will be available at:
   `https://YOUR-GITHUB-USERNAME.github.io/REPOSITORY-NAME/`

## Add Aaryan's photos later

Replace the `.photo-placeholder` elements in `index.html` with image tags, or place files in `assets/photos/` and reference them like:

```html
<img src="assets/photos/aaryan.jpg" alt="Aaryan at 11">
```
