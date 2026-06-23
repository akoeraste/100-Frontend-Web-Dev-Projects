document.addEventListener('DOMContentLoaded', function () {
  var yourScoreEl = document.getElementById('yourScore');
  var cpuScoreEl = document.getElementById('cpuScore');
  var yourPickEl = document.getElementById('yourPick');
  var cpuPickEl = document.getElementById('cpuPick');
  var resultBadge = document.getElementById('resultBadge');
  var choices = ['rock', 'paper', 'scissors'];
  var emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
  var yourScore = 0, cpuScore = 0;

  document.querySelectorAll('.choice-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { play(btn.getAttribute('data-choice')); });
  });

  document.getElementById('resetBtn').addEventListener('click', function () {
    yourScore = 0; cpuScore = 0;
    yourScoreEl.textContent = '0'; cpuScoreEl.textContent = '0';
    yourPickEl.innerHTML = '<i class="fa-solid fa-question"></i>';
    cpuPickEl.innerHTML = '<i class="fa-solid fa-question"></i>';
    yourPickEl.className = 'pick-circle'; cpuPickEl.className = 'pick-circle';
    resultBadge.textContent = 'Choose your move'; resultBadge.className = 'result-badge';
  });

  function play(yours) {
    var cpu = choices[Math.floor(Math.random() * 3)];
    yourPickEl.textContent = emojis[yours];
    cpuPickEl.textContent = emojis[cpu];
    yourPickEl.className = 'pick-circle'; cpuPickEl.className = 'pick-circle';
    resultBadge.className = 'result-badge';

    if (yours === cpu) {
      resultBadge.textContent = "It's a Draw!";
      resultBadge.classList.add('draw');
      yourPickEl.classList.add('draw'); cpuPickEl.classList.add('draw');
    } else if ((yours === 'rock' && cpu === 'scissors') || (yours === 'paper' && cpu === 'rock') || (yours === 'scissors' && cpu === 'paper')) {
      yourScore++;
      yourScoreEl.textContent = yourScore;
      resultBadge.textContent = 'You Win!';
      resultBadge.classList.add('win');
      yourPickEl.classList.add('win'); cpuPickEl.classList.add('lose');
    } else {
      cpuScore++;
      cpuScoreEl.textContent = cpuScore;
      resultBadge.textContent = 'You Lose!';
      resultBadge.classList.add('lose');
      yourPickEl.classList.add('lose'); cpuPickEl.classList.add('win');
    }
  }
});
