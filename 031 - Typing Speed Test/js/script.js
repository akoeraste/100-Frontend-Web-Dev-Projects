document.addEventListener('DOMContentLoaded', function () {
  var textDisplay = document.getElementById('textDisplay');
  var typeInput = document.getElementById('typeInput');
  var wpmEl = document.getElementById('wpm');
  var accuracyEl = document.getElementById('accuracy');
  var timerEl = document.getElementById('timer');
  var charsEl = document.getElementById('chars');
  var restartBtn = document.getElementById('restartBtn');
  var overlay = document.getElementById('overlay');
  var retryBtn = document.getElementById('retryBtn');
  var rWpm = document.getElementById('rWpm');
  var rAcc = document.getElementById('rAcc');
  var rChars = document.getElementById('rChars');
  var rWords = document.getElementById('rWords');
  var resultMsg = document.getElementById('resultMsg');

  var paragraphs = [
    "The quick brown fox jumps over the lazy dog near the riverbank while the sun sets behind the distant mountains casting golden light across the valley.",
    "Programming is the art of telling a computer what to do through carefully crafted instructions that transform abstract ideas into working software applications.",
    "Every morning she walked along the beach collecting seashells and watching the waves crash against the shore before heading back to her cozy little cottage.",
    "Technology has changed the way we communicate learn and work making it possible to connect with people around the world in just a matter of seconds.",
    "The old library on the corner of the street held thousands of books each one containing a different world waiting to be explored by curious readers.",
    "Learning to code is like learning a new language it takes time patience and practice but once you understand the basics everything starts to make sense.",
    "The garden was filled with colorful flowers that attracted butterflies and bees creating a beautiful scene that brought joy to everyone who passed by.",
    "Music has the power to change our mood and bring back memories from the past making it one of the most universal forms of human expression and art.",
    "Scientists believe that exploring space could lead to discovering new resources and understanding more about the origins of our universe and the nature of life.",
    "Cooking is both a science and an art requiring precise measurements and creative thinking to turn simple ingredients into delicious meals that bring people together."
  ];

  var currentText = '';
  var timeLeft = 60;
  var timerInterval = null;
  var started = false;
  var totalTyped = 0;
  var correctTyped = 0;

  function pickText() {
    currentText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
  }

  function renderText() {
    var typed = typeInput.value;
    var html = '';

    for (var i = 0; i < currentText.length; i++) {
      var cls = 'pending';
      if (i < typed.length) {
        cls = typed[i] === currentText[i] ? 'correct' : 'incorrect';
      } else if (i === typed.length) {
        cls = 'current';
      }
      var ch = currentText[i] === ' ' && cls === 'incorrect' ? '&middot;' : currentText[i];
      html += '<span class="char ' + cls + '">' + ch + '</span>';
    }

    textDisplay.innerHTML = html;
  }

  function updateStats() {
    var typed = typeInput.value;
    var correct = 0;
    for (var i = 0; i < typed.length; i++) {
      if (typed[i] === currentText[i]) correct++;
    }

    totalTyped = typed.length;
    correctTyped = correct;

    var elapsed = 60 - timeLeft;
    var minutes = elapsed / 60;
    var wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
    var acc = totalTyped > 0 ? Math.round((correct / totalTyped) * 100) : 100;

    wpmEl.textContent = wpm;
    accuracyEl.textContent = acc + '%';
    charsEl.textContent = totalTyped;
  }

  function startTimer() {
    started = true;
    timerInterval = setInterval(function () {
      timeLeft--;
      timerEl.textContent = timeLeft;
      updateStats();
      if (timeLeft <= 0) {
        endTest();
      }
    }, 1000);
  }

  function endTest() {
    clearInterval(timerInterval);
    typeInput.disabled = true;

    var elapsed = 60;
    var minutes = elapsed / 60;
    var wpm = minutes > 0 ? Math.round((correctTyped / 5) / minutes) : 0;
    var acc = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
    var words = typeInput.value.trim().split(/\s+/).filter(function (w) { return w.length > 0; }).length;

    rWpm.textContent = wpm;
    rAcc.textContent = acc + '%';
    rChars.textContent = totalTyped;
    rWords.textContent = words;

    if (wpm >= 60) {
      resultMsg.textContent = 'Blazing fast! You\'re a typing pro.';
    } else if (wpm >= 40) {
      resultMsg.textContent = 'Great speed! Above average typing.';
    } else if (wpm >= 20) {
      resultMsg.textContent = 'Solid effort! Keep practicing to improve.';
    } else {
      resultMsg.textContent = 'Keep going! Practice makes perfect.';
    }

    overlay.classList.add('active');
  }

  function reset() {
    clearInterval(timerInterval);
    started = false;
    timeLeft = 60;
    totalTyped = 0;
    correctTyped = 0;
    timerEl.textContent = '60';
    wpmEl.textContent = '0';
    accuracyEl.textContent = '100%';
    charsEl.textContent = '0';
    typeInput.value = '';
    typeInput.disabled = false;
    overlay.classList.remove('active');
    pickText();
    renderText();
    typeInput.focus();
  }

  typeInput.addEventListener('input', function () {
    if (!started) startTimer();
    renderText();
    updateStats();

    if (typeInput.value.length >= currentText.length) {
      endTest();
    }
  });

  restartBtn.addEventListener('click', reset);
  retryBtn.addEventListener('click', reset);

  pickText();
  renderText();
});
