(function () {
  'use strict';

  console.log("🚀 includes.js loaded");

  const includes = document.querySelectorAll('[data-include]');
  console.log("📦 Found includes:", includes.length);

  if (!includes.length) return;

  let pending = includes.length;

  function onAllLoaded() {
    console.log("✅ All includes loaded");

    // Highlight active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log("📄 Current page:", currentPage);

    document.querySelectorAll('.c-onav a, .c-sub__links a, .c-footer__nav a')
      .forEach(link => {
        const href = link.getAttribute('href') || '';
        const linkPage = href.split('/').pop().split('#')[0];

        if (linkPage && linkPage === currentPage) {
          console.log("👉 Active link:", href);
          link.classList.add('is-current-page');
        }
      });

    // Init main script
    if (typeof initCumulus === 'function') {
      console.log("⚙️ initCumulus() called");
      initCumulus();
    } else {
      console.warn("⚠️ initCumulus() NOT FOUND");
    }
  }

  includes.forEach(function (el, index) {
    const src = el.getAttribute('data-include');

    console.log(`📡 [${index}] Fetching:`, src);

    fetch(src)
      .then(function (res) {
        console.log(`📥 Response for ${src}:`, res.status);

        if (!res.ok) {
          throw new Error(`❌ Failed to load ${src} (Status: ${res.status})`);
        }

        return res.text();
      })
      .then(function (html) {
        console.log(`✅ Injecting: ${src}`);

        // safer than outerHTML
        el.innerHTML = html;

        pending--;
        console.log("⏳ Remaining:", pending);

        if (pending === 0) onAllLoaded();
      })
      .catch(function (err) {
        console.error("🔥 ERROR:", err.message);

        el.innerHTML = `<p style="color:red;">Failed to load ${src}</p>`;

        pending--;
        if (pending === 0) onAllLoaded();
      });
  });

})();