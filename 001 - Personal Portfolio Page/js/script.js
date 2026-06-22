document.addEventListener('DOMContentLoaded', function () {

  // ===== THEME TOGGLE =====
  var themeToggle = document.getElementById('themeToggle');
  var themeIcon = document.getElementById('themeIcon');
  var html = document.documentElement;

  var savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateIcon(savedTheme);

  themeToggle.addEventListener('click', function () {
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // ===== NAVBAR SCROLL EFFECT =====
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== MOBILE NAV TOGGLE =====
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

  // ===== TYPING EFFECT =====
  var tagline = document.getElementById('tagline');
  var phrases = [
    'I build interfaces that feel alive.',
    'Turning ideas into pixel-perfect reality.',
    'Design-driven. Code-powered.',
    'Making the web beautiful, one project at a time.'
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var cursor = document.createElement('span');
  cursor.className = 'cursor';
  tagline.appendChild(cursor);

  function type() {
    var current = phrases[phraseIndex];

    if (isDeleting) {
      tagline.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      tagline.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    tagline.appendChild(cursor);

    var speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();

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
        var duration = 1800;
        var startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.floor(eased * target);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
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

  // ===== SKILL BARS =====
  var skillFills = document.querySelectorAll('.skill-fill');

  var skillObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(function (el) {
    skillObserver.observe(el);
  });

  // ===== CONTACT FORM =====
  var form = document.getElementById('contactForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('.btn');
    var originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    btn.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.25)';

    setTimeout(function () {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.boxShadow = '';
      form.reset();
    }, 2500);
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  var sections = document.querySelectorAll('.section');
  var navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(function (link) {
          link.classList.remove('active');
        });
        var active = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  });
});
