document.addEventListener('DOMContentLoaded', function () {
  var passwordText = document.getElementById('passwordText');
  var lenSlider = document.getElementById('lenSlider');
  var lenValue = document.getElementById('lenValue');
  var strFill = document.getElementById('strFill');
  var strLabel = document.getElementById('strLabel');
  var copyBtn = document.getElementById('copyBtn');
  var toast = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');

  var upper = document.getElementById('upper');
  var lower = document.getElementById('lower');
  var numbers = document.getElementById('numbers');
  var symbols = document.getElementById('symbols');

  var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWER = 'abcdefghijklmnopqrstuvwxyz';
  var NUMS = '0123456789';
  var SYMS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  lenSlider.addEventListener('input', function () { lenValue.textContent = this.value; });

  document.getElementById('genBtn').addEventListener('click', generate);
  generate();

  function generate() {
    var len = parseInt(lenSlider.value);
    var pool = '';
    if (upper.checked) pool += UPPER;
    if (lower.checked) pool += LOWER;
    if (numbers.checked) pool += NUMS;
    if (symbols.checked) pool += SYMS;
    if (pool.length === 0) { passwordText.textContent = 'Select at least one option'; return; }

    var pw = '';
    for (var i = 0; i < len; i++) {
      pw += pool[Math.floor(Math.random() * pool.length)];
    }
    passwordText.textContent = pw;
    updateStrength(pw);
  }

  function updateStrength(pw) {
    var score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 16) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    strFill.className = 'str-fill';
    strLabel.className = 'str-label';

    if (score <= 1) { strFill.classList.add('weak'); strLabel.classList.add('weak'); strLabel.textContent = 'Weak'; }
    else if (score <= 2) { strFill.classList.add('fair'); strLabel.classList.add('fair'); strLabel.textContent = 'Fair'; }
    else if (score <= 3) { strFill.classList.add('good'); strLabel.classList.add('good'); strLabel.textContent = 'Good'; }
    else { strFill.classList.add('strong'); strLabel.classList.add('strong'); strLabel.textContent = 'Strong'; }
  }

  copyBtn.addEventListener('click', function () {
    var text = passwordText.textContent;
    if (!text || text === 'Click Generate' || text === 'Select at least one option') return;
    navigator.clipboard.writeText(text).then(function () {
      showToast('Password copied!');
      copyBtn.classList.add('copied');
      copyBtn.querySelector('i').className = 'fa-solid fa-check';
      setTimeout(function () {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('i').className = 'fa-regular fa-copy';
      }, 1500);
    });
  });

  var toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
});
