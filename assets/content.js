"use strict";
// Content files are HTML authored by the site owner.
function externalLinks(root) {
  const anchors = root.matches?.('a[href]') ? [root] : [];
  anchors.push(...root.querySelectorAll('a[href]'));
  anchors.forEach(anchor => {
    try {
      const url = new URL(anchor.getAttribute('href'), location.href);
      if (['http:', 'https:'].includes(url.protocol) && url.origin !== location.origin) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      }
    } catch { /* Leave incomplete links alone while editing. */ }
  });
}
externalLinks(document);
// Also cover publications, CV links, and links in the HTML includes.
new MutationObserver(records => {
  records.forEach(record => {
    if (record.type === 'attributes') externalLinks(record.target);
    else record.addedNodes.forEach(node => { if (node.nodeType === 1) externalLinks(node); });
  });
}).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
(async () => {
  const results = await Promise.allSettled(Array.from(document.querySelectorAll('[data-content]'), async element => {
    const path = element.dataset.content;
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error('Could not load ' + path);
      element.innerHTML = await response.text();
      externalLinks(element);
    } catch (error) {
      element.textContent = 'Unable to load this section. Please check ' + path + '.';
      element.setAttribute('role', 'alert');
      throw error;
    }
  }));
  results.forEach(result => { if (result.status === 'rejected') console.error(result.reason); });
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
