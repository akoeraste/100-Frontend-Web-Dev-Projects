document.addEventListener('DOMContentLoaded', function () {

  // ===== GOLD PARTICLES =====
  var particlesContainer = document.getElementById('particles');
  var particleCount = 30;

  for (var i = 0; i < particleCount; i++) {
    var particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = 60 + Math.random() * 40 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = 6 + Math.random() * 6 + 's';
    particle.style.width = 2 + Math.random() * 3 + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }

  // ===== SCROLL REVEAL =====
  var reveals = document.querySelectorAll('.reveal');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var siblings = Array.from(entry.target.parentElement.children).filter(function (el) {
          return el.classList.contains('reveal');
        });
        var staggerIndex = siblings.indexOf(entry.target);
        var delay = staggerIndex * 120;

        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) {
    observer.observe(el);
  });

  // ===== COUNTER ANIMATION =====
  var counters = document.querySelectorAll('[data-target]');

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var duration = target > 10000 ? 2500 : 1800;
        var startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 4);
          var current = Math.floor(eased * target);

          if (target >= 1000000) {
            el.textContent = Math.floor(current / 1000000) + 'M';
          } else {
            el.textContent = current;
          }

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target >= 1000000 ? '1M' : target;
          }
        }

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) {
    counterObserver.observe(el);
  });

  // ===== TRACK BARS =====
  var trackFills = document.querySelectorAll('.track-fill');

  var trackObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('animated');
        }, 200);
        trackObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  trackFills.forEach(function (el) {
    trackObserver.observe(el);
  });

  // ===== SMOOTH SCROLL FOR CTA =====
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
