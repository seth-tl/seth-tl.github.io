# Seth Taylor — website

A small static website. Edit in VS Code; no build step, dependencies, or browser editor.

## Preview and publish

Open the folder in VS Code. Install **Live Server** by Ritwick Dey, then right-click `index.html` → **Open with Live Server**. Alternatively run `python3 -m http.server 8000` in the website folder and open http://localhost:8000. Double-clicking the HTML files will not load the content includes.

Upload the ZIP's contents directly to the root of `seth-tl.github.io`. Keep `.nojekyll`. In GitHub Settings → Pages, choose Deploy from a branch and /(root). Commit and push later edits to publish.

## What to edit

| File | Content |
| --- | --- |
| `content/about.html` | About Me |
| `content/research.html` | Research introduction, topics, images, and videos |
| `content/teaching.html` | Teaching page — commented course examples included |
| `content/gallery.html` | Gallery page — commented image/video examples included |
| `content/site.json` | Profile details, publications, collaborators, short CV, full-CV link |
| `assets/style.css` | Layout, palette, font, and spacing |
| `assets/portrait.jpg` | Profile photo |

`index.html`, `teaching.html`, and `gallery.html` are the outer page layouts. Normally edit their content files instead. `assets/site.js` renders the JSON content. `assets/content.js` imports HTML content and makes external website links open in new tabs. Internal navigation stays in the current tab; email links use your mail app.

## Editing text and teaching

Use ordinary HTML in the content files:

```html
<h2>Course title</h2>
<p>Institution · Term and year</p>
<p>A course description with a <a href="https://example.com">link</a>.</p>
<ul>
  <li><a href="assets/notes.pdf">Lecture notes</a></li>
</ul>
```

Only write the content, not a full HTML document. Copy the commented examples already provided in Teaching and Gallery, then remove the placeholder paragraphs.

## Images and videos

Put your files in `assets/`. Paths in all content files start from the website page, so use `assets/figure.jpg`, NOT `../assets/figure.jpg`.

```html
<figure>
  <a href="assets/figure.jpg">
    <img src="assets/figure.jpg" alt="Description of the image" loading="lazy">
  </a>
  <figcaption>Your caption.</figcaption>
</figure>
```

For the gallery, add figures inside `<div class="gallery-grid">`. It automatically arranges figures into columns and stacks them on small screens.

```html
<figure>
  <video controls playsinline preload="metadata">
    <source src="assets/simulation.mp4" type="video/mp4">
    <a href="assets/simulation.mp4">Download video</a>
  </video>
  <figcaption>Description of the simulation.</figcaption>
</figure>
```

For larger videos, link to a video host or embed YouTube:

```html
<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
        title="Description of the simulation" loading="lazy" allowfullscreen></iframe>
```

## Publications, collaborators, and CV

Edit `content/site.json`. Copy an existing publication entry to add another. Keep commas and double quotes valid. Array order is display order. arXiv-only papers get one arXiv button; journal articles get a Paper button plus an optional arXiv link. `citation` is the text visitors can read/copy. Optional publication figures use `image` and `imageAlt`.

Edit `profile.collaboratorsText` for collaborators and `profile.cvText` for the short CV. Use `\n` for line breaks inside a JSON string. Upload a CV PDF to `assets/`, then set `profile.cvUrl` to `assets/cv.pdf` (or an external URL). A blank URL hides the full-CV link.

## Font and colors

The CSS begins with the locally bundled Computer Modern font faces (traditional LaTeX typography), then a single `:root` palette. Normal, bold, italic, and bold italic fonts are included. They do not require an external font service. Keep `assets/fonts/LICENSE.txt` with the font files; the fonts use the SIL Open Font License.

## Publication verification

Seven unique papers were checked against arXiv and publisher records on November 11, 2026. Google Scholar was inaccessible, so exact completeness against that profile is unverified. The vertical-coordinate journal article and preprint are combined in one entry.
