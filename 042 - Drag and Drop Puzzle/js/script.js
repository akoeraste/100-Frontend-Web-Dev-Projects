document.addEventListener('DOMContentLoaded', function () {
  var board = document.getElementById('board');
  var gridSizeEl = document.getElementById('gridSize');
  var restartBtn = document.getElementById('restartBtn');
  var movesEl = document.getElementById('moves');
  var timerEl = document.getElementById('timer');
  var placedEl = document.getElementById('placed');
  var overlay = document.getElementById('overlay');
  var playAgainBtn = document.getElementById('playAgainBtn');
  var wMoves = document.getElementById('wMoves');
  var wTime = document.getElementById('wTime');

  var tiles = [];
  var moves = 0;
  var startTime = null;
  var timerInterval = null;
  var dragIdx = null;

  function initGame() {
    clearInterval(timerInterval);
    startTime = null;
    moves = 0;
    movesEl.textContent = '0';
    timerEl.textContent = '0:00';
    overlay.classList.remove('active');

    var size = parseInt(gridSizeEl.value, 10);
    var total = size * size;
    board.dataset.size = size;

    tiles = [];
    for (var i = 1; i <= total; i++) tiles.push(i);
    shuffle(tiles);

    renderBoard();
    updateCorrect();
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
  }

  function renderBoard() {
    board.innerHTML = '';
    tiles.forEach(function (num, idx) {
      var tile = document.createElement('div');
      tile.className = 'tile';
      tile.textContent = num;
      tile.draggable = true;
      tile.dataset.idx = idx;

      tile.addEventListener('dragstart', function (e) {
        dragIdx = idx;
        tile.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      tile.addEventListener('dragend', function () {
        tile.classList.remove('dragging');
      });
      tile.addEventListener('dragover', function (e) {
        e.preventDefault();
        tile.classList.add('over');
      });
      tile.addEventListener('dragleave', function () {
        tile.classList.remove('over');
      });
      tile.addEventListener('drop', function (e) {
        e.preventDefault();
        tile.classList.remove('over');
        if (dragIdx === null || dragIdx === idx) return;
        swapTiles(dragIdx, idx);
        dragIdx = null;
      });

      board.appendChild(tile);
    });
  }

  function swapTiles(a, b) {
    if (!startTime) startTimer();
    var t = tiles[a]; tiles[a] = tiles[b]; tiles[b] = t;
    moves++;
    movesEl.textContent = moves;
    renderBoard();
    updateCorrect();
    checkWin();
  }

  function updateCorrect() {
    var correct = 0;
    var tileEls = board.querySelectorAll('.tile');
    tiles.forEach(function (num, idx) {
      if (num === idx + 1) {
        correct++;
        tileEls[idx].classList.add('correct');
      }
    });
    var size = parseInt(gridSizeEl.value, 10);
    placedEl.textContent = correct + '/' + (size * size);
  }

  function checkWin() {
    for (var i = 0; i < tiles.length; i++) {
      if (tiles[i] !== i + 1) return;
    }
    clearInterval(timerInterval);
    wMoves.textContent = moves;
    wTime.textContent = timerEl.textContent;
    overlay.classList.add('active');
  }

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function () {
      var s = Math.floor((Date.now() - startTime) / 1000);
      var m = Math.floor(s / 60);
      timerEl.textContent = m + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
    }, 1000);
  }

  restartBtn.addEventListener('click', initGame);
  gridSizeEl.addEventListener('change', initGame);
  playAgainBtn.addEventListener('click', initGame);

  initGame();
});
