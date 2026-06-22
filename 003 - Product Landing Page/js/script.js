document.addEventListener('DOMContentLoaded', function () {

  // ===== NAVBAR SCROLL =====
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ===== MOBILE NAV =====
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== COLOR PICKER =====
  var swatches = document.querySelectorAll('.color-swatch');
  var colorName = document.getElementById('colorName');

  swatches.forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      swatches.forEach(function (s) { s.classList.remove('active'); });
      swatch.classList.add('active');
      colorName.textContent = swatch.getAttribute('data-color');
    });
  });

  // ===== SCROLL REVEAL =====
  var reveals = document.querySelectorAll('.reveal');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var siblings = Array.from(entry.target.parentElement.children).filter(function (el) {
          return el.classList.contains('reveal');
        });
        var idx = siblings.indexOf(entry.target);
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) { observer.observe(el); });

  // ===== PERFORMANCE RINGS =====
  var perfRings = document.querySelectorAll('.perf-ring');

  // inject SVG gradient definition once
  var svgNS = 'http://www.w3.org/2000/svg';
  perfRings.forEach(function (ring) {
    var svg = ring.querySelector('svg');
    var defs = document.createElementNS(svgNS, 'defs');
    var grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'perfGrad');
    grad.setAttribute('x1', '0%');
    grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%');
    grad.setAttribute('y2', '100%');
    var stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#4a7cff');
    var stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#8b6cff');
    grad.appendChild(stop1);
    grad.appendChild(stop2);
    defs.appendChild(grad);
    svg.insertBefore(defs, svg.firstChild);
  });

  var ringObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var percent = parseInt(entry.target.getAttribute('data-percent'), 10);
        var circumference = 2 * Math.PI * 42;
        var offset = circumference - (percent / 100) * circumference;
        var fill = entry.target.querySelector('.ring-fill');
        fill.style.strokeDashoffset = offset;
        ringObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  perfRings.forEach(function (ring) { ringObserver.observe(ring); });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
