document.addEventListener('DOMContentLoaded', function () {
  var slidesContainer = document.getElementById('slidesContainer');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var slideCaption = document.getElementById('slideCaption');
  var slideCounter = document.getElementById('slideCounter');
  var dotsEl = document.getElementById('dots');
  var thumbsEl = document.getElementById('thumbs');
  var autoToggle = document.getElementById('autoToggle');

  var slides = [
    { img: 'https://picsum.photos/id/1015/800/450', caption: 'River flowing between mountain peaks' },
    { img: 'https://picsum.photos/id/1018/800/450', caption: 'Misty morning at the lake' },
    { img: 'https://picsum.photos/id/1025/800/450', caption: 'Curious pug with a head tilt' },
    { img: 'https://picsum.photos/id/1035/800/450', caption: 'Winding mountain trail path' },
    { img: 'https://picsum.photos/id/1043/800/450', caption: 'Urban street scene at golden hour' },
    { img: 'https://picsum.photos/id/1059/800/450', caption: 'Snow-capped peaks at sunset' }
  ];

  var currentIdx = 0;
  var autoPlay = true;
  var autoInterval = null;

  function buildSlides() {
    slides.forEach(function (s, i) {
      var div = document.createElement('div');
      div.className = 'slide' + (i === 0 ? ' active' : '');
      div.innerHTML = '<img src="' + s.img + '" alt="' + s.caption + '" loading="lazy" />';
      slidesContainer.appendChild(div);

      var dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(dot);

      var thumb = document.createElement('div');
      thumb.className = 'thumb' + (i === 0 ? ' active' : '');
      thumb.innerHTML = '<img src="' + s.img + '" alt="Thumbnail" />';
      thumb.addEventListener('click', function () { goTo(i); });
      thumbsEl.appendChild(thumb);
    });
    updateUI();
  }

  function goTo(idx) {
    var slideEls = slidesContainer.querySelectorAll('.slide');
    var dotEls = dotsEl.querySelectorAll('.dot');
    var thumbEls = thumbsEl.querySelectorAll('.thumb');

    slideEls[currentIdx].classList.remove('active');
    dotEls[currentIdx].classList.remove('active');
    thumbEls[currentIdx].classList.remove('active');

    currentIdx = idx;

    slideEls[currentIdx].classList.add('active');
    dotEls[currentIdx].classList.add('active');
    thumbEls[currentIdx].classList.add('active');

    thumbEls[currentIdx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    updateUI();
    resetAutoPlay();
  }

  function updateUI() {
    slideCaption.textContent = slides[currentIdx].caption;
    slideCounter.textContent = (currentIdx + 1) + ' / ' + slides.length;
  }

  function next() { goTo((currentIdx + 1) % slides.length); }
  function prev() { goTo((currentIdx - 1 + slides.length) % slides.length); }

  function startAutoPlay() {
    if (autoInterval) clearInterval(autoInterval);
    if (autoPlay) autoInterval = setInterval(next, 4000);
  }

  function resetAutoPlay() {
    if (autoPlay) { clearInterval(autoInterval); startAutoPlay(); }
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  autoToggle.addEventListener('click', function () {
    autoPlay = !autoPlay;
    autoToggle.classList.toggle('active', autoPlay);
    if (autoPlay) startAutoPlay();
    else clearInterval(autoInterval);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  buildSlides();
  startAutoPlay();
});
