document.addEventListener('DOMContentLoaded', function () {
  var billInput = document.getElementById('billInput');
  var customTip = document.getElementById('customTip');
  var pplCount = document.getElementById('pplCount');
  var tipPerson = document.getElementById('tipPerson');
  var totalPerson = document.getElementById('totalPerson');
  var grandTotal = document.getElementById('grandTotal');
  var tipBtns = document.querySelectorAll('.tip-btn');
  var tipPercent = 15;
  var people = 1;

  tipBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tipBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      tipPercent = parseInt(btn.getAttribute('data-tip'));
      customTip.value = '';
      calc();
    });
  });

  customTip.addEventListener('input', function () {
    var v = parseFloat(this.value);
    if (!isNaN(v) && v >= 0) {
      tipPercent = v;
      tipBtns.forEach(function (b) { b.classList.remove('active'); });
    }
    calc();
  });

  billInput.addEventListener('input', calc);

  document.getElementById('pplPlus').addEventListener('click', function () { people++; pplCount.textContent = people; calc(); });
  document.getElementById('pplMinus').addEventListener('click', function () { if (people > 1) { people--; pplCount.textContent = people; calc(); } });

  document.getElementById('resetBtn').addEventListener('click', function () {
    billInput.value = '';
    customTip.value = '';
    people = 1;
    pplCount.textContent = '1';
    tipPercent = 15;
    tipBtns.forEach(function (b) { b.classList.remove('active'); });
    document.querySelector('[data-tip="15"]').classList.add('active');
    calc();
  });

  function calc() {
    var bill = parseFloat(billInput.value) || 0;
    var tip = bill * (tipPercent / 100);
    var total = bill + tip;
    var tipPp = tip / people;
    var totalPp = total / people;
    tipPerson.textContent = '$' + tipPp.toFixed(2);
    totalPerson.textContent = '$' + totalPp.toFixed(2);
    grandTotal.textContent = '$' + total.toFixed(2);
  }
});
