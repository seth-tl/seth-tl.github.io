"use strict";

// The editable publication records live in content/site.json.
// Leave optional URLs blank to hide their buttons.

function escapeHtml(value) {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value ?? "").replace(/[&<>"']/g, (character) => entities[character]);
}

// Allow ordinary website URLs and relative paths, but not executable URLs.
function safeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value, location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function textLink(url, label) {
  const href = safeUrl(url);
  if (!href) return "";
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

// Small inline SVGs avoid an icon library or external image requests.
const iconPaths = {
  paper: `
    <path d="M5 2.5h7l3 3v12H5z" />
    <path d="M12 2.5v4h3M8 10h4M8 13h4" />
  `,
  archive: `
    <path d="M3 5h14v3H3zM5 8v9h10V8M8 11h4" />
  `,
  code: `
    <path d="m6 5-5 5 5 5M14 5l5 5-5 5M12 3l-4 14" />
  `,
  quote: `
    <path d="M8 5H3v6h5V5ZM3 11c0 3 1 4 3 4M17 5h-5v6h5V5ZM12 11c0 3 1 4 3 4" />
  `,
  copy: `
    <rect x="7" y="6" width="9" height="11" rx="1" />
    <path d="M12 6V3H3v11h4" />
  `,
};

function icon(name) {
  return `
    <svg class="pub-icon" viewBox="0 0 20 20" fill="none"
         stroke="currentColor" stroke-width="1.35"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${iconPaths[name] || ""}
    </svg>
  `;
}

function actionLink(url, label, iconName) {
  const href = safeUrl(url);
  if (!href) return "";
  return `
    <a class="pub-action" href="${escapeHtml(href)}">
      ${icon(iconName)}
      <span>${escapeHtml(label)}</span>
    </a>
  `;
}

function isArxiv(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") === "arxiv.org";
  } catch {
    return false;
  }
}

function publicationLinks(publication) {
  let arxivUrl = "";
  if (isArxiv(publication.arxivurl)) {
    arxivUrl = publication.arxivurl;
  } else if (isArxiv(publication.paperurl)) {
    arxivUrl = publication.paperurl;
  }

  // Paper and arXiv intentionally both appear for arXiv entries.
  return [
    actionLink(publication.paperurl, "Paper", "paper"),
    actionLink(arxivUrl, "arXiv", "archive"),
    actionLink(publication.codeurl, "Code", "code"),
  ].join("");
}

function publicationImage(publication) {
  const src = safeUrl(publication.image);
  if (!src) return "";
  const description = publication.imageAlt || `Figure for ${publication.title}`;
  return `
    <img class="pub-figure" src="${escapeHtml(src)}"
         alt="${escapeHtml(description)}" loading="lazy">
  `;
}

function citationButton(publication, index) {
  if (!publication.citation) return "";
  return `
    <button class="pub-action" data-cite="${index}">
      ${icon("copy")}
      <span aria-live="polite">Copy citation</span>
    </button>
  `;
}

function citationDetails(publication) {
  if (!publication.citation) return "";
  return `
    <details class="citation">
      <summary>${icon("quote")}<span>Citation</span></summary>
      <p>${escapeHtml(publication.citation)}</p>
    </details>
  `;
}

function renderPublication(publication, index, total) {
  const title =
    textLink(publication.paperurl, publication.title) || escapeHtml(publication.title);
  const year = publication.date.slice(0, 4);
  const status = publication.category === "preprints" ? " · Preprint" : "";

  return `
    <li class="publication" id="publication-${escapeHtml(publication.date)}-${index + 1}">
      <div class="pub-heading">
        <span class="pub-number">[${total - index}]</span>
        <span class="pub-title">${title}</span>
      </div>
      ${publicationImage(publication)}
      <div class="pub-authors">${escapeHtml(publication.authors)}</div>
      <div class="pub-meta">
        <i>${escapeHtml(publication.venue)}</i> · ${escapeHtml(year)}${status}
      </div>
      <div class="pub-links">
        ${publicationLinks(publication)}
        ${citationButton(publication, index)}
      </div>
      ${citationDetails(publication)}
    </li>
  `;
}

async function copyCitation(button, publications) {
  const label = button.querySelector("span");
  const publication = publications[Number(button.dataset.cite)];

  try {
    await navigator.clipboard.writeText(publication.citation);
    label.textContent = "Copied";
  } catch {
    // Let visitors select the citation when clipboard access is unavailable.
    const details = button.closest(".publication").querySelector("details");
    details.open = true;
    label.textContent = "Select citation below";
    const range = document.createRange();
    range.selectNodeContents(details.querySelector("p"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

async function loadPublications() {
  const list = document.querySelector("#publication-list");
  if (!list) return; // Teaching and Gallery do not need the JSON file.

  try {
    const response = await fetch("content/site.json");
    if (!response.ok) throw new Error("Publication content could not be loaded");
    const { publications } = await response.json();

    list.innerHTML = publications
      .map((publication, index) =>
        renderPublication(publication, index, publications.length),
      )
      .join("");

    document.querySelectorAll("[data-cite]").forEach((button) => {
      button.addEventListener("click", () => copyCitation(button, publications));
    });
  } catch (error) {
    const message = document.querySelector("#load-error");
    message.hidden = false;
    message.textContent =
      "Unable to load publications. Check content/site.json and preview using Live Server.";
    console.error(error);
  }
}

// content.js handles the editable HTML sections and external-link targets.
loadPublications();
