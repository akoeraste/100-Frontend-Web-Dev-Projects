document.addEventListener('DOMContentLoaded', function () {
  var board = document.getElementById('board');
  var movesEl = document.getElementById('moves');
  var timerEl = document.getElementById('timer');
  var pairsEl = document.getElementById('pairs');
  var difficultyEl = document.getElementById('difficulty');
  var restartBtn = document.getElementById('restartBtn');
  var overlay = document.getElementById('overlay');
  var playAgainBtn = document.getElementById('playAgainBtn');
  var winMovesEl = document.getElementById('winMoves');
  var winTimeEl = document.getElementById('winTime');
  var winStarsEl = document.getElementById('winStars');
  var winMessageEl = document.getElementById('winMessage');

  var icons = [
    'fa-dragon', 'fa-ghost', 'fa-hat-wizard', 'fa-meteor',
    'fa-fire', 'fa-snowflake', 'fa-bolt', 'fa-feather',
    'fa-gem', 'fa-heart', 'fa-crown', 'fa-star'
  ];

  var difficulties = {
    easy:   { cols: 4, pairs: 6 },
    medium: { cols: 4, pairs: 8 },
    hard:   { cols: 6, pairs: 12 }
  };

  var moves, matchedPairs, totalPairs, firstCard, secondCard, lockBoard, timerInterval, seconds;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(function () {
      seconds++;
      timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function getStars() {
    var ratio = moves / totalPairs;
    if (ratio <= 2) return 3;
    if (ratio <= 3) return 2;
    return 1;
  }

  function showWin() {
    stopTimer();
    var stars = getStars();
    winMovesEl.textContent = moves;
    winTimeEl.textContent = formatTime(seconds);
    winStarsEl.textContent = '⭐'.repeat(stars);

    var messages = [
      'Perfect memory! You crushed it!',
      'Great job! You matched all the pairs!',
      'Well done! Try to beat your time next round!'
    ];
    winMessageEl.textContent = messages[3 - stars];

    setTimeout(function () {
      overlay.classList.add('active');
    }, 600);
  }

  function checkMatch() {
    var isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

    if (isMatch) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedPairs++;
      pairsEl.textContent = matchedPairs + ' / ' + totalPairs;
      firstCard = null;
      secondCard = null;
      lockBoard = false;

      if (matchedPairs === totalPairs) {
        showWin();
      }
    } else {
      setTimeout(function () {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 800);
    }
  }

  function handleCardClick(e) {
    var container = e.currentTarget;
    var card = container.querySelector('.card');

    if (lockBoard || card === firstCard || card.classList.contains('flipped')) return;

    startTimer();
    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;
    moves++;
    movesEl.textContent = moves;

    checkMatch();
  }

  function initGame() {
    stopTimer();
    overlay.classList.remove('active');

    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    var diff = difficulties[difficultyEl.value];
    totalPairs = diff.pairs;

    movesEl.textContent = '0';
    timerEl.textContent = '0:00';
    pairsEl.textContent = '0 / ' + totalPairs;

    var selectedIcons = shuffle(icons.slice()).slice(0, totalPairs);
    var cardIcons = shuffle(selectedIcons.concat(selectedIcons));

    board.innerHTML = '';
    board.setAttribute('data-cols', diff.cols);

    cardIcons.forEach(function (icon, i) {
      var container = document.createElement('div');
      container.className = 'card-container';
      container.style.animationDelay = (i * 0.04) + 's';

      var card = document.createElement('div');
      card.className = 'card';
      card.dataset.icon = icon;

      var back = document.createElement('div');
      back.className = 'card-back';
      back.innerHTML = '<i class="fa-solid fa-question"></i>';

      var front = document.createElement('div');
      front.className = 'card-front';
      front.innerHTML = '<i class="fa-solid ' + icon + '"></i>';

      card.appendChild(back);
      card.appendChild(front);
      container.appendChild(card);
      board.appendChild(container);

      container.addEventListener('click', handleCardClick);
    });
  }

  restartBtn.addEventListener('click', initGame);
  playAgainBtn.addEventListener('click', initGame);
  difficultyEl.addEventListener('change', initGame);

  initGame();
});
