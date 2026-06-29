document.addEventListener('DOMContentLoaded', function () {
  var textInput = document.getElementById('textInput');
  var voiceSelect = document.getElementById('voiceSelect');
  var rateSlider = document.getElementById('rate');
  var pitchSlider = document.getElementById('pitch');
  var volumeSlider = document.getElementById('volume');
  var rateVal = document.getElementById('rateVal');
  var pitchVal = document.getElementById('pitchVal');
  var volumeVal = document.getElementById('volumeVal');
  var speakBtn = document.getElementById('speakBtn');
  var pauseBtn = document.getElementById('pauseBtn');
  var stopBtn = document.getElementById('stopBtn');
  var statusDot = document.getElementById('statusDot');
  var statusText = document.getElementById('statusText');

  var synth = window.speechSynthesis;
  var voices = [];

  function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach(function (v, i) {
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = v.name + ' (' + v.lang + ')';
      if (v.default) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
  }

  loadVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }

  rateSlider.addEventListener('input', function () { rateVal.textContent = rateSlider.value; });
  pitchSlider.addEventListener('input', function () { pitchVal.textContent = pitchSlider.value; });
  volumeSlider.addEventListener('input', function () { volumeVal.textContent = volumeSlider.value; });

  function setStatus(state) {
    statusDot.className = 'status-indicator' + (state === 'speaking' ? ' speaking' : state === 'paused' ? ' paused' : '');
    statusText.textContent = state === 'speaking' ? 'Speaking...' : state === 'paused' ? 'Paused' : 'Ready';
    pauseBtn.disabled = state === 'ready';
    stopBtn.disabled = state === 'ready';
  }

  speakBtn.addEventListener('click', function () {
    var text = textInput.value.trim();
    if (!text) return;

    synth.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    var voiceIdx = parseInt(voiceSelect.value, 10);
    if (voices[voiceIdx]) utterance.voice = voices[voiceIdx];
    utterance.rate = parseFloat(rateSlider.value);
    utterance.pitch = parseFloat(pitchSlider.value);
    utterance.volume = parseFloat(volumeSlider.value);

    utterance.onstart = function () { setStatus('speaking'); };
    utterance.onend = function () { setStatus('ready'); };
    utterance.onerror = function () { setStatus('ready'); };
    utterance.onpause = function () { setStatus('paused'); };
    utterance.onresume = function () { setStatus('speaking'); };

    synth.speak(utterance);
  });

  pauseBtn.addEventListener('click', function () {
    if (synth.paused) {
      synth.resume();
      pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    } else {
      synth.pause();
      pauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
    }
  });

  stopBtn.addEventListener('click', function () {
    synth.cancel();
    setStatus('ready');
    pauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
  });
});
