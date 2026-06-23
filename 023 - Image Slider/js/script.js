document.addEventListener('DOMContentLoaded', function () {
  var slides = document.getElementById('slides');
  var slideEls = document.querySelectorAll('.slide');
  var dotsContainer = document.getElementById('dots');
  var total = slideEls.length;
  var current = 0;
  var autoPlay = true;
  var interval;

  document.getElementById('counterTotal').textContent = total;

  slideEls.forEach(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function () { goTo(i); });
    dotsContainer.appendChild(dot);
  });

  document.getElementById('prevBtn').addEventListener('click', function () { goTo(current - 1); });
  document.getElementById('nextBtn').addEventListener('click', function () { goTo(current + 1); });

  var autoBtn = document.getElementById('autoBtn');
  autoBtn.addEventListener('click', function () {
    autoPlay = !autoPlay;
    autoBtn.querySelector('i').className = autoPlay ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    autoBtn.classList.toggle('playing', autoPlay);
    if (autoPlay) startAuto(); else clearInterval(interval);
  });

  function goTo(idx) {
    if (idx < 0) idx = total - 1;
    if (idx >= total) idx = 0;
    current = idx;
    slides.style.transform = 'translateX(-' + (current * 100) + '%)';
    document.querySelectorAll('.dot').forEach(function (d, i) { d.classList.toggle('active', i === current); });
    document.getElementById('counterCurrent').textContent = current + 1;
    if (autoPlay) { clearInterval(interval); startAuto(); }
  }

  function startAuto() { interval = setInterval(function () { goTo(current + 1); }, 4000); }
  startAuto();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });
});
