document.addEventListener('DOMContentLoaded', function () {

  var hoursEl = document.getElementById('hours');
  var minutesEl = document.getElementById('minutes');
  var secondsEl = document.getElementById('seconds');
  var ampmEl = document.getElementById('ampm');
  var greetingEl = document.getElementById('greeting');
  var dateRowEl = document.getElementById('dateRow');
  var btn12 = document.getElementById('btn12');
  var btn24 = document.getElementById('btn24');

  var londonEl = document.getElementById('london');
  var newyorkEl = document.getElementById('newyork');
  var tokyoEl = document.getElementById('tokyo');
  var dubaiEl = document.getElementById('dubai');

  var is24 = false;
  var prevSeconds = '';

  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var months = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  // ===== FORMAT TOGGLE =====
  btn12.addEventListener('click', function () {
    is24 = false;
    btn12.classList.add('active');
    btn24.classList.remove('active');
    ampmEl.classList.remove('hidden');
    updateClock();
  });

  btn24.addEventListener('click', function () {
    is24 = true;
    btn24.classList.add('active');
    btn12.classList.remove('active');
    ampmEl.classList.add('hidden');
    updateClock();
  });

  // ===== CLOCK UPDATE =====
  function updateClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();

    // greeting
    if (h < 6) greetingEl.textContent = 'Good Night';
    else if (h < 12) greetingEl.textContent = 'Good Morning';
    else if (h < 18) greetingEl.textContent = 'Good Afternoon';
    else greetingEl.textContent = 'Good Evening';

    // AM/PM
    var period = h >= 12 ? 'PM' : 'AM';
    var displayH = h;

    if (!is24) {
      displayH = h % 12;
      if (displayH === 0) displayH = 12;
      ampmEl.textContent = period;
    }

    var hStr = pad(displayH);
    var mStr = pad(m);
    var sStr = pad(s);

    // tick animation on seconds change
    if (sStr !== prevSeconds) {
      secondsEl.classList.remove('tick');
      void secondsEl.offsetWidth;
      secondsEl.classList.add('tick');
      prevSeconds = sStr;
    }

    hoursEl.textContent = hStr;
    minutesEl.textContent = mStr;
    secondsEl.textContent = sStr;

    // date
    dateRowEl.textContent = days[now.getDay()] + ', ' +
      months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

    // world clocks
    updateWorldClocks(now);
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  // ===== WORLD CLOCKS =====
  function updateWorldClocks(now) {
    londonEl.textContent = getTimeForOffset(now, 1);
    newyorkEl.textContent = getTimeForOffset(now, -4);
    tokyoEl.textContent = getTimeForOffset(now, 9);
    dubaiEl.textContent = getTimeForOffset(now, 4);
  }

  function getTimeForOffset(now, offset) {
    var utc = now.getTime() + now.getTimezoneOffset() * 60000;
    var city = new Date(utc + offset * 3600000);
    var h = city.getHours();
    var m = city.getMinutes();

    if (is24) {
      return pad(h) + ':' + pad(m);
    }

    var period = h >= 12 ? ' PM' : ' AM';
    var h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return pad(h12) + ':' + pad(m) + period;
  }

  // ===== START =====
  updateClock();
  setInterval(updateClock, 1000);
});
