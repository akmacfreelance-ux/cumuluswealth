/* ═══════════════════════════════════════════════
   CUMULUS WEALTH — script.js
═══════════════════════════════════════════════ */
(function () {
  'use strict';

  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const overlay    = document.getElementById('overlayMenu');
  const navItems   = document.querySelectorAll('.c-onav__item');
  const subPanels  = document.querySelectorAll('.c-sub');
  const leftCol    = document.querySelector('.c-overlay__left');

  let menuOpen = false;

  /* ── Scroll: nav style ─────────────────────── */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── Open / close menu ─────────────────────── */
  function openMenu() {
    menuOpen = true;
    overlay.classList.add('is-open');
    navbar.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    // Reset panels & items
    subPanels.forEach(p => p.classList.remove('is-active'));
    navItems.forEach(i => i.classList.remove('is-active'));
  }

  function closeMenu() {
    menuOpen = false;
    overlay.classList.remove('is-open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
    subPanels.forEach(p => p.classList.remove('is-active'));
    navItems.forEach(i => i.classList.remove('is-active'));
  }

  menuToggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* ── Submenu hover ─────────────────────────── */
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const key = item.dataset.menu;
      navItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      subPanels.forEach(p => {
        p.classList.toggle('is-active', p.dataset.panel === key);
      });
    });
  });

  if (leftCol) {
    leftCol.addEventListener('mouseleave', () => {
      navItems.forEach(i => i.classList.remove('is-active'));
      subPanels.forEach(p => p.classList.remove('is-active'));
    });
  }

  /* ── Smooth anchor scroll ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const doScroll = () => target.scrollIntoView({ behavior: 'smooth' });
      if (menuOpen) { closeMenu(); setTimeout(doScroll, 420); }
      else doScroll();
    });
  });

  /* ── Wave parallax (subtle) ────────────────── */
  const wvGroup = document.querySelector('.c-hero__waves');
  if (wvGroup) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.12;
      wvGroup.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

})();