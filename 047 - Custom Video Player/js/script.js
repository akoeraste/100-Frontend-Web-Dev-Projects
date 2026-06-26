document.addEventListener('DOMContentLoaded', function () {
  var player = document.getElementById('player');
  var video = document.getElementById('video');
  var bigPlay = document.getElementById('bigPlay');
  var controls = document.getElementById('controls');
  var playPauseBtn = document.getElementById('playPauseBtn');
  var muteBtn = document.getElementById('muteBtn');
  var volSlider = document.getElementById('volSlider');
  var progressBar = document.getElementById('progressBar');
  var progressFill = document.getElementById('progressFill');
  var currentTimeEl = document.getElementById('currentTime');
  var durationEl = document.getElementById('duration');
  var speedSelect = document.getElementById('speedSelect');
  var fullscreenBtn = document.getElementById('fullscreenBtn');

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function togglePlay() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function updatePlayIcon() {
    var icon = video.paused ? 'fa-play' : 'fa-pause';
    playPauseBtn.innerHTML = '<i class="fa-solid ' + icon + '"></i>';
    bigPlay.classList.toggle('hidden', !video.paused);
  }

  video.addEventListener('play', updatePlayIcon);
  video.addEventListener('pause', updatePlayIcon);

  video.addEventListener('loadedmetadata', function () {
    durationEl.textContent = formatTime(video.duration);
  });

  video.addEventListener('timeupdate', function () {
    var pct = (video.currentTime / video.duration) * 100;
    progressFill.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(video.currentTime);
  });

  video.addEventListener('ended', function () {
    updatePlayIcon();
    controls.classList.add('visible');
  });

  video.addEventListener('click', togglePlay);
  bigPlay.addEventListener('click', togglePlay);
  playPauseBtn.addEventListener('click', togglePlay);

  progressBar.addEventListener('click', function (e) {
    var rect = progressBar.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  muteBtn.addEventListener('click', function () {
    video.muted = !video.muted;
    muteBtn.innerHTML = '<i class="fa-solid ' + (video.muted ? 'fa-volume-xmark' : 'fa-volume-high') + '"></i>';
    volSlider.value = video.muted ? 0 : video.volume * 100;
  });

  volSlider.addEventListener('input', function () {
    video.volume = volSlider.value / 100;
    video.muted = video.volume === 0;
    muteBtn.innerHTML = '<i class="fa-solid ' + (video.volume === 0 ? 'fa-volume-xmark' : 'fa-volume-high') + '"></i>';
  });

  speedSelect.addEventListener('change', function () {
    video.playbackRate = parseFloat(speedSelect.value);
  });

  fullscreenBtn.addEventListener('click', function () {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      player.requestFullscreen();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
    if (e.key === 'ArrowRight') video.currentTime = Math.min(video.duration, video.currentTime + 5);
    if (e.key === 'ArrowLeft') video.currentTime = Math.max(0, video.currentTime - 5);
    if (e.key === 'm') { video.muted = !video.muted; muteBtn.innerHTML = '<i class="fa-solid ' + (video.muted ? 'fa-volume-xmark' : 'fa-volume-high') + '"></i>'; }
    if (e.key === 'f') fullscreenBtn.click();
  });
});
