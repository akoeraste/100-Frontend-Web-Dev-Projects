document.addEventListener('DOMContentLoaded', function () {
  var range = document.getElementById('progressRange');
  var valueBadge = document.getElementById('valueBadge');
  var animateBtn = document.getElementById('animateBtn');
  var resetBtn = document.getElementById('resetBtn');
  var stepLineFill = document.getElementById('stepLineFill');

  var bars = document.querySelectorAll('[data-bar]');
  var circles = document.querySelectorAll('[data-circle]');
  var pctLinear = document.querySelectorAll('.pct-linear');
  var pctCircle = document.querySelectorAll('.pct-circle');
  var steps = document.querySelectorAll('.step');

  var circumference = 2 * Math.PI * 52;
  var animating = false;
  var animationFrame = null;

  function setProgress(val) {
    var pct = Math.round(val);
    valueBadge.textContent = pct + '%';
    range.value = pct;

    bars.forEach(function (bar) {
      bar.style.width = pct + '%';
    });
    pctLinear.forEach(function (el) {
      el.textContent = pct + '%';
    });

    var offset = circumference - (circumference * pct / 100);
    circles.forEach(function (c) {
      c.style.strokeDashoffset = offset;
    });
    pctCircle.forEach(function (el) {
      el.textContent = pct + '%';
    });

    var activeSteps = pct === 0 ? 0 : Math.ceil(pct / 25);
    steps.forEach(function (step, i) {
      step.classList.toggle('active', i < activeSteps);
    });
    var linePct = Math.min(100, Math.max(0, ((activeSteps - 1) / 3) * 100));
    stepLineFill.style.width = (activeSteps === 0 ? 0 : linePct) + '%';
  }

  range.addEventListener('input', function () {
    if (animating) stopAnimation();
    setProgress(parseInt(range.value, 10));
  });

  function stopAnimation() {
    animating = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animateBtn.innerHTML = '<i class="fa-solid fa-play"></i> Animate';
  }

  animateBtn.addEventListener('click', function () {
    if (animating) {
      stopAnimation();
      return;
    }

    animating = true;
    animateBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
    var start = null;
    var from = parseInt(range.value, 10);
    var duration = (100 - from) * 30;

    function step(ts) {
      if (!animating) return;
      if (!start) start = ts;
      var elapsed = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      var val = from + (100 - from) * progress;
      setProgress(val);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        stopAnimation();
      }
    }

    if (from >= 100) {
      setProgress(0);
      from = 0;
      duration = 3000;
    }

    animationFrame = requestAnimationFrame(step);
  });

  resetBtn.addEventListener('click', function () {
    stopAnimation();
    setProgress(0);
  });

  setProgress(0);
});
