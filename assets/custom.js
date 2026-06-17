/* ==========================================================================
   Nova Scents — Interaction Layer
   --------------------------------------------------------------------------
   Vanilla JS, no dependencies, deferred. Adds two quiet interactions:
     1. Scroll-reveal for any element with [data-reveal].
     2. A `.header-scrolled` flag on <html> once the page is scrolled.
   Both are gated behind prefers-reduced-motion and degrade gracefully.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Scroll reveal ------------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]:not(.is-revealed)');
    if (!els.length) return;

    // No IntersectionObserver (or reduced motion): show everything at once.
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    els.forEach(function (el) { io.observe(el); });
  }

  /* --- 2. Header elevation on scroll ------------------------------------ */
  function initHeaderScroll() {
    var root = document.documentElement;
    var ticking = false;
    function update() {
      root.classList.toggle('header-scrolled', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function init() {
    initReveal();
    initHeaderScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-scan when sections are re-rendered in the theme editor.
  document.addEventListener('shopify:section:load', initReveal);
})();
