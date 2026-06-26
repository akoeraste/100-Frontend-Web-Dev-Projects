document.addEventListener('DOMContentLoaded', function () {
  var txForm = document.getElementById('txForm');
  var txDesc = document.getElementById('txDesc');
  var txAmount = document.getElementById('txAmount');
  var txType = document.getElementById('txType');
  var txCategory = document.getElementById('txCategory');
  var txList = document.getElementById('txList');
  var emptyState = document.getElementById('emptyState');
  var clearBtn = document.getElementById('clearBtn');
  var totalIncome = document.getElementById('totalIncome');
  var totalExpense = document.getElementById('totalExpense');
  var totalBalance = document.getElementById('totalBalance');

  var catIcons = {
    food: 'fa-utensils', transport: 'fa-car', shopping: 'fa-bag-shopping',
    bills: 'fa-file-invoice', salary: 'fa-briefcase', freelance: 'fa-laptop',
    other: 'fa-ellipsis'
  };

  var transactions = JSON.parse(localStorage.getItem('expenses') || '[]');

  function save() { localStorage.setItem('expenses', JSON.stringify(transactions)); }

  function formatMoney(n) { return '$' + Math.abs(n).toFixed(2); }

  function updateSummary() {
    var inc = 0, exp = 0;
    transactions.forEach(function (t) {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    totalIncome.textContent = formatMoney(inc);
    totalExpense.textContent = formatMoney(exp);
    totalBalance.textContent = formatMoney(inc - exp);
  }

  function render() {
    txList.innerHTML = '';
    emptyState.classList.toggle('hidden', transactions.length > 0);
    transactions.forEach(function (t, idx) {
      var item = document.createElement('div');
      item.className = 'tx-item ' + t.type;
      item.innerHTML =
        '<div class="tx-cat"><i class="fa-solid ' + (catIcons[t.category] || catIcons.other) + '"></i></div>' +
        '<div class="tx-info"><div class="tx-desc">' + escapeHTML(t.desc) + '</div>' +
        '<div class="tx-meta">' + capitalize(t.category) + ' &middot; ' + t.date + '</div></div>' +
        '<div class="tx-amount">' + (t.type === 'income' ? '+' : '-') + formatMoney(t.amount) + '</div>' +
        '<button class="tx-del" data-idx="' + idx + '"><i class="fa-solid fa-xmark"></i></button>';
      txList.prepend(item);
    });
    updateSummary();
  }

  function escapeHTML(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  txForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var amount = parseFloat(txAmount.value);
    if (!txDesc.value.trim() || isNaN(amount) || amount <= 0) return;
    transactions.push({
      desc: txDesc.value.trim(),
      amount: amount,
      type: txType.value,
      category: txCategory.value,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
    save();
    render();
    txForm.reset();
    txDesc.focus();
  });

  txList.addEventListener('click', function (e) {
    var btn = e.target.closest('.tx-del');
    if (!btn) return;
    transactions.splice(parseInt(btn.dataset.idx, 10), 1);
    save();
    render();
  });

  clearBtn.addEventListener('click', function () {
    if (transactions.length === 0) return;
    transactions = [];
    save();
    render();
  });

  render();
});
