document.addEventListener('DOMContentLoaded', function () {
  var unit = 'metric';
  document.querySelectorAll('.unit-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.unit-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      unit = btn.getAttribute('data-unit');
      document.getElementById('metricFields').classList.toggle('hidden', unit !== 'metric');
      document.getElementById('imperialFields').classList.toggle('hidden', unit !== 'imperial');
    });
  });

  document.getElementById('calcBtn').addEventListener('click', function () {
    var bmi;
    if (unit === 'metric') {
      var h = parseFloat(document.getElementById('heightCm').value) / 100;
      var w = parseFloat(document.getElementById('weightKg').value);
      if (!h || !w || h <= 0 || w <= 0) return;
      bmi = w / (h * h);
    } else {
      var ft = parseFloat(document.getElementById('heightFt').value) || 0;
      var inches = parseFloat(document.getElementById('heightIn').value) || 0;
      var lbs = parseFloat(document.getElementById('weightLbs').value);
      var totalIn = ft * 12 + inches;
      if (!totalIn || !lbs || totalIn <= 0 || lbs <= 0) return;
      bmi = (lbs / (totalIn * totalIn)) * 703;
    }

    bmi = Math.round(bmi * 10) / 10;
    document.getElementById('bmiValue').textContent = bmi;

    var cat = document.getElementById('bmiCategory');
    var info = document.getElementById('bmiInfo');
    var marker = document.getElementById('gaugeMarker');

    cat.className = 'bmi-category';
    if (bmi < 18.5) {
      cat.textContent = 'Underweight'; cat.classList.add('under');
      info.textContent = 'A BMI below 18.5 suggests you may be underweight. Consider consulting a healthcare provider.';
    } else if (bmi < 25) {
      cat.textContent = 'Normal Weight'; cat.classList.add('normal');
      info.textContent = 'A BMI between 18.5 and 24.9 is considered healthy. Keep up the good work!';
    } else if (bmi < 30) {
      cat.textContent = 'Overweight'; cat.classList.add('over');
      info.textContent = 'A BMI between 25 and 29.9 suggests overweight. Regular exercise and a balanced diet can help.';
    } else {
      cat.textContent = 'Obese'; cat.classList.add('obese');
      info.textContent = 'A BMI of 30 or above indicates obesity. Consulting a healthcare professional is recommended.';
    }

    var pct = Math.min(Math.max((bmi - 15) / 25 * 100, 2), 98);
    marker.style.left = 'calc(' + pct + '% - 8px)';

    document.getElementById('result').classList.add('visible');
  });
});
