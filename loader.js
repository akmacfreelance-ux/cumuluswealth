/* ═══════════════════════════════════════════════
   CUMULUS WEALTH — SITE LOADER
   Include loader.css + this file in every page.
   Add the loader HTML via data-include OR paste
   the snippet manually (see bottom of this file).
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── CONFIG ── */
  var MIN_DURATION = 1800;   // ms — loader shows for at least this long
  var INCREMENT_MS = 40;     // how often the bar ticks
  var FAST_TICK    = 3;      // % per tick while loading
  var SLOW_TICK    = 0.6;    // % per tick while waiting (stall near 85%)
  var STALL_AT     = 85;     // % at which bar stalls until page is ready

  /* ── STATE ── */
  var startTime   = Date.now();
  var pct         = 0;
  var pageReady   = false;
  var timerDone   = false;
  var dismissed   = false;
  var tickInterval;

  /* ── DOM REFS ── */
  var loader, bar, pctEl;

  /* ── BUILD LOADER HTML ── */
  function buildLoader() {
    var el = document.createElement('div');
    el.className = 'c-loader';
    el.id = 'c-loader';
    el.innerHTML = [
      '<svg class="c-loader__waves" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">',
        '<path class="c-loader__wave" d="M-100 420 Q200 380 500 415 Q800 450 1100 400 Q1300 370 1540 410" stroke="rgba(79,195,232,0.14)" stroke-width="1.2"/>',
        '<path class="c-loader__wave" d="M-100 460 Q220 415 520 455 Q820 495 1120 440 Q1320 410 1540 455" stroke="rgba(79,195,232,0.09)" stroke-width="1"/>',
        '<path class="c-loader__wave" d="M-100 500 Q180 460 480 498 Q780 536 1080 480 Q1300 452 1540 496" stroke="rgba(45,110,130,0.16)" stroke-width="1.4"/>',
        '<path class="c-loader__wave" d="M-100 540 Q240 496 540 538 Q840 580 1140 520 Q1340 492 1540 536" stroke="rgba(45,110,130,0.09)" stroke-width="0.8"/>',
        '<path class="c-loader__wave" d="M-100 380 Q160 344 460 378 Q760 412 1060 360 Q1280 333 1540 372" stroke="rgba(79,195,232,0.07)" stroke-width="1"/>',
        '<path class="c-loader__wave" d="M-100 580 Q200 536 500 575 Q800 614 1100 558 Q1320 528 1540 570" stroke="rgba(45,110,130,0.08)" stroke-width="0.8"/>',
      '</svg>',
      '<div class="c-loader__body">',
        '<div class="c-loader__logo">',
          '<img src="./images/logo.png" alt="Cumulus Wealth" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">',
          '<div class="c-loader__logo-text">',
            '<span class="c-loader__logo-name">Cumulus</span>',
            '<span class="c-loader__logo-sub">Wealth</span>',
          '</div>',
        '</div>',
        '<div class="c-loader__bar-wrap">',
          '<div class="c-loader__bar" id="c-loader-bar"></div>',
        '</div>',
        '<span class="c-loader__pct" id="c-loader-pct">0%</span>',
      '</div>'
    ].join('');

    document.body.insertBefore(el, document.body.firstChild);
    return el;
  }

  /* ── SET PROGRESS ── */
  function setProgress(val) {
    pct = Math.min(100, Math.max(0, val));
    if (bar)   bar.style.width = pct + '%';
    if (pctEl) pctEl.textContent = Math.floor(pct) + '%';
  }

  /* ── DISMISS LOADER ── */
  function dismiss() {
    if (dismissed) return;
    dismissed = true;

    clearInterval(tickInterval);
    setProgress(100);

    /* Short pause at 100% so user sees it complete */
    setTimeout(function () {
      loader.classList.add('is-exiting');
      setTimeout(function () {
        loader.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 700);
    }, 280);
  }

  /* ── CHECK IF READY TO DISMISS ── */
  function checkDismiss() {
    var elapsed = Date.now() - startTime;
    if (pageReady && elapsed >= MIN_DURATION) {
      dismiss();
    } else if (pageReady && elapsed < MIN_DURATION) {
      /* Page loaded fast — wait out the minimum duration */
      setTimeout(function () {
        if (!dismissed) dismiss();
      }, MIN_DURATION - elapsed);
    }
  }

  /* ── TICK: animate progress bar ── */
  function tick() {
    var target = pageReady ? 100 : STALL_AT;
    var speed  = (pct < STALL_AT) ? FAST_TICK : SLOW_TICK;

    if (pct < target) {
      setProgress(pct + speed);
    }

    if (pct >= 100 && !dismissed) {
      dismiss();
    }
  }

  /* ── INIT ── */
  function init() {
    /* Lock scroll while loading */
    document.body.style.overflow = 'hidden';

    loader = buildLoader();
    bar    = document.getElementById('c-loader-bar');
    pctEl  = document.getElementById('c-loader-pct');

    tickInterval = setInterval(tick, INCREMENT_MS);

    /* Mark page ready on window load */
    if (document.readyState === 'complete') {
      pageReady = true;
      checkDismiss();
    } else {
      window.addEventListener('load', function () {
        pageReady = true;
        checkDismiss();
      });
    }

    /* Safety net — always dismiss after 6s */
    setTimeout(function () {
      if (!dismissed) dismiss();
    }, 6000);
  }

  /* Run as early as possible */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();