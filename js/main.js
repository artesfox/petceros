/* Pet'Ceros Grooming! — landing */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Scroll suave (Lenis) ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
  }
  function headerH() { return $('.site-header').offsetHeight; }
  function scrollToTarget(el) {
    if (lenis) lenis.scrollTo(el, { offset: -headerH() + 1 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerH() + 1, behavior: reduce ? 'auto' : 'smooth' });
  }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = $(id);
      if (!t) return;
      e.preventDefault();
      closeMenu();
      scrollToTarget(t);
    });
  });

  /* ---------- Header: cambia de color al hacer scroll ---------- */
  var header = $('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Sección activa en el menú
  var navLinks = $$('.nav a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var s = $(l.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* ---------- Menú móvil (hamburguesa + panel lateral) ---------- */
  var toggle = $('.menu-toggle');
  function closeMenu() {
    root.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  toggle.addEventListener('click', function () {
    var open = !root.classList.contains('menu-open');
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $('.nav-overlay').addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 980) closeMenu(); });

  /* ---------- Slider del banner ---------- */
  var slides = $$('.slide');
  var dots = $$('.slider-dots button');
  var current = 0, timer = null;
  function goTo(i) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
  }
  function play() { stop(); timer = setInterval(function () { goTo(current + 1); }, 5500); }
  function stop() { if (timer) clearInterval(timer); }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); play(); }); });
  // swipe en móvil
  var sx = null, hero = $('.hero');
  hero.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); play(); }
    sx = null;
  });
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : play(); });
  play();

  /* ---------- Aparición al hacer scroll ---------- */
  $$('[data-stagger]').forEach(function (g) {
    var step = Number(g.getAttribute('data-stagger')) || 100;
    $$(':scope > [data-reveal]', g).forEach(function (c, i) { c.style.setProperty('--d', i * step + 'ms'); });
  });
  $$('[data-delay]').forEach(function (el) { el.style.setProperty('--d', el.getAttribute('data-delay') + 'ms'); });
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Parallax del fondo de huellas ---------- */
  var par = $$('[data-parallax]');
  if (par.length && !reduce) {
    var ticking = false;
    var upd = function () {
      var vh = window.innerHeight;
      par.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var sp = Number(el.getAttribute('data-parallax')) || 0.15;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * -sp).toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, { passive: true });
    upd();
  }

  /* ---------- Tarjetas de servicios: tap en móvil ---------- */
  $$('.flip').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('[data-book]')) return;
      if (window.matchMedia('(hover: none)').matches) {
        $$('.flip.is-flipped').forEach(function (c) { if (c !== card) c.classList.remove('is-flipped'); });
        card.classList.toggle('is-flipped');
      }
    });
  });

  /* ---------- Antes / Después ---------- */
  $$('.ba').forEach(function (ba) {
    var input = $('input', ba);
    var set = function () { ba.style.setProperty('--pos', input.value + '%'); };
    input.addEventListener('input', set);
    set();
  });

  /* =========================================================
     BOOKING (simulado)
     ========================================================= */
  var CATEGORIES = [
    { id: 1, name: 'FULL GROOMING' },
    { id: 2, name: 'DOG WALKING' },
    { id: 3, name: 'BUBBLE BATHS' },
    { id: 4, name: 'DE-SHEDDING TREATMENTS' },
    { id: 5, name: 'BOARDING' }
  ];
  var SERVICES = [
    { id: 1, cat: 1, name: 'FULL GROOMING up to 20 lbs: $70', price: 70 },
    { id: 3, cat: 1, name: 'FULL GROOMING 20- 40 lbs: $85', price: 85 },
    { id: 4, cat: 1, name: 'FULL GROOMING 40 -60 lbs: $100', price: 100 },
    { id: 6, cat: 3, name: 'BUBBLE BATHS up to 20 lbs: $45', price: 45 },
    { id: 7, cat: 3, name: 'BUBBLE BATHS 20 – 40 lbs: $60', price: 60 },
    { id: 8, cat: 3, name: 'BUBBLE BATHS 40 – 60 lbs: $75', price: 75 },
    { id: 9, cat: 4, name: 'DE-SHEDDING TREATMENTS up to 20 lbs: $65', price: 65 },
    { id: 10, cat: 4, name: 'DE-SHEDDING TREATMENTS 20 – 40 lbs: $80', price: 80 },
    { id: 11, cat: 4, name: 'DE-SHEDDING TREATMENTS 20- 60 lbs: $95', price: 95 },
    { id: 5, cat: 2, name: 'DOG WALKING 30 min', price: 17 },
    { id: 12, cat: 2, name: 'DOG WALKING 60 min', price: 32 },
    { id: 13, cat: 2, name: 'DOG WALKING 90 min', price: null },
    { id: 14, cat: 5, name: 'BOARDING ONE NIGHT: $50', price: 50 },
    { id: 15, cat: 5, name: 'BOARDING TWO NIGHTS: $100', price: 100 },
    { id: 16, cat: 5, name: 'BOARDING THREE NIGHTS: $150', price: 150 },
    { id: 17, cat: 5, name: 'BOARDING FOUR NIGHTS: $160', price: 160 },
    { id: 18, cat: 5, name: 'BOARDING FIVE NIGHTS: $200', price: 200 },
    { id: 19, cat: 5, name: 'BOARDING SIX NIGHTS: $300', price: 300 },
    { id: 20, cat: 5, name: 'BOARDING SEVEN NIGHTS: $350', price: 350 }
  ];
  var TIMES = ['8:00 am', '10:00 am', '12:00 pm', '2:00 pm', '4:00 pm'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MON3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var modal = $('#booking');
  var catSel = $('#bk-cat'), srvSel = $('#bk-srv');
  var panes = $$('.bk-pane', modal);
  var stepEls = $$('.bk-steps li', modal);
  var state = {};

  CATEGORIES.forEach(function (c) { catSel.add(new Option(c.name, c.id)); });
  function fillServices(cat) {
    var keep = srvSel.value;
    srvSel.length = 1;
    SERVICES.filter(function (s) { return !cat || s.cat === cat; })
      .forEach(function (s) { srvSel.add(new Option(s.name, s.id)); });
    srvSel.value = $$('option', srvSel).some(function (o) { return o.value === keep; }) ? keep : '0';
  }
  fillServices(0);
  catSel.addEventListener('change', function () { fillServices(Number(catSel.value)); hideErr('#bk-err1'); });
  srvSel.addEventListener('change', function () {
    var s = findService(srvSel.value);
    if (s) catSel.value = s.cat;
    fillServices(s ? s.cat : 0);
    srvSel.value = s ? s.id : 0;
    hideErr('#bk-err1');
  });
  function findService(id) { return SERVICES.filter(function (s) { return s.id === Number(id); })[0]; }
  function hideErr(sel) { $(sel).hidden = true; }

  function showStep(n) {
    panes.forEach(function (p) { p.classList.toggle('is-active', Number(p.getAttribute('data-step')) === n); });
    stepEls.forEach(function (li, i) { li.classList.toggle('is-on', i < n); });
    state.step = n;
    $('.bk', modal).scrollTop = 0;
  }
  function fill(key, val) { $$('[data-bk="' + key + '"]', modal).forEach(function (el) { el.textContent = val; }); }

  /* Abrir / cerrar */
  var lastFocus = null;
  function openBooking(cat) {
    lastFocus = document.activeElement;
    closeMenu();
    state = { step: 1 };
    $$('form', modal).forEach(function (f) { f.reset(); });
    $$('.is-invalid', modal).forEach(function (el) { el.classList.remove('is-invalid'); });
    $$('.bk-error', modal).forEach(function (el) { el.hidden = true; });
    catSel.value = cat || 0;
    fillServices(cat || 0);
    showStep(1);
    if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    if (lenis) lenis.stop();
    root.style.overflow = 'hidden';
  }
  function closeBooking() {
    modal.classList.add('is-closing');
    setTimeout(function () {
      modal.classList.remove('is-closing');
      if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
    }, 240);
  }
  modal.addEventListener('close', function () {
    if (lenis) lenis.start();
    root.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  });
  modal.addEventListener('cancel', function (e) { e.preventDefault(); closeBooking(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeBooking(); });
  $$('[data-bk-close]', modal).forEach(function (b) { b.addEventListener('click', closeBooking); });
  $$('[data-book]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      openBooking(Number(b.getAttribute('data-book')) || 0);
    });
  });
  $$('[data-back]', modal).forEach(function (b) { b.addEventListener('click', function () { showStep(state.step - 1); }); });

  /* Paso 1 → 2 */
  $('[data-step="1"]', modal).addEventListener('submit', function (e) {
    e.preventDefault();
    var s = findService(srvSel.value);
    if (!s) { $('#bk-err1').hidden = false; srvSel.classList.add('is-invalid'); return; }
    srvSel.classList.remove('is-invalid');
    state.service = s;
    fill('service', s.name);
    var today = new Date();
    state.view = new Date(today.getFullYear(), today.getMonth(), 1);
    state.date = firstAvailable();
    if (state.date) state.view = new Date(state.date.getFullYear(), state.date.getMonth(), 1);
    renderCalendar();
    renderSlots();
    showStep(2);
  });

  /* Disponibilidad simulada: algunos martes, jueves, sábados y domingos */
  function seed(d) { var x = Math.sin(d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate()) * 10000; return x - Math.floor(x); }
  function startOfToday() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }
  function isAvailable(d) {
    var t = startOfToday();
    var max = new Date(t); max.setDate(max.getDate() + 90);
    if (d <= t || d > max) return false;
    return [0, 2, 4, 6].indexOf(d.getDay()) > -1 && seed(d) > 0.2;
  }
  function firstAvailable() {
    var d = startOfToday();
    for (var i = 0; i < 90; i++) { d.setDate(d.getDate() + 1); if (isAvailable(d)) return new Date(d); }
    return null;
  }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  var calDays = $('.cal-days', modal);
  function renderCalendar() {
    var v = state.view, t = startOfToday();
    $('.cal-title', modal).innerHTML = MONTHS[v.getMonth()] + ' <em>' + v.getFullYear() + '</em>';
    var thisMonth = new Date(t.getFullYear(), t.getMonth(), 1);
    var lastMonth = new Date(t.getFullYear(), t.getMonth() + 3, 1);
    $('[data-cal="-1"]', modal).disabled = v <= thisMonth;
    $('[data-cal="1"]', modal).disabled = v >= lastMonth;

    calDays.innerHTML = '';
    var offset = (v.getDay() + 6) % 7; // lunes primero
    var start = new Date(v); start.setDate(1 - offset);
    for (var i = 0; i < 42; i++) {
      var d = new Date(start); d.setDate(start.getDate() + i);
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = d.getDate();
      if (d.getMonth() !== v.getMonth()) b.classList.add('is-out');
      if (sameDay(d, t)) b.classList.add('is-today');
      if (isAvailable(d) && d.getMonth() === v.getMonth()) {
        b.classList.add('is-available');
        b.setAttribute('aria-label', DAYS[d.getDay()] + ' ' + MONTHS[d.getMonth()] + ' ' + d.getDate() + ', available');
        (function (day) { b.addEventListener('click', function () { state.date = day; renderCalendar(); renderSlots(); }); })(d);
      } else {
        b.tabIndex = -1;
        b.setAttribute('aria-disabled', 'true');
      }
      if (sameDay(d, state.date)) b.classList.add('is-selected');
      calDays.appendChild(b);
    }
  }
  $$('.cal-nav', modal).forEach(function (b) {
    b.addEventListener('click', function () {
      var v = state.view;
      state.view = new Date(v.getFullYear(), v.getMonth() + Number(b.getAttribute('data-cal')), 1);
      renderCalendar();
    });
  });

  function renderSlots() {
    var d = state.date, list = $('.slots-list', modal), head = $('.slots-date', modal);
    list.innerHTML = '';
    if (!d) { head.textContent = '—'; list.innerHTML = '<p class="slots-empty">No slots available</p>'; return; }
    head.textContent = DAYS[d.getDay()] + ', ' + MON3[d.getMonth()] + ' ' + d.getDate();
    var times = TIMES.filter(function (t, i) { return seed(new Date(d.getTime() + (i + 1) * 3600e3 * 7)) > 0.25; });
    if (!times.length) times = TIMES.slice(1, 3);
    times.forEach(function (t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = t;
      b.style.animationDelay = i * 50 + 'ms';
      b.addEventListener('click', function () {
        state.time = t;
        fill('time', t);
        fill('date', MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear());
        showStep(3);
      });
      list.appendChild(b);
    });
  }

  /* Paso 3 → 4 */
  var form3 = $('[data-step="3"]', modal);
  form3.addEventListener('input', function (e) { e.target.classList.remove('is-invalid'); });
  form3.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form3.elements, ok = true;
    var checks = [
      [f.name, f.name.value.trim().length > 1],
      [f.phone, f.phone.value.replace(/\D/g, '').length >= 7],
      [f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())]
    ];
    checks.forEach(function (c) { c[0].classList.toggle('is-invalid', !c[1]); if (!c[1]) ok = false; });
    $('#bk-err3').hidden = ok;
    if (!ok) { checks.filter(function (c) { return !c[1]; })[0][0].focus(); return; }

    fill('name', f.name.value.trim().split(' ')[0]);
    fill('email', f.email.value.trim());

    // Resumen y total aproximado
    var lines = [], total = state.service.price || 0;
    lines.push(state.service.name);
    $$('input[name=extra]:checked', form3).forEach(function (c) { total += Number(c.value); lines.push(c.getAttribute('data-name') + ': $' + c.value); });
    var sides = $$('input[name=side]:checked', form3);
    if (sides.length) {
      var free = Math.floor(sides.length / 3);
      var sidesCost = (sides.length - free) * 5;
      total += sidesCost;
      lines.push('Sides (' + sides.map(function (c) { return c.getAttribute('data-name'); }).join(', ') + '): $' + sidesCost + (free ? ' — ' + free + ' free!' : ''));
    }
    var spa = $('input[name=spa]', form3);
    if (spa.checked) { total += 20; lines.push('Spa Day Package: $20'); }
    if (f.pickup.value) lines.push('Pick up & Drop off: ' + f.pickup.value + (f.address.value.trim() ? ' — ' + f.address.value.trim() : ''));

    var html = '<ul>' + lines.map(function (l) { return '<li>' + escapeHtml(l) + '</li>'; }).join('') + '</ul>';
    html += state.service.price
      ? '<p class="total">Estimated total: $' + total + '</p><small>Final price will be confirmed in the consultation.</small>'
      : '<p class="total">Price to be confirmed in the consultation.</p>';
    $('[data-bk-summary]', modal).innerHTML = html;
    showStep(4);
  });
  function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
})();
