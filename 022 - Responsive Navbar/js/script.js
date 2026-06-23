document.addEventListener('DOMContentLoaded', function () {
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var links = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        links.forEach(function (l) { l.classList.remove('active'); });
        var active = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function (s) { observer.observe(s); });
});
