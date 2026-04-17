/* ═══════════════════════════════════════════════════════════════
   CUMULUS WEALTH — script.js
   Called by components.js after header/footer injection.
   All menu behaviour: CLICK to open/close, click outside to dismiss.
═══════════════════════════════════════════════════════════════ */

function initCumulus() {
  'use strict';

  if (window.__cumulusInitialized) return;
  window.__cumulusInitialized = true;

  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const overlay    = document.getElementById('overlayMenu');

  if (!navbar || !menuToggle || !overlay) return;

  const navItems  = document.querySelectorAll('.c-onav__item');
  const subPanels = document.querySelectorAll('.c-sub');

  let menuOpen  = false;
  let activeKey = null;   // tracks which submenu is open

  /* ── Navbar scroll style ────────────────────────────── */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── Open / close MAIN overlay ─────────────────────── */
  function openMenu() {
    menuOpen = true;
    overlay.classList.add('is-open');
    navbar.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuOpen  = false;
    activeKey = null;
    overlay.classList.remove('is-open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
    navItems.forEach(i => i.classList.remove('is-active', 'is-open'));
    subPanels.forEach(p => p.classList.remove('is-active'));
  }

  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });

  // Escape key always closes
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  // Click anywhere outside overlay → close
  document.addEventListener('click', e => {
    if (menuOpen &&
        !overlay.contains(e.target) &&
        !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  /* ── DESKTOP: click nav item → toggle right panel ───── */
  navItems.forEach(item => {

    // Desktop click
    item.addEventListener('click', e => {
      e.stopPropagation();

      if (window.innerWidth <= 768) return; // handled by mobile block

      const key = item.dataset.menu;

      if (activeKey === key) {
        // Same item clicked → collapse
        activeKey = null;
        item.classList.remove('is-active');
        subPanels.forEach(p => {
          if (p.dataset.panel === key) p.classList.remove('is-active');
        });
        return;
      }

      // Open this item
      activeKey = key;
      navItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      subPanels.forEach(p => {
        p.classList.toggle('is-active', p.dataset.panel === key);
      });
    });

    /* ── MOBILE: click nav item → accordion ──────────── */
    item.addEventListener('click', e => {
      e.stopPropagation();

      if (window.innerWidth > 768) return;

      const isOpen = item.classList.contains('is-open');
      navItems.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  // Stop clicks inside a sub-panel from bubbling to document
  subPanels.forEach(p => p.addEventListener('click', e => e.stopPropagation()));

  /* ── Smooth anchor scroll ───────────────────────────── */
document.querySelectorAll('a[href*="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href.includes('#')) return;

    const [page, hash] = href.split('#');

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // If same page (or no page specified)
    if (!page || page === currentPage) {
      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();

      const go = () => {
        target.scrollIntoView({ behavior: 'smooth' });
      };

      if (menuOpen) {
        closeMenu();
        setTimeout(go, 420);
      } else {
        go();
      }
    }
  });
});

  /* ── Hero wave parallax ─────────────────────────────── */
  const wvGroup = document.querySelector('.c-hero__waves');
  if (wvGroup) {
    window.addEventListener('scroll', () => {
      wvGroup.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    }, { passive: true });
  }

  /* ── Scroll reveal (.ab-reveal) ─────────────────────── */
  const revealEls = document.querySelectorAll('.ab-reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => ro.observe(el));
  }

  /* ── Counter animation ──────────────────────────────── */
  const statNums = document.querySelectorAll('[data-target]');
  if (statNums.length && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          co.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => co.observe(el));
  }

  function animateCounter(el) {
    const target  = parseFloat(el.dataset.target);
    const isFloat = target % 1 !== 0;
    const dur     = 1800;
    const t0      = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = isFloat ? (target * e).toFixed(1) : Math.round(target * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
}

/* ── Fallback: if NOT using components.js (no slots) ── */
function bootCumulus() {
  if (window.__cumulusInitialized) return;
  const menuToggle = document.getElementById('menuToggle');
  const overlay    = document.getElementById('overlayMenu');
  const navbar     = document.getElementById('navbar');
  if (menuToggle && overlay && navbar) {
    initCumulus();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCumulus);
} else {
  bootCumulus();
}
document.addEventListener('componentsLoaded', bootCumulus);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll('.animate').forEach(el => {
  observer.observe(el);
});

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  loader.style.opacity = "0";

  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
});