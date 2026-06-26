document.addEventListener('DOMContentLoaded', function () {
  var startScreen = document.getElementById('startScreen');
  var quizScreen = document.getElementById('quizScreen');
  var resultScreen = document.getElementById('resultScreen');

  var categoryEl = document.getElementById('category');
  var difficultyEl = document.getElementById('difficulty');
  var startBtn = document.getElementById('startBtn');

  var progressFill = document.getElementById('progressFill');
  var qCounter = document.getElementById('qCounter');
  var qTimer = document.getElementById('qTimer');
  var questionText = document.getElementById('questionText');
  var optionsEl = document.getElementById('options');
  var nextBtn = document.getElementById('nextBtn');
  var scoreBadge = document.getElementById('scoreBadge');

  var resultIcon = document.getElementById('resultIcon');
  var resultTitle = document.getElementById('resultTitle');
  var resultMsg = document.getElementById('resultMsg');
  var resultScore = document.getElementById('resultScore');
  var correctCount = document.getElementById('correctCount');
  var wrongCount = document.getElementById('wrongCount');
  var skippedCount = document.getElementById('skippedCount');
  var retryBtn = document.getElementById('retryBtn');

  var questions = [];
  var currentIndex = 0;
  var score = 0;
  var wrong = 0;
  var skipped = 0;
  var timerInterval = null;
  var timeLeft = 15;

  function showScreen(screen) {
    startScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    screen.classList.remove('hidden');
  }

  function decodeHTML(str) {
    var txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function fetchQuestions() {
    var url = 'https://opentdb.com/api.php?amount=10&type=multiple';
    var cat = categoryEl.value;
    var diff = difficultyEl.value;
    if (cat) url += '&category=' + cat;
    if (diff) url += '&difficulty=' + diff;

    startBtn.disabled = true;
    startBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.response_code !== 0 || !data.results.length) {
          alert('No questions available for this selection. Try different settings.');
          startBtn.disabled = false;
          startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Quiz';
          return;
        }

        questions = data.results.map(function (q) {
          var answers = shuffle(
            q.incorrect_answers.map(function (a) { return decodeHTML(a); })
              .concat([decodeHTML(q.correct_answer)])
          );
          return {
            question: decodeHTML(q.question),
            correct: decodeHTML(q.correct_answer),
            answers: answers
          };
        });

        currentIndex = 0;
        score = 0;
        wrong = 0;
        skipped = 0;
        scoreBadge.textContent = 'Score: 0';
        showScreen(quizScreen);
        loadQuestion();
      })
      .catch(function () {
        alert('Failed to load questions. Check your internet connection.');
        startBtn.disabled = false;
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Quiz';
      });
  }

  function startCountdown() {
    timeLeft = 15;
    qTimer.textContent = '15';
    qTimer.classList.remove('urgent');

    timerInterval = setInterval(function () {
      timeLeft--;
      qTimer.innerHTML = '<i class="fa-solid fa-clock"></i> ' + timeLeft;
      if (timeLeft <= 5) qTimer.classList.add('urgent');
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        skipped++;
        revealAnswer(null);
      }
    }, 1000);
  }

  function loadQuestion() {
    var q = questions[currentIndex];
    var total = questions.length;

    progressFill.style.width = ((currentIndex / total) * 100) + '%';
    qCounter.textContent = 'Question ' + (currentIndex + 1) + ' / ' + total;
    questionText.textContent = q.question;
    nextBtn.classList.add('hidden');

    var letters = ['A', 'B', 'C', 'D'];
    optionsEl.innerHTML = '';

    q.answers.forEach(function (answer, i) {
      var btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = '<span class="letter">' + letters[i] + '</span><span>' + answer + '</span>';
      btn.addEventListener('click', function () {
        clearInterval(timerInterval);
        if (answer === q.correct) {
          score++;
          scoreBadge.textContent = 'Score: ' + score;
        } else {
          wrong++;
        }
        revealAnswer(answer);
      });
      optionsEl.appendChild(btn);
    });

    startCountdown();
  }

  function revealAnswer(selected) {
    var q = questions[currentIndex];
    var buttons = optionsEl.querySelectorAll('.option-btn');

    buttons.forEach(function (btn) {
      btn.classList.add('disabled');
      var text = btn.querySelector('span:last-child').textContent;
      if (text === q.correct) btn.classList.add('correct');
      if (text === selected && selected !== q.correct) btn.classList.add('wrong');
    });

    nextBtn.classList.remove('hidden');
    if (currentIndex >= questions.length - 1) {
      nextBtn.innerHTML = 'See Results <i class="fa-solid fa-flag-checkered"></i>';
    }
  }

  function showResults() {
    var total = questions.length;
    var pct = Math.round((score / total) * 100);

    resultScore.textContent = pct + '%';
    correctCount.textContent = score;
    wrongCount.textContent = wrong;
    skippedCount.textContent = skipped;

    if (pct >= 80) {
      resultIcon.className = 'result-icon gold';
      resultTitle.textContent = 'Excellent!';
      resultMsg.textContent = 'You answered ' + score + ' out of ' + total + ' correctly. Outstanding!';
    } else if (pct >= 50) {
      resultIcon.className = 'result-icon silver';
      resultTitle.textContent = 'Good Job!';
      resultMsg.textContent = 'You answered ' + score + ' out of ' + total + ' correctly. Keep it up!';
    } else {
      resultIcon.className = 'result-icon bronze';
      resultTitle.textContent = 'Keep Practicing!';
      resultMsg.textContent = 'You answered ' + score + ' out of ' + total + ' correctly. Try again!';
    }

    showScreen(resultScreen);
  }

  nextBtn.addEventListener('click', function () {
    currentIndex++;
    if (currentIndex >= questions.length) {
      showResults();
    } else {
      loadQuestion();
    }
  });

  startBtn.addEventListener('click', fetchQuestions);

  retryBtn.addEventListener('click', function () {
    startBtn.disabled = false;
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Quiz';
    showScreen(startScreen);
  });
});
