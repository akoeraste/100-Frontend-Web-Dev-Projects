document.addEventListener('DOMContentLoaded', function () {
  var qrInput = document.getElementById('qrInput');
  var qrSize = document.getElementById('qrSize');
  var qrColor = document.getElementById('qrColor');
  var qrBg = document.getElementById('qrBg');
  var generateBtn = document.getElementById('generateBtn');
  var qrPlaceholder = document.getElementById('qrPlaceholder');
  var qrResult = document.getElementById('qrResult');
  var qrImage = document.getElementById('qrImage');
  var downloadBtn = document.getElementById('downloadBtn');
  var copyBtn = document.getElementById('copyBtn');

  var currentUrl = '';

  function buildUrl() {
    var text = qrInput.value.trim();
    if (!text) return '';
    var size = qrSize.value;
    var color = qrColor.value.replace('#', '');
    var bg = qrBg.value.replace('#', '');

    return 'https://api.qrserver.com/v1/create-qr-code/?size=' + size + 'x' + size +
      '&data=' + encodeURIComponent(text) +
      '&color=' + color +
      '&bgcolor=' + bg +
      '&format=png';
  }

  function generate() {
    var text = qrInput.value.trim();
    if (!text) {
      qrInput.focus();
      return;
    }

    currentUrl = buildUrl();
    qrImage.src = currentUrl;
    qrPlaceholder.classList.add('hidden');
    qrResult.classList.remove('hidden');
  }

  generateBtn.addEventListener('click', generate);
  qrInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generate();
    }
  });

  downloadBtn.addEventListener('click', function () {
    if (!currentUrl) return;
    var link = document.createElement('a');
    link.href = currentUrl;
    link.download = 'qrcode.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  copyBtn.addEventListener('click', function () {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl).then(function () {
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      copyBtn.classList.add('copied');
      setTimeout(function () {
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy URL';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });
});
