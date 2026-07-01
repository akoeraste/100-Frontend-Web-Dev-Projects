const MODES = {
  focus: { label: 'Focus Time',    minutes: 25, bodyClass: 'mode-focus' },
  short: { label: 'Short Break',   minutes: 5,  bodyClass: 'mode-short' },
  long:  { label: 'Long Break',    minutes: 15, bodyClass: 'mode-long'  },
};

const CIRCUMFERENCE = 2 * Math.PI * 96; // r=96 → 603.19

let currentMode = 'focus';
let totalSeconds = MODES.focus.minutes * 60;
let remaining   = totalSeconds;
let running     = false;
let interval    = null;
let sessions    = 0;

const timeDisplay    = document.getElementById('timeDisplay');
const modeLabel      = document.getElementById('modeLabel');
const ringFill       = document.getElementById('ringFill');
const startBtn       = document.getElementById('startBtn');
const startIcon      = document.getElementById('startIcon');
const startText      = document.getElementById('startText');
const resetBtn       = document.getElementById('resetBtn');
const skipBtn        = document.getElementById('skipBtn');
const modeTabs       = document.getElementById('modeTabs');
const sessionsCount  = document.getElementById('sessionsCount');
const sessionsBadge  = document.getElementById('sessionsBadge');
const toast          = document.getElementById('toast');

ringFill.style.strokeDasharray = CIRCUMFERENCE;

function fmt(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function setRing(fraction) {
  const offset = CIRCUMFERENCE * (1 - fraction);
  ringFill.style.strokeDashoffset = offset;
}

function updateDisplay() {
  timeDisplay.textContent = fmt(remaining);
  document.title = `${fmt(remaining)} — Pomodoro`;
  setRing(remaining / totalSeconds);
}

function setMode(mode) {
  currentMode = mode;
  document.body.className = MODES[mode].bodyClass;
  totalSeconds = MODES[mode].minutes * 60;
  remaining    = totalSeconds;
  modeLabel.textContent = MODES[mode].label;

  document.querySelectorAll('.mode-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.mode === mode)
  );

  stopTimer();
  setRunningUI(false);
  updateDisplay();
}

function startTimer() {
  running = true;
  ringFill.classList.add('running');
  interval = setInterval(() => {
    remaining--;
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(interval);
      running = false;
      ringFill.classList.remove('running');
      onComplete();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  running  = false;
  ringFill.classList.remove('running');
}

function setRunningUI(isRunning) {
  if (isRunning) {
    startIcon.className = 'fa-solid fa-pause';
    startText.textContent = 'Pause';
  } else {
    startIcon.className = 'fa-solid fa-play';
    startText.textContent = remaining === totalSeconds ? 'Start' : 'Resume';
  }
}

function onComplete() {
  beep();
  setRunningUI(false);

  if (currentMode === 'focus') {
    sessions++;
    sessionsCount.textContent = sessions;
    sessionsBadge.style.animation = 'none';
    requestAnimationFrame(() => {
      sessionsBadge.style.animation = '';
    });
    showToast('Focus session done! Take a break.');
    setTimeout(() => setMode('short'), 1200);
  } else {
    showToast('Break over! Time to focus.');
    setTimeout(() => setMode('focus'), 1200);
  }
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden', 'show');
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 320);
  }, 3000);
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach(delay => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type      = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch (_) {}
}

startBtn.addEventListener('click', () => {
  if (running) {
    stopTimer();
    setRunningUI(false);
  } else {
    startTimer();
    setRunningUI(true);
  }
});

resetBtn.addEventListener('click', () => {
  stopTimer();
  remaining = totalSeconds;
  setRunningUI(false);
  updateDisplay();
});

skipBtn.addEventListener('click', () => {
  stopTimer();
  setRunningUI(false);
  const next = currentMode === 'focus' ? 'short' : 'focus';
  setMode(next);
});

modeTabs.addEventListener('click', e => {
  const tab = e.target.closest('.mode-tab');
  if (!tab) return;
  setMode(tab.dataset.mode);
});

updateDisplay();
