document.addEventListener('DOMContentLoaded', function () {

  var body = document.getElementById('body');
  var colorCode = document.getElementById('colorCode');
  var copyBtn = document.getElementById('copyBtn');
  var generateBtn = document.getElementById('generateBtn');
  var directionRow = document.getElementById('directionRow');
  var historyGrid = document.getElementById('historyGrid');
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');

  var currentMode = 'solid';
  var currentDirection = 'to right';
  var currentValue = '#1a1a2e';
  var history = [];
  var maxHistory = 20;

  // ===== MODE SELECTOR =====
  var modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      modeBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-mode');
      directionRow.classList.toggle('visible', currentMode === 'gradient');
    });
  });

  // ===== DIRECTION SELECTOR =====
  var dirBtns = document.querySelectorAll('.dir-btn');
  dirBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      dirBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentDirection = btn.getAttribute('data-dir');
    });
  });

  // ===== GENERATE =====
  generateBtn.addEventListener('click', generate);

  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.target === document.body) {
      e.preventDefault();
      generate();
    }
  });

  function generate() {
    var bg, display;

    if (currentMode === 'solid') {
      var color = randomColor();
      bg = color;
      display = color;
    } else if (currentMode === 'gradient') {
      var c1 = randomColor();
      var c2 = randomColor();
      if (currentDirection === 'radial') {
        bg = 'radial-gradient(circle, ' + c1 + ', ' + c2 + ')';
      } else {
        bg = 'linear-gradient(' + currentDirection + ', ' + c1 + ', ' + c2 + ')';
      }
      display = c1 + ' → ' + c2;
    } else {
      var c1 = randomColor();
      var c2 = randomColor();
      var c3 = randomColor();
      var c4 = randomColor();
      bg = buildMesh(c1, c2, c3, c4);
      display = c1 + ' / ' + c2 + ' / ' + c3 + ' / ' + c4;
    }

    body.style.background = bg;
    currentValue = display;
    colorCode.textContent = display;

    updateTextContrast(bg);
    addToHistory(bg, display);

    // button bounce
    generateBtn.style.transform = 'scale(0.95)';
    setTimeout(function () {
      generateBtn.style.transform = '';
    }, 150);
  }

  function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function buildMesh(c1, c2, c3, c4) {
    return 'linear-gradient(135deg, ' + c1 + ' 0%, transparent 50%),' +
           'linear-gradient(225deg, ' + c2 + ' 0%, transparent 50%),' +
           'linear-gradient(315deg, ' + c3 + ' 0%, transparent 50%),' +
           'linear-gradient(45deg, ' + c4 + ' 0%, transparent 50%)';
  }

  // ===== TEXT CONTRAST =====
  function updateTextContrast(bg) {
    // extract first hex color from the bg string
    var match = bg.match(/#[0-9A-Fa-f]{6}/);
    if (!match) {
      body.classList.remove('light-bg');
      return;
    }
    var hex = match[0];
    var r = parseInt(hex.substr(1, 2), 16);
    var g = parseInt(hex.substr(3, 2), 16);
    var b = parseInt(hex.substr(5, 2), 16);
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    body.classList.toggle('light-bg', luminance > 0.6);
  }

  // ===== HISTORY =====
  function addToHistory(bg, display) {
    history.unshift({ bg: bg, display: display });
    if (history.length > maxHistory) history.pop();
    renderHistory();
  }

  function renderHistory() {
    historyGrid.innerHTML = '';

    if (history.length === 0) {
      historyGrid.innerHTML = '<span class="history-empty">No history yet.</span>';
      return;
    }

    history.forEach(function (item) {
      var swatch = document.createElement('div');
      swatch.className = 'history-swatch';
      swatch.style.background = item.bg;
      swatch.title = item.display;

      var tip = document.createElement('span');
      tip.className = 'swatch-tooltip';
      tip.textContent = item.display.length > 20 ? item.display.substring(0, 18) + '…' : item.display;
      swatch.appendChild(tip);

      swatch.addEventListener('click', function () {
        body.style.background = item.bg;
        currentValue = item.display;
        colorCode.textContent = item.display;
        updateTextContrast(item.bg);
        showToast('Applied');
      });

      historyGrid.appendChild(swatch);
    });
  }

  document.getElementById('clearHistory').addEventListener('click', function () {
    history = [];
    renderHistory();
  });

  renderHistory();

  // ===== COPY =====
  copyBtn.addEventListener('click', function () {
    navigator.clipboard.writeText(currentValue).then(function () {
      showToast('Copied: ' + currentValue);
      copyBtn.classList.add('copied');
      copyBtn.querySelector('i').className = 'fa-solid fa-check';
      setTimeout(function () {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('i').className = 'fa-regular fa-copy';
      }, 1500);
    });
  });

  // ===== TOAST =====
  var toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 1800);
  }
});
