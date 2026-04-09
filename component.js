/* ═══════════════════════════════════════════════════════════════
   CUMULUS WEALTH — components.js
   ─────────────────────────────────────────────────────────────
   ONLY does two things:
     1. Fetches components/header.html + components/footer.html
        and injects them into #header-slot / #footer-slot
     2. After injection, calls initCumulus() from script.js

   ALL menu logic lives in script.js — this file never touches it.
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Helper: fetch HTML text ─────────────────────────── */
  async function loadHTML(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Cannot load ' + url);
    return res.text();
  }

  /* ── Main init ───────────────────────────────────────── */
  async function init() {
    try {
      const headerSlot = document.getElementById('header-slot');
      const footerSlot = document.getElementById('footer-slot');

      // Inject header
      if (headerSlot) {
        headerSlot.innerHTML = await loadHTML('components/header.html');
      }

      // Inject footer
      if (footerSlot) {
        footerSlot.innerHTML = await loadHTML('components/footer.html');
      }

      // Mark active page link
      highlightActivePage();

    } catch (err) {
      console.warn('[components.js]', err.message);
    }

    // Always boot interactions — works whether slots existed or not
    if (typeof initCumulus === 'function') {
      initCumulus();
    }
  }

  /* ── Highlight current page in footer nav ────────────── */
  function highlightActivePage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.c-footer__nav a, .c-onav__link').forEach(el => {
      const href = el.getAttribute('href') || '';
      if (href && href.replace('.html','') === page.replace('.html','')) {
        el.classList.add('is-current');
      }
    });
  }

  /* ── Run on DOM ready ────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();