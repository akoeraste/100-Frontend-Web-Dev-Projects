document.addEventListener('DOMContentLoaded', function () {

  // ===== ELEMENTS =====
  var colorInput = document.getElementById('colorInput');
  var hexInput = document.getElementById('hexInput');
  var rInput = document.getElementById('rInput');
  var gInput = document.getElementById('gInput');
  var bInput = document.getElementById('bInput');
  var hInput = document.getElementById('hInput');
  var sInput = document.getElementById('sInput');
  var lInput = document.getElementById('lInput');
  var rSlider = document.getElementById('rSlider');
  var gSlider = document.getElementById('gSlider');
  var bSlider = document.getElementById('bSlider');
  var rVal = document.getElementById('rVal');
  var gVal = document.getElementById('gVal');
  var bVal = document.getElementById('bVal');
  var previewCard = document.getElementById('previewCard');
  var previewText = document.getElementById('previewText');
  var contrastBadge = document.getElementById('contrastBadge');
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');

  var currentR = 99, currentG = 102, currentB = 241;

  // ===== COLOR CONVERSIONS =====
  function rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    var r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function contrastRatio(r, g, b) {
    var lum = luminance(r, g, b);
    var white = 1;
    var black = 0;
    var ratioWhite = (white + 0.05) / (lum + 0.05);
    var ratioBlack = (lum + 0.05) / (black + 0.05);
    return Math.max(ratioWhite, ratioBlack);
  }

  // ===== UPDATE ALL =====
  function updateFromRgb(r, g, b, source) {
    currentR = r; currentG = g; currentB = b;

    var hex = rgbToHex(r, g, b);
    var hsl = rgbToHsl(r, g, b);

    if (source !== 'hex') hexInput.value = hex;
    if (source !== 'native') colorInput.value = '#' + hex;
    if (source !== 'rgb') {
      rInput.value = r;
      gInput.value = g;
      bInput.value = b;
    }
    if (source !== 'hsl') {
      hInput.value = hsl.h;
      sInput.value = hsl.s;
      lInput.value = hsl.l;
    }
    if (source !== 'slider') {
      rSlider.value = r;
      gSlider.value = g;
      bSlider.value = b;
    }

    rVal.textContent = r;
    gVal.textContent = g;
    bVal.textContent = b;

    // preview
    var color = '#' + hex;
    previewCard.style.background = color;

    // text contrast
    var lum = luminance(r, g, b);
    var textColor = lum > 0.35 ? '#000000' : '#ffffff';
    previewCard.style.color = textColor;

    // contrast badge
    var ratio = contrastRatio(r, g, b);
    if (ratio >= 7) {
      contrastBadge.textContent = 'AAA';
      contrastBadge.className = 'contrast-badge';
    } else if (ratio >= 4.5) {
      contrastBadge.textContent = 'AA';
      contrastBadge.className = 'contrast-badge';
    } else {
      contrastBadge.textContent = 'Fail';
      contrastBadge.className = 'contrast-badge fail';
    }
  }

  // ===== EVENT LISTENERS =====

  // native color picker
  colorInput.addEventListener('input', function () {
    var rgb = hexToRgb(this.value);
    updateFromRgb(rgb.r, rgb.g, rgb.b, 'native');
  });

  // hex input
  hexInput.addEventListener('input', function () {
    var val = this.value.replace(/[^0-9a-fA-F]/g, '');
    this.value = val;
    if (val.length === 6 || val.length === 3) {
      var rgb = hexToRgb(val);
      updateFromRgb(rgb.r, rgb.g, rgb.b, 'hex');
    }
  });

  // rgb inputs
  [rInput, gInput, bInput].forEach(function (input) {
    input.addEventListener('input', function () {
      var r = clampInt(rInput.value, 0, 255);
      var g = clampInt(gInput.value, 0, 255);
      var b = clampInt(bInput.value, 0, 255);
      updateFromRgb(r, g, b, 'rgb');
    });
  });

  // hsl inputs
  [hInput, sInput, lInput].forEach(function (input) {
    input.addEventListener('input', function () {
      var h = clampInt(hInput.value, 0, 360);
      var s = clampInt(sInput.value, 0, 100);
      var l = clampInt(lInput.value, 0, 100);
      var rgb = hslToRgb(h, s, l);
      updateFromRgb(rgb.r, rgb.g, rgb.b, 'hsl');
    });
  });

  // sliders
  [rSlider, gSlider, bSlider].forEach(function (slider) {
    slider.addEventListener('input', function () {
      var r = parseInt(rSlider.value);
      var g = parseInt(gSlider.value);
      var b = parseInt(bSlider.value);
      updateFromRgb(r, g, b, 'slider');
    });
  });

  function clampInt(val, min, max) {
    var n = parseInt(val) || 0;
    return Math.min(Math.max(n, min), max);
  }

  // ===== COPY BUTTONS =====
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.getAttribute('data-target');
      var text = '';
      if (target === 'hex') text = '#' + hexInput.value;
      if (target === 'rgb') text = 'rgb(' + currentR + ', ' + currentG + ', ' + currentB + ')';
      if (target === 'hsl') text = 'hsl(' + hInput.value + ', ' + sInput.value + '%, ' + lInput.value + '%)';

      navigator.clipboard.writeText(text).then(function () {
        showToast('Copied: ' + text);
        btn.classList.add('copied');
        btn.querySelector('i').className = 'fa-solid fa-check';
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.querySelector('i').className = 'fa-regular fa-copy';
        }, 1500);
      });
    });
  });

  // ===== RANDOM COLOR =====
  document.getElementById('randomBtn').addEventListener('click', function () {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    updateFromRgb(r, g, b, 'random');
  });

  // ===== PALETTE =====
  var paletteGrid = document.getElementById('paletteGrid');
  var addSwatch = document.getElementById('addSwatch');
  var paletteHint = document.getElementById('paletteHint');
  var palette = JSON.parse(localStorage.getItem('colorPalette') || '[]');

  function renderPalette() {
    var existing = paletteGrid.querySelectorAll('.saved-swatch');
    existing.forEach(function (el) { el.remove(); });

    palette.forEach(function (color, index) {
      var swatch = document.createElement('div');
      swatch.className = 'saved-swatch';
      swatch.style.background = color;
      swatch.title = color;

      var del = document.createElement('span');
      del.className = 'swatch-delete';
      del.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      del.addEventListener('click', function (e) {
        e.stopPropagation();
        palette.splice(index, 1);
        savePalette();
        renderPalette();
      });

      swatch.appendChild(del);

      swatch.addEventListener('click', function () {
        var rgb = hexToRgb(color);
        updateFromRgb(rgb.r, rgb.g, rgb.b, 'palette');
        showToast('Loaded: ' + color);
      });

      paletteGrid.insertBefore(swatch, addSwatch);
    });

    paletteHint.style.display = palette.length > 0 ? 'none' : 'block';
  }

  function savePalette() {
    localStorage.setItem('colorPalette', JSON.stringify(palette));
  }

  addSwatch.addEventListener('click', function () {
    var hex = '#' + rgbToHex(currentR, currentG, currentB);
    if (palette.indexOf(hex) === -1) {
      palette.push(hex);
      savePalette();
      renderPalette();
      showToast('Saved: ' + hex);
    } else {
      showToast('Already in palette');
    }
  });

  document.getElementById('clearPalette').addEventListener('click', function () {
    palette = [];
    savePalette();
    renderPalette();
  });

  renderPalette();

  // ===== TOAST =====
  var toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2000);
  }

  // ===== INIT =====
  updateFromRgb(currentR, currentG, currentB, 'init');
});
