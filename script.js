// Afroza Islam portfolio: theme, reveal-on-scroll, progress bar, active nav, rotating word, count-up.
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme ---------- */
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));

  var btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- reveal on scroll ---------- */
  var groups = [
    '.hero > *',
    'section > .label', 'section > h2',
    '.list > li', '.pubs h3.group', '.pubs ol > li',
    '.about p', '.about ul', '.contact p', '.links > li'
  ];
  var items = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { items.push(el); });
  });
  items.forEach(function (el, i) {
    el.classList.add('reveal');
    var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--d', Math.min(sibs, 6) * 70 + 'ms');
  });

  function showAll() { items.forEach(function (el) { el.classList.add('in'); }); }

  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- scroll progress bar ---------- */
  var bar = document.getElementById('progress');
  function onScroll() {
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    bar.style.transform = 'scaleX(' + p + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- active nav link ---------- */
  var links = {};
  document.querySelectorAll('nav a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (!a || a.classList.contains('pill')) return;
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    ['work', 'research', 'about', 'experience'].forEach(function (id) {
      var s = document.getElementById(id); if (s) spy.observe(s);
    });
  }

  /* ---------- rotating word in the headline ---------- */
  var rot = document.getElementById('rot');
  if (rot && !reduce) {
    var words = ['trusted', 'verified', 'reproduced', 'explained'];
    var i = 0;
    setInterval(function () {
      rot.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % words.length;
        rot.textContent = words[i];
        rot.classList.remove('out');
      }, 360);
    }, 2600);
  }

  /* ---------- count-up numbers ---------- */
  var counters = document.querySelectorAll('.count');
  function runCount(el) {
    var to = parseFloat(el.getAttribute('data-to'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var dur = 1400, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = (to * eased).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = to.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  if (reduce || !('IntersectionObserver' in window)) {
    // keep the final numbers already written in the HTML
  } else {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = (0).toFixed(parseInt(el.getAttribute('data-dec') || '0', 10)); co.observe(el); });
  }
})();
