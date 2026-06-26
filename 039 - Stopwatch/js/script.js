document.addEventListener('DOMContentLoaded', function () {
  var hoursEl = document.getElementById('hours');
  var minutesEl = document.getElementById('minutes');
  var secondsEl = document.getElementById('seconds');
  var msEl = document.getElementById('milliseconds');
  var startBtn = document.getElementById('startBtn');
  var lapBtn = document.getElementById('lapBtn');
  var resetBtn = document.getElementById('resetBtn');
  var lapsCard = document.getElementById('lapsCard');
  var lapsList = document.getElementById('lapsList');
  var clearLapsBtn = document.getElementById('clearLapsBtn');

  var running = false;
  var elapsed = 0;
  var startTime = 0;
  var rafId = null;
  var laps = [];
  var lastLapTime = 0;

  function pad(n, d) {
    var s = '' + Math.floor(n);
    while (s.length < (d || 2)) s = '0' + s;
    return s;
  }

  function formatTime(ms) {
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    var centis = Math.floor((ms % 1000) / 10);
    return { h: pad(h), m: pad(m), s: pad(s), ms: pad(centis) };
  }

  function formatStr(ms) {
    var t = formatTime(ms);
    return t.h + ':' + t.m + ':' + t.s + '.' + t.ms;
  }

  function updateDisplay() {
    var t = formatTime(elapsed);
    hoursEl.textContent = t.h;
    minutesEl.textContent = t.m;
    secondsEl.textContent = t.s;
    msEl.textContent = t.ms;
  }

  function tick() {
    elapsed = Date.now() - startTime;
    updateDisplay();
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    running = true;
    startTime = Date.now() - elapsed;
    startBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    startBtn.classList.add('running');
    lapBtn.disabled = false;
    resetBtn.disabled = false;
    tick();
  }

  function pause() {
    running = false;
    cancelAnimationFrame(rafId);
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    startBtn.classList.remove('running');
  }

  function reset() {
    pause();
    elapsed = 0;
    lastLapTime = 0;
    updateDisplay();
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    laps = [];
    renderLaps();
  }

  function addLap() {
    var split = elapsed - lastLapTime;
    lastLapTime = elapsed;
    laps.push({ split: split, total: elapsed });
    renderLaps();
  }

  function renderLaps() {
    if (laps.length === 0) {
      lapsCard.classList.add('hidden');
      return;
    }
    lapsCard.classList.remove('hidden');

    var splits = laps.map(function (l) { return l.split; });
    var best = Math.min.apply(null, splits);
    var worst = Math.max.apply(null, splits);

    lapsList.innerHTML = '';
    for (var i = laps.length - 1; i >= 0; i--) {
      var row = document.createElement('div');
      row.className = 'lap-row';
      if (laps.length > 1) {
        if (laps[i].split === best) row.classList.add('best');
        else if (laps[i].split === worst) row.classList.add('worst');
      }
      row.innerHTML =
        '<span class="lap-num">Lap ' + (i + 1) + '</span>' +
        '<span class="lap-split">' + formatStr(laps[i].split) + '</span>' +
        '<span class="lap-total">' + formatStr(laps[i].total) + '</span>';
      lapsList.appendChild(row);
    }
  }

  startBtn.addEventListener('click', function () {
    if (running) pause();
    else start();
  });

  lapBtn.addEventListener('click', addLap);
  resetBtn.addEventListener('click', reset);
  clearLapsBtn.addEventListener('click', function () {
    laps = [];
    lastLapTime = elapsed;
    renderLaps();
  });

  updateDisplay();
});
