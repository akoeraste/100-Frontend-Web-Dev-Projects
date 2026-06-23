document.addEventListener('DOMContentLoaded', function () {
  var eventName = document.getElementById('eventName');
  var eventDate = document.getElementById('eventDate');
  var startBtn = document.getElementById('startBtn');
  var display = document.getElementById('countdownDisplay');
  var doneMsg = document.getElementById('doneMsg');
  var inputCard = document.querySelector('.input-card');
  var interval = null;
  var startTime = null;

  startBtn.addEventListener('click', start);
  document.getElementById('resetBtn').addEventListener('click', reset);
  document.getElementById('doneResetBtn').addEventListener('click', reset);

  function start() {
    var target = new Date(eventDate.value);
    if (!eventDate.value || isNaN(target.getTime())) return;
    if (target <= new Date()) return;
    var name = eventName.value.trim() || 'Countdown';
    startTime = Date.now();

    document.getElementById('eventTitle').textContent = name;
    document.getElementById('targetDate').textContent = target.toLocaleDateString('en-US', {weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'});
    inputCard.style.display = 'none';
    display.classList.add('visible');
    doneMsg.classList.remove('visible');

    clearInterval(interval);
    interval = setInterval(function () { tick(target); }, 1000);
    tick(target);
  }

  function tick(target) {
    var now = Date.now();
    var diff = target.getTime() - now;
    if (diff <= 0) { clearInterval(interval); done(); return; }

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = pad(d);
    document.getElementById('hours').textContent = pad(h);
    document.getElementById('minutes').textContent = pad(m);
    document.getElementById('seconds').textContent = pad(s);

    var total = target.getTime() - startTime;
    var elapsed = now - startTime;
    var pct = Math.min((elapsed / total) * 100, 100);
    document.getElementById('progressFill').style.width = pct + '%';
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function done() {
    display.classList.remove('visible');
    doneMsg.classList.add('visible');
    document.getElementById('doneText').textContent = (eventName.value.trim() || 'The event') + ' has arrived!';
  }

  function reset() {
    clearInterval(interval);
    display.classList.remove('visible');
    doneMsg.classList.remove('visible');
    inputCard.style.display = '';
    eventName.value = '';
    eventDate.value = '';
  }
});
