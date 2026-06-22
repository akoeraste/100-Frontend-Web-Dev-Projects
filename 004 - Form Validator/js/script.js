document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('signupForm');
  var fullName = document.getElementById('fullName');
  var email = document.getElementById('email');
  var phone = document.getElementById('phone');
  var password = document.getElementById('password');
  var confirmPw = document.getElementById('confirmPw');
  var terms = document.getElementById('terms');
  var submitBtn = document.getElementById('submitBtn');

  var pwFill = document.getElementById('pwFill');
  var pwLabel = document.getElementById('pwLabel');

  // ===== HELPERS =====
  function setSuccess(groupId) {
    var group = document.getElementById(groupId);
    group.classList.remove('error');
    group.classList.add('success');
    group.querySelector('.msg').textContent = '';
  }

  function setError(groupId, message) {
    var group = document.getElementById(groupId);
    group.classList.remove('success');
    group.classList.add('error');
    group.querySelector('.msg').textContent = message;
  }

  function clearState(groupId) {
    var group = document.getElementById(groupId);
    group.classList.remove('success', 'error');
    group.querySelector('.msg').textContent = '';
  }

  // ===== VALIDATORS =====
  function validateName() {
    var val = fullName.value.trim();
    if (val.length === 0) {
      clearState('nameGroup');
      return false;
    }
    if (val.length < 3) {
      setError('nameGroup', 'Name must be at least 3 characters.');
      return false;
    }
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(val)) {
      setError('nameGroup', 'Name can only contain letters, spaces, hyphens, and apostrophes.');
      return false;
    }
    setSuccess('nameGroup');
    return true;
  }

  function validateEmail() {
    var val = email.value.trim();
    if (val.length === 0) {
      clearState('emailGroup');
      return false;
    }
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(val)) {
      setError('emailGroup', 'Please enter a valid email address.');
      return false;
    }
    setSuccess('emailGroup');
    return true;
  }

  function validatePhone() {
    var val = phone.value.trim();
    if (val.length === 0) {
      clearState('phoneGroup');
      return false;
    }
    var cleaned = val.replace(/[\s\-().+]/g, '');
    if (!/^\d{7,15}$/.test(cleaned)) {
      setError('phoneGroup', 'Enter a valid phone number (7-15 digits).');
      return false;
    }
    setSuccess('phoneGroup');
    return true;
  }

  function validatePassword() {
    var val = password.value;

    var rules = {
      len: val.length >= 8,
      upper: /[A-Z]/.test(val),
      lower: /[a-z]/.test(val),
      num: /[0-9]/.test(val),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)
    };

    // update rule indicators
    updateRule('ruleLen', rules.len);
    updateRule('ruleUpper', rules.upper);
    updateRule('ruleLower', rules.lower);
    updateRule('ruleNum', rules.num);
    updateRule('ruleSpecial', rules.special);

    // strength score
    var score = 0;
    Object.keys(rules).forEach(function (key) {
      if (rules[key]) score++;
    });

    // update strength bar
    pwFill.className = 'pw-fill';
    pwLabel.className = 'pw-label';

    if (val.length === 0) {
      pwFill.className = 'pw-fill';
      pwLabel.textContent = 'Strength';
      pwLabel.className = 'pw-label';
      return false;
    }

    if (score <= 1) {
      pwFill.classList.add('weak');
      pwLabel.classList.add('weak');
      pwLabel.textContent = 'Weak';
    } else if (score <= 2) {
      pwFill.classList.add('fair');
      pwLabel.classList.add('fair');
      pwLabel.textContent = 'Fair';
    } else if (score <= 4) {
      pwFill.classList.add('good');
      pwLabel.classList.add('good');
      pwLabel.textContent = 'Good';
    }

    if (score === 5) {
      pwFill.classList.add('strong');
      pwLabel.classList.add('strong');
      pwLabel.textContent = 'Strong';
    }

    // also re-validate confirm if it has a value
    if (confirmPw.value.length > 0) {
      validateConfirm();
    }

    return score === 5;
  }

  function updateRule(id, passed) {
    var li = document.getElementById(id);
    if (passed) {
      li.classList.add('pass');
    } else {
      li.classList.remove('pass');
    }
  }

  function validateConfirm() {
    var val = confirmPw.value;
    if (val.length === 0) {
      clearState('confirmGroup');
      return false;
    }
    if (val !== password.value) {
      setError('confirmGroup', 'Passwords do not match.');
      return false;
    }
    setSuccess('confirmGroup');
    return true;
  }

  function validateTerms() {
    var group = document.getElementById('termsGroup');
    if (!terms.checked) {
      group.classList.add('error');
      group.querySelector('.msg').textContent = 'You must agree to the terms.';
      return false;
    }
    group.classList.remove('error');
    group.querySelector('.msg').textContent = '';
    return true;
  }

  // ===== REAL-TIME VALIDATION =====
  fullName.addEventListener('input', validateName);
  email.addEventListener('input', validateEmail);
  phone.addEventListener('input', validatePhone);
  password.addEventListener('input', validatePassword);
  confirmPw.addEventListener('input', validateConfirm);
  terms.addEventListener('change', validateTerms);

  // ===== PASSWORD TOGGLE =====
  var togglePw = document.getElementById('togglePw');
  togglePw.addEventListener('click', function () {
    var isPassword = password.type === 'password';
    password.type = isPassword ? 'text' : 'password';
    togglePw.querySelector('i').className = isPassword
      ? 'fa-solid fa-eye-slash'
      : 'fa-solid fa-eye';
  });

  // ===== FORM SUBMIT =====
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameOk = validateName();
    var emailOk = validateEmail();
    var phoneOk = validatePhone();
    var pwOk = validatePassword();
    var confirmOk = validateConfirm();
    var termsOk = validateTerms();

    // show errors for empty required fields
    if (fullName.value.trim().length === 0) setError('nameGroup', 'Full name is required.');
    if (email.value.trim().length === 0) setError('emailGroup', 'Email is required.');
    if (phone.value.trim().length === 0) setError('phoneGroup', 'Phone number is required.');
    if (password.value.length === 0) {
      var pwGroup = document.getElementById('passwordGroup');
      pwGroup.classList.add('error');
    }
    if (confirmPw.value.length === 0) setError('confirmGroup', 'Please confirm your password.');

    if (!nameOk || !emailOk || !phoneOk || !pwOk || !confirmOk || !termsOk) return;

    // simulate submission
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.classList.remove('loading');
      submitBtn.classList.add('done');

      setTimeout(function () {
        showSuccessModal();
      }, 600);
    }, 1500);
  });

  // ===== SUCCESS MODAL =====
  function showSuccessModal() {
    var overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    overlay.innerHTML =
      '<div class="success-modal">' +
        '<div class="modal-icon"><i class="fa-solid fa-check"></i></div>' +
        '<h3>Welcome Aboard!</h3>' +
        '<p>Your account has been created successfully. You\'re all set to get started.</p>' +
        '<button class="btn-close" id="modalClose">Continue</button>' +
      '</div>';
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add('active');
    });

    overlay.querySelector('#modalClose').addEventListener('click', function () {
      overlay.classList.remove('active');
      setTimeout(function () {
        overlay.remove();
        form.reset();
        submitBtn.classList.remove('done');
        submitBtn.disabled = false;
        // reset all states
        ['nameGroup', 'emailGroup', 'phoneGroup', 'confirmGroup'].forEach(clearState);
        document.getElementById('passwordGroup').classList.remove('error');
        document.getElementById('termsGroup').classList.remove('error');
        document.getElementById('termsGroup').querySelector('.msg').textContent = '';
        document.querySelectorAll('.pw-rules li').forEach(function (li) {
          li.classList.remove('pass');
        });
        pwFill.className = 'pw-fill';
        pwLabel.className = 'pw-label';
        pwLabel.textContent = 'Strength';
      }, 400);
    });
  }
});
