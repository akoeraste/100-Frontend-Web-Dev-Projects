document.addEventListener('DOMContentLoaded', function () {
  var html = document.documentElement;
  var themeBtn = document.getElementById('themeBtn');
  var saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', function () {
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});
