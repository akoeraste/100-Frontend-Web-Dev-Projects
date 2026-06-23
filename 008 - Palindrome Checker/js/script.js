document.addEventListener('DOMContentLoaded', function () {

  var textInput = document.getElementById('textInput');
  var checkBtn = document.getElementById('checkBtn');
  var clearBtn = document.getElementById('clearBtn');
  var charCount = document.getElementById('charCount');
  var resultCard = document.getElementById('resultCard');
  var resultIcon = document.getElementById('resultIcon');
  var resultTitle = document.getElementById('resultTitle');
  var resultSub = document.getElementById('resultSub');
  var breakdown = document.getElementById('breakdown');
  var reversedRow = document.getElementById('reversedRow');
  var reversedText = document.getElementById('reversedText');

  var totalChecked = 0;
  var totalPalin = 0;
  var totalNot = 0;

  // ===== CHECK =====
  function check() {
    var raw = textInput.value.trim();
    if (raw.length === 0) return;

    var cleaned = raw.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (cleaned.length === 0) return;

    var reversed = cleaned.split('').reverse().join('');
    var isPalin = cleaned === reversed;

    // update stats
    totalChecked++;
    if (isPalin) totalPalin++;
    else totalNot++;
    updateStats();

    // result card state
    resultCard.classList.remove('is-palin', 'not-palin');
    resultCard.classList.add(isPalin ? 'is-palin' : 'not-palin');

    // icon
    resultIcon.innerHTML = isPalin
      ? '<i class="fa-solid fa-circle-check"></i>'
      : '<i class="fa-solid fa-circle-xmark"></i>';

    // title & sub
    if (isPalin) {
      resultTitle.textContent = 'Yes, it\'s a palindrome!';
      resultSub.textContent = '"' + raw + '" reads the same forwards and backwards.';
    } else {
      resultTitle.textContent = 'Not a palindrome';
      resultSub.textContent = '"' + raw + '" does not read the same backwards.';
    }

    // letter breakdown
    buildBreakdown(cleaned, isPalin);

    // reversed
    reversedText.textContent = reversed;
    reversedRow.classList.add('visible');
  }

  // ===== LETTER BREAKDOWN =====
  function buildBreakdown(cleaned, isPalin) {
    breakdown.innerHTML = '';
    var len = cleaned.length;

    for (var i = 0; i < len; i++) {
      var box = document.createElement('span');
      box.className = 'letter-box';
      box.textContent = cleaned[i];
      box.style.animationDelay = (i * 0.04) + 's';

      var mirror = len - 1 - i;

      if (isPalin) {
        if (i === mirror) {
          box.classList.add('center');
        } else {
          box.classList.add('match');
        }
      } else {
        if (cleaned[i] === cleaned[mirror]) {
          box.classList.add('match');
        } else {
          box.classList.add('no-match');
        }
      }

      breakdown.appendChild(box);
    }
  }

  // ===== STATS =====
  function updateStats() {
    document.getElementById('totalChecked').textContent = totalChecked;
    document.getElementById('totalPalin').textContent = totalPalin;
    document.getElementById('totalNot').textContent = totalNot;
  }

  // ===== EVENTS =====
  checkBtn.addEventListener('click', check);

  textInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') check();
  });

  textInput.addEventListener('input', function () {
    var len = this.value.length;
    charCount.textContent = len + (len === 1 ? ' character' : ' characters');
  });

  clearBtn.addEventListener('click', function () {
    textInput.value = '';
    charCount.textContent = '0 characters';
    resultCard.classList.remove('is-palin', 'not-palin');
    resultIcon.innerHTML = '<i class="fa-solid fa-circle-question"></i>';
    resultTitle.textContent = 'Enter something above';
    resultSub.textContent = 'We\'ll check it for you.';
    breakdown.innerHTML = '';
    reversedRow.classList.remove('visible');
    textInput.focus();
  });

  // ===== EXAMPLE BUTTONS =====
  document.querySelectorAll('.example-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      textInput.value = btn.getAttribute('data-text');
      charCount.textContent = textInput.value.length + ' characters';
      check();
    });
  });
});
