# Trailwise

Trailwise is a local-first micro-adventure planner for the Touch Grass challenge. Give it a place, a little time, and your energy level; it creates a small outdoor plan designed to get you away from the screen quickly.

## Why open-source AI?

The app loads `Xenova/flan-t5-small`, an open-weight model, directly in the browser through Transformers.js. The prompt is sent to the local model in the tab instead of a hosted AI API. After the model is cached, the planner can generate without a backend or account. The app also includes a tiny deterministic plan library so the experience remains useful while the model is downloading or on low-powered devices.

This makes the screen a launchpad, not a destination: make a plan, save the details, and leave.

## Run locally

Because the model is loaded as an ES module, serve the folder over HTTP instead of opening `index.html` directly:

```bash
node server.cjs
```

Then open `http://127.0.0.1:4173` in your browser. The first model load downloads the open-weight model from Hugging Face; later visits can use the browser cache. You can also install the VS Code **Live Server** extension and choose **Open with Live Server** on `index.html`.

## Deploy on Render

This is a static site. In Render, choose **New → Static Site**, connect the GitHub repository, and use:

- Build command: `echo "No build step required"`
- Publish directory: `.`

The included `render.yaml` can also be used as a Blueprint. Render will redeploy when you push to `main`.

## Push from VS Code

Create an empty GitHub repository, then run these commands in the VS Code terminal:

```bash
git init
git add .
git commit -m "Build Trailwise outdoor AI companion"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

For later changes:

```bash
git add .
git commit -m "Update Trailwise"
git push
```

## Submission draft

Use the DEV template with these tags: `devchallenge`, `hf26challenge`, `opensource`, `webdev`.

### Demo

Add your Render URL here after deployment.

### Code

Add your GitHub repository URL here.

### Prize category

Trailwise can enter **Best Use of Render** because the public static site is deployed on Render. Only claim that category if you keep the Render deployment active and explain its role in your DEV post.

## License

MIT
