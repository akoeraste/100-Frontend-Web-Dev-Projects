document.addEventListener('DOMContentLoaded', function () {
  var previewCard = document.getElementById('previewCard');
  var cssCode = document.getElementById('cssCode');
  var copyBtn = document.getElementById('copyBtn');
  var directionEl = document.getElementById('direction');
  var colorCountEl = document.getElementById('colorCount');
  var colorStopsEl = document.getElementById('colorStops');
  var randomBtn = document.getElementById('randomBtn');
  var savedSection = document.getElementById('savedSection');
  var savedGrid = document.getElementById('savedGrid');

  var saved = JSON.parse(localStorage.getItem('savedGradients') || '[]');

  function randomHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  function getColors() {
    var inputs = colorStopsEl.querySelectorAll('.stop-color');
    var colors = [];
    inputs.forEach(function (inp) { colors.push(inp.value); });
    return colors;
  }

  function buildCSS(colors, direction) {
    if (direction === 'circle') {
      return 'background: radial-gradient(circle, ' + colors.join(', ') + ');';
    }
    return 'background: linear-gradient(' + direction + ', ' + colors.join(', ') + ');';
  }

  function buildInline(colors, direction) {
    if (direction === 'circle') {
      return 'radial-gradient(circle, ' + colors.join(', ') + ')';
    }
    return 'linear-gradient(' + direction + ', ' + colors.join(', ') + ')';
  }

  function updatePreview() {
    var colors = getColors();
    var direction = directionEl.value;
    var css = buildCSS(colors, direction);
    var inline = buildInline(colors, direction);

    previewCard.style.background = inline;
    cssCode.textContent = css;
  }

  function syncColorInputs() {
    var count = parseInt(colorCountEl.value, 10);
    var current = colorStopsEl.querySelectorAll('.stop-color');
    var currentColors = [];
    current.forEach(function (inp) { currentColors.push(inp.value); });

    colorStopsEl.innerHTML = '';
    for (var i = 0; i < count; i++) {
      var div = document.createElement('div');
      div.className = 'color-stop';
      var inp = document.createElement('input');
      inp.type = 'color';
      inp.className = 'stop-color';
      inp.value = currentColors[i] || randomHex();
      inp.addEventListener('input', updatePreview);
      div.appendChild(inp);
      colorStopsEl.appendChild(div);
    }
    updatePreview();
  }

  function randomize() {
    var count = parseInt(colorCountEl.value, 10);
    var inputs = colorStopsEl.querySelectorAll('.stop-color');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = randomHex();
    }
    updatePreview();
  }

  function saveGradient() {
    var colors = getColors();
    var direction = directionEl.value;
    saved.push({ colors: colors, direction: direction });
    localStorage.setItem('savedGradients', JSON.stringify(saved));
    renderSaved();
  }

  function renderSaved() {
    savedSection.classList.toggle('hidden', saved.length === 0);
    savedGrid.innerHTML = '';
    saved.forEach(function (g, idx) {
      var swatch = document.createElement('div');
      swatch.className = 'saved-swatch';
      swatch.style.background = buildInline(g.colors, g.direction);
      swatch.title = 'Click to load';

      var del = document.createElement('button');
      del.className = 'swatch-del';
      del.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      del.addEventListener('click', function (e) {
        e.stopPropagation();
        saved.splice(idx, 1);
        localStorage.setItem('savedGradients', JSON.stringify(saved));
        renderSaved();
      });

      swatch.appendChild(del);
      swatch.addEventListener('click', function () {
        colorCountEl.value = '' + g.colors.length;
        syncColorInputs();
        var inputs = colorStopsEl.querySelectorAll('.stop-color');
        g.colors.forEach(function (c, i) {
          if (inputs[i]) inputs[i].value = c;
        });
        directionEl.value = g.direction;
        updatePreview();
      });

      savedGrid.appendChild(swatch);
    });
  }

  colorCountEl.addEventListener('change', syncColorInputs);
  directionEl.addEventListener('change', updatePreview);
  randomBtn.addEventListener('click', randomize);
  copyBtn.addEventListener('click', function () {
    navigator.clipboard.writeText(cssCode.textContent).then(function () {
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      copyBtn.classList.add('copied');
      setTimeout(function () {
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
        copyBtn.classList.remove('copied');
      }, 1500);
    });
  });

  previewCard.addEventListener('dblclick', saveGradient);

  var inputs = colorStopsEl.querySelectorAll('.stop-color');
  inputs.forEach(function (inp) { inp.addEventListener('input', updatePreview); });

  renderSaved();
  updatePreview();
});
