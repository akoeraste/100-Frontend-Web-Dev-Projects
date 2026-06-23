document.addEventListener('DOMContentLoaded', function () {
  var dayIn = document.getElementById('day');
  var monthIn = document.getElementById('month');
  var yearIn = document.getElementById('year');
  var calcBtn = document.getElementById('calcBtn');
  var errorMsg = document.getElementById('errorMsg');
  var results = document.getElementById('results');

  calcBtn.addEventListener('click', calculate);

  function calculate() {
    errorMsg.textContent = '';
    results.classList.remove('visible');

    var d = parseInt(dayIn.value), m = parseInt(monthIn.value), y = parseInt(yearIn.value);
    if (isNaN(d) || isNaN(m) || isNaN(y)) { errorMsg.textContent = 'Please fill in all fields.'; return; }
    if (m < 1 || m > 12) { errorMsg.textContent = 'Month must be between 1 and 12.'; return; }
    if (d < 1 || d > 31) { errorMsg.textContent = 'Day must be between 1 and 31.'; return; }

    var dob = new Date(y, m - 1, d);
    if (dob.getFullYear() !== y || dob.getMonth() !== m - 1 || dob.getDate() !== d) {
      errorMsg.textContent = 'Invalid date. Please check your input.'; return;
    }

    var now = new Date();
    if (dob > now) { errorMsg.textContent = 'Date of birth cannot be in the future.'; return; }

    var years = now.getFullYear() - dob.getFullYear();
    var months = now.getMonth() - dob.getMonth();
    var days = now.getDate() - dob.getDate();

    if (days < 0) { months--; var prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }

    document.getElementById('resYears').textContent = years;
    document.getElementById('resMonths').textContent = months;
    document.getElementById('resDays').textContent = days;

    var totalDays = Math.floor((now - dob) / (1000 * 60 * 60 * 24));
    var totalHours = totalDays * 24;
    var heartbeats = totalDays * 100000;
    var sleepYears = (totalDays / 365.25 / 3).toFixed(1);

    document.getElementById('totalDays').textContent = totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = totalHours.toLocaleString();
    document.getElementById('heartbeats').textContent = formatBig(heartbeats);
    document.getElementById('sleepYears').textContent = sleepYears + ' yrs';

    var nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    var daysUntil = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));
    document.getElementById('nextBday').innerHTML = daysUntil === 0
      ? '<strong>Happy Birthday!</strong> 🎉'
      : 'Your next birthday is in <strong>' + daysUntil + ' days</strong>';

    results.classList.add('visible');
  }

  function formatBig(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    return n.toLocaleString();
  }
});
