document.addEventListener('DOMContentLoaded', function () {
  var albumArt = document.getElementById('albumArt');
  var trackTitle = document.getElementById('trackTitle');
  var trackArtist = document.getElementById('trackArtist');
  var currentTimeEl = document.getElementById('currentTime');
  var durationEl = document.getElementById('duration');
  var progressTrack = document.getElementById('progressTrack');
  var progressFill = document.getElementById('progressFill');
  var playBtn = document.getElementById('playBtn');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var volumeEl = document.getElementById('volume');
  var playlistEl = document.getElementById('playlist');

  var audioCtx = null;
  var currentSource = null;
  var currentGain = null;
  var isPlaying = false;
  var currentIdx = -1;
  var playStartTime = 0;
  var pauseOffset = 0;
  var rafId = null;

  var tracks = [
    { title: 'Ambient Wave', artist: 'Synth Lab', freq: 220, type: 'sine', duration: 15 },
    { title: 'Deep Pulse', artist: 'Bass Collective', freq: 110, type: 'sawtooth', duration: 12 },
    { title: 'Crystal Tone', artist: 'Chime Works', freq: 440, type: 'triangle', duration: 10 },
    { title: 'Digital Hum', artist: 'Byte Studio', freq: 330, type: 'square', duration: 14 },
    { title: 'Ocean Drift', artist: 'Wave Theory', freq: 196, type: 'sine', duration: 18 },
    { title: 'Neon Glow', artist: 'Electric Dreams', freq: 262, type: 'triangle', duration: 13 }
  ];

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function renderPlaylist() {
    playlistEl.innerHTML = '';
    tracks.forEach(function (t, i) {
      var item = document.createElement('div');
      item.className = 'pl-item' + (i === currentIdx ? ' active' : '');
      item.innerHTML =
        '<span class="pl-num">' + (i + 1) + '</span>' +
        '<div class="pl-info"><div class="pl-title">' + t.title + '</div>' +
        '<div class="pl-artist">' + t.artist + '</div></div>' +
        '<span class="pl-dur">' + formatTime(t.duration) + '</span>';
      item.addEventListener('click', function () { loadTrack(i); play(); });
      playlistEl.appendChild(item);
    });
  }

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function stopCurrent() {
    if (currentSource) {
      try { currentSource.stop(); } catch (e) {}
      currentSource = null;
    }
    cancelAnimationFrame(rafId);
    isPlaying = false;
    albumArt.classList.remove('spinning');
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }

  function loadTrack(idx) {
    stopCurrent();
    currentIdx = idx;
    pauseOffset = 0;
    var t = tracks[idx];
    trackTitle.textContent = t.title;
    trackArtist.textContent = t.artist;
    durationEl.textContent = formatTime(t.duration);
    currentTimeEl.textContent = '0:00';
    progressFill.style.width = '0%';
    renderPlaylist();
  }

  function play() {
    if (currentIdx < 0) loadTrack(0);
    var t = tracks[currentIdx];
    var ctx = getCtx();

    if (isPlaying) {
      pauseOffset += ctx.currentTime - playStartTime;
      stopCurrent();
      return;
    }

    var remaining = t.duration - pauseOffset;
    if (remaining <= 0) { pauseOffset = 0; remaining = t.duration; }

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = t.type;
    osc.frequency.setValueAtTime(t.freq, ctx.currentTime);
    gain.gain.setValueAtTime((volumeEl.value / 100) * 0.15, ctx.currentTime);
    gain.gain.setValueAtTime((volumeEl.value / 100) * 0.15, ctx.currentTime + remaining - 0.5);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + remaining);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + remaining);

    currentSource = osc;
    currentGain = gain;
    playStartTime = ctx.currentTime;
    isPlaying = true;
    albumArt.classList.add('spinning');
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';

    osc.onended = function () {
      if (isPlaying) {
        pauseOffset = 0;
        isPlaying = false;
        albumArt.classList.remove('spinning');
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        progressFill.style.width = '100%';
        if (currentIdx < tracks.length - 1) {
          loadTrack(currentIdx + 1);
          play();
        }
      }
    };

    function tick() {
      if (!isPlaying) return;
      var elapsed = pauseOffset + (audioCtx.currentTime - playStartTime);
      var pct = Math.min(100, (elapsed / t.duration) * 100);
      progressFill.style.width = pct + '%';
      currentTimeEl.textContent = formatTime(Math.min(elapsed, t.duration));
      rafId = requestAnimationFrame(tick);
    }
    tick();
  }

  playBtn.addEventListener('click', play);
  prevBtn.addEventListener('click', function () {
    var idx = currentIdx <= 0 ? tracks.length - 1 : currentIdx - 1;
    loadTrack(idx);
    play();
  });
  nextBtn.addEventListener('click', function () {
    var idx = currentIdx >= tracks.length - 1 ? 0 : currentIdx + 1;
    loadTrack(idx);
    play();
  });

  volumeEl.addEventListener('input', function () {
    if (currentGain && audioCtx) {
      currentGain.gain.setValueAtTime((volumeEl.value / 100) * 0.15, audioCtx.currentTime);
    }
  });

  progressTrack.addEventListener('click', function (e) {
    if (currentIdx < 0) return;
    var rect = progressTrack.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    var t = tracks[currentIdx];
    pauseOffset = pct * t.duration;
    if (isPlaying) {
      stopCurrent();
      play();
    } else {
      progressFill.style.width = (pct * 100) + '%';
      currentTimeEl.textContent = formatTime(pauseOffset);
    }
  });

  renderPlaylist();
});
