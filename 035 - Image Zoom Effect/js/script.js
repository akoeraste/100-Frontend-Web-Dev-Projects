document.addEventListener('DOMContentLoaded', function () {
  var gallery = document.getElementById('gallery');
  var items = document.querySelectorAll('.gallery-item');
  var zoomSelect = document.getElementById('zoomLevel');
  var lightbox = document.getElementById('lightbox');
  var lbImage = document.getElementById('lbImage');
  var lbClose = document.getElementById('lbClose');

  function getZoom() {
    return parseInt(zoomSelect.value, 10);
  }

  items.forEach(function (item) {
    var img = item.querySelector('img');
    var lens = item.querySelector('.zoom-lens');
    var result = item.querySelector('.zoom-result');
    var hiRes = item.dataset.img;

    item.addEventListener('mouseenter', function () {
      item.classList.add('zooming');
      result.style.backgroundImage = 'url(' + hiRes + ')';
    });

    item.addEventListener('mouseleave', function () {
      item.classList.remove('zooming');
    });

    item.addEventListener('mousemove', function (e) {
      var rect = item.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      var lensW = lens.offsetWidth / 2;
      var lensH = lens.offsetHeight / 2;

      var lx = Math.max(lensW, Math.min(x, rect.width - lensW));
      var ly = Math.max(lensH, Math.min(y, rect.height - lensH));

      lens.style.left = (lx - lensW) + 'px';
      lens.style.top = (ly - lensH) + 'px';

      var zoom = getZoom();
      var bgW = rect.width * zoom;
      var bgH = rect.height * zoom;

      var bgX = -(lx * zoom - result.offsetWidth / 2);
      var bgY = -(ly * zoom - result.offsetHeight / 2);

      result.style.backgroundSize = bgW + 'px ' + bgH + 'px';
      result.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
    });

    item.addEventListener('click', function () {
      item.classList.remove('zooming');
      lbImage.src = hiRes;
      lightbox.classList.add('active');
    });
  });

  lbClose.addEventListener('click', function () {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
});
