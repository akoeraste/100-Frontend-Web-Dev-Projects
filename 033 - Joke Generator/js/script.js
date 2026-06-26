document.addEventListener('DOMContentLoaded', function () {
  var jokeText = document.getElementById('jokeText');
  var jokePunchline = document.getElementById('jokePunchline');
  var revealBtn = document.getElementById('revealBtn');
  var generateBtn = document.getElementById('generateBtn');
  var catBtns = document.querySelectorAll('.cat-btn');

  var selectedCategory = 'Any';

  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      catBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedCategory = btn.dataset.cat;
    });
  });

  function fetchJoke() {
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
    jokePunchline.classList.add('hidden');
    revealBtn.classList.add('hidden');

    var url = 'https://v2.jokeapi.dev/joke/' + selectedCategory + '?safe-mode';

    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) {
          jokeText.textContent = 'Could not fetch a joke. Try a different category.';
          return;
        }

        if (data.type === 'twopart') {
          jokeText.textContent = data.setup;
          jokePunchline.textContent = data.delivery;
          revealBtn.classList.remove('hidden');
        } else {
          jokeText.textContent = data.joke;
        }
      })
      .catch(function () {
        jokeText.textContent = 'Failed to fetch joke. Check your connection.';
      })
      .finally(function () {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Get Joke';
      });
  }

  revealBtn.addEventListener('click', function () {
    jokePunchline.classList.remove('hidden');
    revealBtn.classList.add('hidden');
  });

  generateBtn.addEventListener('click', fetchJoke);
});
