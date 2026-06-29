document.addEventListener('DOMContentLoaded', function () {
  var micBtn = document.getElementById('micBtn');
  var micIcon = document.getElementById('micIcon');
  var micStatus = document.getElementById('micStatus');
  var outputText = document.getElementById('outputText');
  var copyBtn = document.getElementById('copyBtn');
  var clearBtn = document.getElementById('clearBtn');
  var wordCount = document.getElementById('wordCount');
  var charCount = document.getElementById('charCount');
  var langSelect = document.getElementById('langSelect');
  var errorMsg = document.getElementById('errorMsg');

  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    errorMsg.classList.remove('hidden');
    micBtn.disabled = true;
    micBtn.style.opacity = '0.3';
    return;
  }

  var recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = langSelect.value;

  var finalTranscript = '';
  var listening = false;

  function updateCounts() {
    var text = finalTranscript.trim();
    var words = text ? text.split(/\s+/).length : 0;
    wordCount.textContent = words + ' word' + (words !== 1 ? 's' : '');
    charCount.textContent = text.length + ' character' + (text.length !== 1 ? 's' : '');
  }

  function renderText(interim) {
    if (!finalTranscript && !interim) {
      outputText.innerHTML = '<span class="placeholder-text">Your speech will appear here...</span>';
    } else {
      outputText.innerHTML = finalTranscript + (interim ? '<span class="interim">' + interim + '</span>' : '');
    }
    updateCounts();
  }

  recognition.onresult = function (e) {
    var interim = '';
    for (var i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        finalTranscript += e.results[i][0].transcript;
      } else {
        interim += e.results[i][0].transcript;
      }
    }
    renderText(interim);
  };

  recognition.onend = function () {
    if (listening) {
      recognition.start();
    }
  };

  recognition.onerror = function (e) {
    if (e.error === 'not-allowed') {
      micStatus.textContent = 'Microphone access denied';
      stopListening();
    }
  };

  function startListening() {
    recognition.lang = langSelect.value;
    recognition.start();
    listening = true;
    micBtn.classList.add('listening');
    micIcon.className = 'fa-solid fa-stop';
    micStatus.textContent = 'Listening...';
    micStatus.classList.add('active');
  }

  function stopListening() {
    listening = false;
    recognition.stop();
    micBtn.classList.remove('listening');
    micIcon.className = 'fa-solid fa-microphone';
    micStatus.textContent = 'Click to start listening';
    micStatus.classList.remove('active');
  }

  micBtn.addEventListener('click', function () {
    if (listening) stopListening();
    else startListening();
  });

  langSelect.addEventListener('change', function () {
    if (listening) {
      recognition.stop();
      recognition.lang = langSelect.value;
    }
  });

  copyBtn.addEventListener('click', function () {
    if (!finalTranscript) return;
    navigator.clipboard.writeText(finalTranscript).then(function () {
      copyBtn.classList.add('copied');
      setTimeout(function () { copyBtn.classList.remove('copied'); }, 1500);
    });
  });

  clearBtn.addEventListener('click', function () {
    finalTranscript = '';
    renderText('');
  });

  renderText('');
});
