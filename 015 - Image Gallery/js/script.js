document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('.gallery-item');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCaption = document.getElementById('lbCaption');
  var visibleItems = [];
  var currentIdx = 0;

  // ===== FILTER =====
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      items.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      updateVisible();
    });
  });

  function updateVisible() {
    visibleItems = [];
    items.forEach(function (item) {
      if (!item.classList.contains('hidden')) visibleItems.push(item);
    });
  }
  updateVisible();

  // ===== LIGHTBOX =====
  items.forEach(function (item) {
    item.addEventListener('click', function () {
      var idx = visibleItems.indexOf(item);
      if (idx === -1) return;
      openLightbox(idx);
    });
  });

  function openLightbox(idx) {
    currentIdx = idx;
    var item = visibleItems[idx];
    var img = item.querySelector('img');
    var caption = item.querySelector('.item-overlay span').textContent;
    lbImg.src = img.src.replace('w=600', 'w=1200').replace('h=400', 'h=800');
    lbCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIdx += dir;
    if (currentIdx < 0) currentIdx = visibleItems.length - 1;
    if (currentIdx >= visibleItems.length) currentIdx = 0;
    var item = visibleItems[currentIdx];
    var img = item.querySelector('img');
    var caption = item.querySelector('.item-overlay span').textContent;
    lbImg.src = img.src.replace('w=600', 'w=1200').replace('h=400', 'h=800');
    lbCaption.textContent = caption;
  }

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', function () { navigate(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { navigate(1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
});
