document.addEventListener('DOMContentLoaded', function () {
  var pwInput = document.getElementById('pwInput');
  var pwToggle = document.getElementById('pwToggle');
  pwToggle.addEventListener('click', function () {
    var show = pwInput.type === 'password';
    pwInput.type = show ? 'text' : 'password';
    pwToggle.querySelector('i').className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  });

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = this.querySelector('.submit-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
    setTimeout(function () { btn.innerHTML = '<i class="fa-solid fa-check"></i> Welcome!'; btn.style.background = 'linear-gradient(135deg,#34d399,#059669)'; }, 1500);
  });
});
