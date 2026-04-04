/**
 * CUMULUS WEALTH — script.js
 * ─────────────────────────────────────────────────────────
 * All logic is inside initCumulus() so that components/includes.js
 * can call it AFTER the header + footer HTML has been injected.
 * ─────────────────────────────────────────────────────────
 */

function initCumulus() {
  'use strict';

  const navbar     = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const overlay    = document.getElementById('overlayMenu');
  const navItems   = document.querySelectorAll('.c-onav__item');
  const subPanels  = document.querySelectorAll('.c-sub');
  const leftCol    = document.querySelector('.c-overlay__left');

  if (!navbar || !menuToggle || !overlay) return;

  let menuOpen = false;

  /* ── Scroll: nav style ───────────────────────────────── */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── Open / close menu ───────────────────────────────── */
  function openMenu() {
    menuOpen = true;
    overlay.classList.add('is-open');
    navbar.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    subPanels.forEach(p => p.classList.remove('is-active'));
    navItems.forEach(i => i.classList.remove('is-active', 'is-open'));
  }

  function closeMenu() {
    menuOpen = false;
    overlay.classList.remove('is-open');
    navbar.classList.remove('menu-open');
    document.body.style.overflow = '';
    subPanels.forEach(p => p.classList.remove('is-active'));
    navItems.forEach(i => i.classList.remove('is-active', 'is-open'));
  }

  menuToggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

  /* ── Submenu: desktop hover + mobile accordion ───────── */
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth <= 768) return;
      const key = item.dataset.menu;
      navItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');
      subPanels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === key));
    });

    item.addEventListener('click', () => {
      if (window.innerWidth > 768) return;
      navItems.forEach(i => { if (i !== item) i.classList.remove('is-open'); });
      item.classList.toggle('is-open');
    });
  });

  if (leftCol) {
    leftCol.addEventListener('mouseleave', () => {
      if (window.innerWidth <= 768) return;
      navItems.forEach(i => i.classList.remove('is-active'));
      subPanels.forEach(p => p.classList.remove('is-active'));
    });
  }

  /* ── Smooth anchor scroll ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const doScroll = () => target.scrollIntoView({ behavior: 'smooth' });
      menuOpen ? (closeMenu(), setTimeout(doScroll, 420)) : doScroll();
    });
  });

  /* ── Hero wave parallax ──────────────────────────────── */
  const wvGroup = document.querySelector('.c-hero__waves');
  if (wvGroup) {
    window.addEventListener('scroll', () => {
      wvGroup.style.transform = `translateY(${window.scrollY * 0.12}px)`;
    }, { passive: true });
  }

  /* ── Scroll reveal ───────────────────────────────────── */
  const revealEls = document.querySelectorAll('.ab-reveal');
  if (revealEls.length) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => ro.observe(el));
  }
}

/* ─────────────────────────────────────────────────────────
   Fallback: if page has no data-include placeholders,
   run immediately (works for pages not yet migrated).
───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('[data-include]')) {
    initCumulus();
  }
});
