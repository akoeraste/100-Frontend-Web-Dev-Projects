document.addEventListener('DOMContentLoaded', function () {
  var quoteText = document.getElementById('quoteText');
  var quoteAuthor = document.getElementById('quoteAuthor');
  var genBtn = document.getElementById('genBtn');
  var copyBtn = document.getElementById('copyBtn');
  var twitterBtn = document.getElementById('twitterBtn');
  var toast = document.getElementById('toast');

  var quotes = [
    {text:"The only way to do great work is to love what you do.",author:"Steve Jobs"},
    {text:"Innovation distinguishes between a leader and a follower.",author:"Steve Jobs"},
    {text:"Stay hungry, stay foolish.",author:"Steve Jobs"},
    {text:"Life is what happens when you're busy making other plans.",author:"John Lennon"},
    {text:"The future belongs to those who believe in the beauty of their dreams.",author:"Eleanor Roosevelt"},
    {text:"It is during our darkest moments that we must focus to see the light.",author:"Aristotle"},
    {text:"The only impossible journey is the one you never begin.",author:"Tony Robbins"},
    {text:"Success is not final, failure is not fatal: it is the courage to continue that counts.",author:"Winston Churchill"},
    {text:"Believe you can and you're halfway there.",author:"Theodore Roosevelt"},
    {text:"In the middle of every difficulty lies opportunity.",author:"Albert Einstein"},
    {text:"What you get by achieving your goals is not as important as what you become by achieving your goals.",author:"Zig Ziglar"},
    {text:"The best time to plant a tree was 20 years ago. The second best time is now.",author:"Chinese Proverb"},
    {text:"Your limitation — it's only your imagination.",author:"Unknown"},
    {text:"Push yourself, because no one else is going to do it for you.",author:"Unknown"},
    {text:"Great things never come from comfort zones.",author:"Unknown"},
    {text:"Dream it. Wish it. Do it.",author:"Unknown"},
    {text:"Don't stop when you're tired. Stop when you're done.",author:"Unknown"},
    {text:"Wake up with determination. Go to bed with satisfaction.",author:"Unknown"},
    {text:"Do something today that your future self will thank you for.",author:"Unknown"},
    {text:"It's not whether you get knocked down, it's whether you get up.",author:"Vince Lombardi"},
    {text:"The mind is everything. What you think you become.",author:"Buddha"},
    {text:"Strive not to be a success, but rather to be of value.",author:"Albert Einstein"},
    {text:"Two roads diverged in a wood, and I took the one less traveled by, and that has made all the difference.",author:"Robert Frost"},
    {text:"The only person you are destined to become is the person you decide to be.",author:"Ralph Waldo Emerson"},
    {text:"Everything you've ever wanted is on the other side of fear.",author:"George Addair"},
    {text:"Happiness is not something ready made. It comes from your own actions.",author:"Dalai Lama"},
    {text:"If you want to lift yourself up, lift up someone else.",author:"Booker T. Washington"},
    {text:"Whatever you are, be a good one.",author:"Abraham Lincoln"},
    {text:"The secret of getting ahead is getting started.",author:"Mark Twain"},
    {text:"Don't watch the clock; do what it does. Keep going.",author:"Sam Levenson"}
  ];

  var lastIndex = -1;

  function generate() {
    var idx;
    do { idx = Math.floor(Math.random() * quotes.length); } while (idx === lastIndex && quotes.length > 1);
    lastIndex = idx;

    quoteText.classList.add('fade');
    quoteAuthor.classList.add('fade');

    setTimeout(function () {
      quoteText.textContent = quotes[idx].text;
      quoteAuthor.textContent = '— ' + quotes[idx].author;
      quoteText.classList.remove('fade');
      quoteAuthor.classList.remove('fade');

      var encoded = encodeURIComponent('"' + quotes[idx].text + '" — ' + quotes[idx].author);
      twitterBtn.href = 'https://twitter.com/intent/tweet?text=' + encoded;
    }, 300);
  }

  genBtn.addEventListener('click', generate);

  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); generate(); }
  });

  copyBtn.addEventListener('click', function () {
    var text = '"' + quoteText.textContent + '" — ' + quoteAuthor.textContent.replace('— ', '');
    navigator.clipboard.writeText(text).then(function () {
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 1800);
    });
  });
});
