document.addEventListener('DOMContentLoaded', function () {
  var expression = document.getElementById('expression');
  var current = document.getElementById('current');
  var keys = document.querySelectorAll('.key');

  var displayValue = '0';
  var firstOperand = null;
  var operator = null;
  var waitingForSecond = false;
  var expressionStr = '';

  keys.forEach(function (key) {
    key.addEventListener('click', function () {
      var action = key.getAttribute('data-action');
      var value = key.getAttribute('data-value');

      switch (action) {
        case 'number': inputNumber(value); break;
        case 'decimal': inputDecimal(); break;
        case 'operator': inputOperator(value); break;
        case 'equals': inputEquals(); break;
        case 'clear': clearAll(); break;
        case 'toggle': toggleSign(); break;
        case 'percent': percent(); break;
      }
      updateDisplay();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    else if (e.key === '.') inputDecimal();
    else if (e.key === '+') inputOperator('+');
    else if (e.key === '-') inputOperator('−');
    else if (e.key === '*') inputOperator('×');
    else if (e.key === '/') { e.preventDefault(); inputOperator('÷'); }
    else if (e.key === 'Enter' || e.key === '=') inputEquals();
    else if (e.key === 'Escape') clearAll();
    else if (e.key === '%') percent();
    else if (e.key === 'Backspace') backspace();
    else return;
    updateDisplay();
  });

  function inputNumber(n) {
    if (waitingForSecond) { displayValue = n; waitingForSecond = false; }
    else { displayValue = displayValue === '0' ? n : displayValue + n; }
  }

  function inputDecimal() {
    if (waitingForSecond) { displayValue = '0.'; waitingForSecond = false; return; }
    if (!displayValue.includes('.')) displayValue += '.';
  }

  function inputOperator(op) {
    var val = parseFloat(displayValue);
    if (firstOperand !== null && !waitingForSecond) {
      var result = compute(firstOperand, operator, val);
      displayValue = String(result);
      firstOperand = result;
    } else {
      firstOperand = val;
    }
    operator = op;
    waitingForSecond = true;
    expressionStr = formatNum(firstOperand) + ' ' + op;
    clearActiveOp();
    var opBtns = document.querySelectorAll('.key.op');
    opBtns.forEach(function (b) { if (b.getAttribute('data-value') === op) b.classList.add('active-op'); });
  }

  function inputEquals() {
    if (firstOperand === null || operator === null) return;
    var val = parseFloat(displayValue);
    var result = compute(firstOperand, operator, val);
    expressionStr = formatNum(firstOperand) + ' ' + operator + ' ' + formatNum(val) + ' =';
    displayValue = String(result);
    firstOperand = null;
    operator = null;
    waitingForSecond = false;
    clearActiveOp();
  }

  function compute(a, op, b) {
    switch (op) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 'Error';
    }
    return b;
  }

  function clearAll() {
    displayValue = '0'; firstOperand = null; operator = null;
    waitingForSecond = false; expressionStr = '';
    clearActiveOp();
  }

  function toggleSign() {
    if (displayValue !== '0') displayValue = String(-parseFloat(displayValue));
  }

  function percent() {
    displayValue = String(parseFloat(displayValue) / 100);
  }

  function backspace() {
    if (waitingForSecond) return;
    displayValue = displayValue.length > 1 ? displayValue.slice(0, -1) : '0';
  }

  function formatNum(n) {
    if (typeof n === 'string') return n;
    var s = String(n);
    if (s.length > 12) return parseFloat(n.toPrecision(10)).toString();
    return s;
  }

  function clearActiveOp() {
    document.querySelectorAll('.key.op').forEach(function (b) { b.classList.remove('active-op'); });
  }

  function updateDisplay() {
    var d = displayValue === 'Error' ? 'Error' : formatNum(parseFloat(displayValue));
    if (displayValue.endsWith('.')) d = displayValue;
    current.textContent = d;
    current.classList.toggle('shrink', d.length > 10);
    expression.textContent = expressionStr;
  }
});
