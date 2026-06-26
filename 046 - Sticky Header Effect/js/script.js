document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('header');
  var threshold = 60;

  function onScroll() {
    if (window.scrollY > threshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
