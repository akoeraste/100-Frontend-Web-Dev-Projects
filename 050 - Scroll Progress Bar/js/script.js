document.addEventListener('DOMContentLoaded', function () {
  var progressBar = document.getElementById('progressBar');
  var pctBadge = document.getElementById('pctBadge');

  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    pct = Math.min(100, Math.max(0, pct));

    progressBar.style.width = pct + '%';
    pctBadge.textContent = Math.round(pct) + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});
