/* NOVA Scents prototype interactions. Vanilla, no deps. Ports to theme.js. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Scroll reveal */
  function reveal() {
    var els = $$('[data-reveal]:not(.in)');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Header elevation */
  function header() {
    var h = $('#header'); if (!h) return;
    var tick = false;
    function up() { h.classList.toggle('is-scrolled', window.scrollY > 20); tick = false; }
    window.addEventListener('scroll', function () { if (!tick) { requestAnimationFrame(up); tick = true; } }, { passive: true });
    up();
  }

  /* Cart drawer + mobile nav (shared scrim) */
  function overlays() {
    var scrim = $('#scrim'), drawer = $('#drawer'), mnav = $('#mnav');
    function openD() { if (drawer) drawer.classList.add('is-open'); if (scrim) scrim.classList.add('is-open'); }
    function closeAll() {
      if (drawer) drawer.classList.remove('is-open');
      if (mnav) mnav.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-open');
    }
    var co = $('#cartOpen'); if (co) co.addEventListener('click', openD);
    var cc = $('#cartClose'); if (cc) cc.addEventListener('click', closeAll);
    if (scrim) scrim.addEventListener('click', closeAll);
    var b = $('#burger'); if (b && mnav) b.addEventListener('click', function () { mnav.classList.add('is-open'); scrim.classList.add('is-open'); });
    $$('.mnav a').forEach(function (a) { a.addEventListener('click', closeAll); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  /* PDP: quantity, sticky ATC, accordions, gallery, add-to-cart feedback */
  function pdp() {
    var val = $('#qVal');
    if (val) {
      var n = 1;
      $('#qMinus').addEventListener('click', function () { n = Math.max(1, n - 1); val.textContent = n; });
      $('#qPlus').addEventListener('click', function () { n = Math.min(10, n + 1); val.textContent = n; });
    }

    var bar = $('#stickybar');
    if (bar) {
      var anchor = $('#atc');
      var tick = false;
      function up() {
        var past = anchor ? anchor.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
        var atBottom = (window.innerHeight + window.scrollY) > (document.body.offsetHeight - 240);
        bar.classList.toggle('is-on', past && !atBottom);
        tick = false;
      }
      window.addEventListener('scroll', function () { if (!tick) { requestAnimationFrame(up); tick = true; } }, { passive: true });
      up();
    }

    $$('.acc__btn').forEach(function (btn) {
      var item = btn.parentElement, panel = btn.nextElementSibling;
      function set(open) { item.classList.toggle('is-open', open); panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0; }
      if (item.classList.contains('is-open')) set(true);
      btn.addEventListener('click', function () { set(!item.classList.contains('is-open')); });
    });

    var gm = $('#galMark');
    $$('.thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        $$('.thumb').forEach(function (x) { x.classList.remove('is-active'); });
        t.classList.add('is-active');
        if (gm && t.dataset.mark) gm.firstChild.textContent = t.dataset.mark;
      });
    });

    /* Size buttons */
    $$('.size').forEach(function (s) {
      s.addEventListener('click', function () { $$('.size').forEach(function (x) { x.classList.remove('is-active'); }); s.classList.add('is-active'); });
    });

    /* Add to cart -> open drawer with brief feedback */
    function added(btn) {
      var label = btn.textContent; btn.textContent = 'Tillagd ✓';
      var scrim = $('#scrim'), drawer = $('#drawer');
      setTimeout(function () {
        btn.textContent = label;
        if (drawer) drawer.classList.add('is-open'); if (scrim) scrim.classList.add('is-open');
      }, 550);
    }
    var atc = $('#atc'); if (atc) atc.addEventListener('click', function () { added(atc); });
    var atc2 = $('#atc2'); if (atc2) atc2.addEventListener('click', function () { added(atc2); });
  }

  function init() { reveal(); header(); overlays(); pdp(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
