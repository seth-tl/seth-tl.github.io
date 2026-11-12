"use strict";

// Enlarge content images from publications or the editable HTML files.
// The profile photo keeps its normal behavior.
(() => {
  const main = document.querySelector("main");
  if (!main) return;

  const viewer = document.createElement("dialog");
  viewer.className = "image-viewer";
  viewer.setAttribute("aria-label", "Enlarged image");
  viewer.innerHTML = `
    <button class="image-viewer-close" type="button" aria-label="Close enlarged image">
      Close ×
    </button>
    <figure>
      <img class="image-viewer-image" alt="">
      <figcaption></figcaption>
    </figure>
  `;
  document.body.append(viewer);

  const enlargedImage = viewer.querySelector("img");
  const caption = viewer.querySelector("figcaption");
  const closeButton = viewer.querySelector("button");
  let previousFocus;

  function openImage(image) {
    previousFocus = document.activeElement;
    // Optional data-fullsize can point to a higher-resolution image.
    enlargedImage.src = image.dataset.fullsize || image.currentSrc || image.src;
    enlargedImage.alt = image.alt || "Enlarged figure";
    caption.textContent =
      image.closest("figure")?.querySelector("figcaption")?.textContent ||
      image.alt ||
      "";
    caption.hidden = !caption.textContent;
    viewer.showModal();
    document.body.classList.add("image-viewer-open");
    closeButton.focus();
  }

  function prepareImages() {
    main.querySelectorAll("img").forEach((image) => {
      image.classList.add("zoomable-image");
      image.title = "Click to enlarge";
      if (!image.closest("a, button")) {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Enlarge: " + (image.alt || "figure"));
        image.setAttribute("aria-haspopup", "dialog");
      }
    });
  }

  // Delegation also works for images loaded later from content files.
  main.addEventListener("click", (event) => {
    const image =
      event.target.closest("img.zoomable-image") ||
      event.target.closest("a")?.querySelector("img.zoomable-image");
    if (!image) return;
    event.preventDefault();
    openImage(image);
  });

  main.addEventListener("keydown", (event) => {
    if (!event.target.matches("img.zoomable-image")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImage(event.target);
    }
  });

  closeButton.addEventListener("click", () => viewer.close());
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) viewer.close();
  });
  // Native dialog handles Escape and keeps keyboard focus inside the viewer.
  viewer.addEventListener("close", () => {
    document.body.classList.remove("image-viewer-open");
    previousFocus?.focus();
    enlargedImage.removeAttribute("src");
  });

  prepareImages();
  new MutationObserver(prepareImages).observe(main, { childList: true, subtree: true });
})();
