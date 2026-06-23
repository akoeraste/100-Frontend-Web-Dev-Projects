document.addEventListener('DOMContentLoaded', function () {
  var c = document.getElementById('celsius');
  var f = document.getElementById('fahrenheit');
  var k = document.getElementById('kelvin');
  var barC = document.getElementById('barC');
  var barF = document.getElementById('barF');
  var barK = document.getElementById('barK');

  c.addEventListener('input', function () {
    var v = parseFloat(c.value);
    if (isNaN(v)) { f.value = ''; k.value = ''; updateBars(null); return; }
    f.value = round(v * 9/5 + 32);
    k.value = round(v + 273.15);
    updateBars(v);
  });

  f.addEventListener('input', function () {
    var v = parseFloat(f.value);
    if (isNaN(v)) { c.value = ''; k.value = ''; updateBars(null); return; }
    var cv = (v - 32) * 5/9;
    c.value = round(cv);
    k.value = round(cv + 273.15);
    updateBars(cv);
  });

  k.addEventListener('input', function () {
    var v = parseFloat(k.value);
    if (isNaN(v)) { c.value = ''; f.value = ''; updateBars(null); return; }
    var cv = v - 273.15;
    c.value = round(cv);
    f.value = round(cv * 9/5 + 32);
    updateBars(cv);
  });

  function round(n) { return Math.round(n * 100) / 100; }

  function updateBars(celsius) {
    if (celsius === null) { barC.style.width = '50%'; barF.style.width = '50%'; barK.style.width = '50%'; return; }
    var pct = Math.min(Math.max((celsius + 40) / 180 * 100, 2), 100);
    barC.style.width = pct + '%';
    barF.style.width = pct + '%';
    barK.style.width = pct + '%';
  }
});
