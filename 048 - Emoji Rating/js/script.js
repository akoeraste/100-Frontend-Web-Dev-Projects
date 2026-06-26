document.addEventListener('DOMContentLoaded', function () {
  var cards = document.querySelectorAll('.rating-card');
  var summaryCard = document.getElementById('summaryCard');
  var summaryList = document.getElementById('summaryList');
  var avgEmoji = document.getElementById('avgEmoji');
  var avgScore = document.getElementById('avgScore');
  var resetBtn = document.getElementById('resetBtn');

  var emojis = [
    { face: '😡', label: 'Terrible' },
    { face: '😞', label: 'Bad' },
    { face: '😐', label: 'Okay' },
    { face: '😊', label: 'Good' },
    { face: '🤩', label: 'Amazing' }
  ];

  var ratings = {};

  function buildEmojiButtons() {
    cards.forEach(function (card) {
      var row = card.querySelector('.emoji-row');
      var item = card.dataset.item;
      row.innerHTML = '';

      emojis.forEach(function (e, i) {
        var btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = e.face;
        btn.title = e.label + ' (' + (i + 1) + ')';
        btn.addEventListener('click', function () {
          ratings[item] = i + 1;
          updateCard(card, i);
          updateSummary();
        });
        row.appendChild(btn);
      });
    });
  }

  function updateCard(card, selectedIdx) {
    var btns = card.querySelectorAll('.emoji-btn');
    var valueEl = card.querySelector('.rating-value');
    btns.forEach(function (btn, i) {
      btn.classList.toggle('selected', i === selectedIdx);
      btn.classList.toggle('dimmed', i !== selectedIdx);
    });
    valueEl.textContent = emojis[selectedIdx].face + ' ' + emojis[selectedIdx].label;
  }

  function updateSummary() {
    var keys = Object.keys(ratings);
    if (keys.length === 0) {
      summaryCard.classList.add('hidden');
      return;
    }
    summaryCard.classList.remove('hidden');

    var sum = 0;
    keys.forEach(function (k) { sum += ratings[k]; });
    var avg = sum / keys.length;
    avgScore.textContent = avg.toFixed(1);

    var emojiIdx = Math.min(4, Math.max(0, Math.round(avg) - 1));
    avgEmoji.textContent = emojis[emojiIdx].face;

    summaryList.innerHTML = '';
    cards.forEach(function (card) {
      var item = card.dataset.item;
      if (ratings[item] === undefined) return;
      var row = document.createElement('div');
      row.className = 'sum-row';
      row.innerHTML = '<span>' + item + '</span><span>' + emojis[ratings[item] - 1].face + '</span>';
      summaryList.appendChild(row);
    });
  }

  resetBtn.addEventListener('click', function () {
    ratings = {};
    cards.forEach(function (card) {
      var btns = card.querySelectorAll('.emoji-btn');
      btns.forEach(function (b) { b.classList.remove('selected', 'dimmed'); });
      card.querySelector('.rating-value').textContent = 'Not rated';
    });
    summaryCard.classList.add('hidden');
  });

  buildEmojiButtons();
});
