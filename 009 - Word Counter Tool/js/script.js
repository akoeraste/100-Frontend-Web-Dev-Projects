document.addEventListener('DOMContentLoaded', function () {
  var textArea = document.getElementById('textArea');
  var wordsEl = document.getElementById('words');
  var charsEl = document.getElementById('chars');
  var sentencesEl = document.getElementById('sentences');
  var paragraphsEl = document.getElementById('paragraphs');
  var readTimeEl = document.getElementById('readTime');
  var speakTimeEl = document.getElementById('speakTime');
  var densityList = document.getElementById('densityList');
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');

  var stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','is','it','this','that','was','are','be','has','had','have','with','as','by','from','not','no','so','if','do','does','did','will','can','may','just','than','then','also','very','too','its','my','your','our','i','you','he','she','we','they','me','him','her','us','them','all','each','every','any','some','much','many','more','most','other','into','over','such','up','out','about','which','when','what','where','who','how','been','being','would','could','should','their','there','here','these','those','am','were','own','between','after','before','because','through','during','both','few','only','same','while','get','got','let','make','go','come','take','know','think','see','want','give','use','find','say','tell','ask','work','seem','feel','try','leave','call']);

  textArea.addEventListener('input', update);

  function update() {
    var text = textArea.value;
    var trimmed = text.trim();

    var chars = text.length;
    var wordList = trimmed.length === 0 ? [] : trimmed.split(/\s+/);
    var words = wordList.length;
    var sents = trimmed.length === 0 ? 0 : (trimmed.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0);
    var paras = trimmed.length === 0 ? 0 : trimmed.split(/\n\s*\n/).filter(function(p){return p.trim().length > 0}).length;
    if (paras === 0 && words > 0) paras = 1;
    var readMin = Math.ceil(words / 200);
    var speakMin = Math.ceil(words / 130);

    wordsEl.textContent = words;
    charsEl.textContent = chars;
    sentencesEl.textContent = sents;
    paragraphsEl.textContent = paras;
    readTimeEl.textContent = readMin;
    speakTimeEl.textContent = speakMin;

    updateDensity(wordList);
  }

  function updateDensity(wordList) {
    if (wordList.length === 0) {
      densityList.innerHTML = '<p class="empty-msg">Start typing to see keyword density.</p>';
      return;
    }
    var freq = {};
    wordList.forEach(function (w) {
      var lower = w.toLowerCase().replace(/[^a-z0-9'-]/g, '');
      if (lower.length < 2 || stopWords.has(lower)) return;
      freq[lower] = (freq[lower] || 0) + 1;
    });

    var sorted = Object.entries(freq).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);
    if (sorted.length === 0) {
      densityList.innerHTML = '<p class="empty-msg">No significant keywords yet.</p>';
      return;
    }
    var max = sorted[0][1];
    densityList.innerHTML = '';
    sorted.forEach(function (entry) {
      var row = document.createElement('div');
      row.className = 'keyword-row';
      row.innerHTML = '<span class="kw-word">' + entry[0] + '</span>' +
        '<div class="kw-bar"><div class="kw-fill" style="width:' + Math.round((entry[1]/max)*100) + '%"></div></div>' +
        '<span class="kw-count">' + entry[1] + '</span>';
      densityList.appendChild(row);
    });
  }

  document.getElementById('copyBtn').addEventListener('click', function () {
    if (textArea.value.length === 0) return;
    navigator.clipboard.writeText(textArea.value).then(function () { showToast('Copied to clipboard!'); });
  });

  document.getElementById('clearBtn').addEventListener('click', function () {
    textArea.value = '';
    update();
    textArea.focus();
  });

  var toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
});
