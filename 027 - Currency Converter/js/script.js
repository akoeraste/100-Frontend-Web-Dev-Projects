document.addEventListener('DOMContentLoaded', function () {
  var amountEl = document.getElementById('amount');
  var fromEl = document.getElementById('fromCurrency');
  var toEl = document.getElementById('toCurrency');
  var swapBtn = document.getElementById('swapBtn');
  var convertBtn = document.getElementById('convertBtn');
  var resultBox = document.getElementById('resultBox');
  var resultMain = document.getElementById('resultMain');
  var resultSub = document.getElementById('resultSub');

  var currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
    { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
    { code: 'XAF', name: 'Central African CFA', flag: '🇨🇲' },
    { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
    { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭' },
    { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
    { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
    { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' }
  ];

  function populateSelects() {
    currencies.forEach(function (c) {
      var opt1 = document.createElement('option');
      opt1.value = c.code;
      opt1.textContent = c.flag + ' ' + c.code + ' — ' + c.name;
      fromEl.appendChild(opt1);

      var opt2 = document.createElement('option');
      opt2.value = c.code;
      opt2.textContent = c.flag + ' ' + c.code + ' — ' + c.name;
      toEl.appendChild(opt2);
    });

    fromEl.value = 'USD';
    toEl.value = 'EUR';
  }

  function formatNumber(n) {
    if (n >= 1) return n.toFixed(2);
    return n.toPrecision(4);
  }

  function convert() {
    var amount = parseFloat(amountEl.value);
    if (!amount || amount <= 0) {
      resultMain.textContent = 'Enter a valid amount';
      resultSub.textContent = '';
      return;
    }

    var from = fromEl.value;
    var to = toEl.value;

    convertBtn.disabled = true;
    convertBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Converting...';

    fetch('https://api.frankfurter.app/latest?amount=' + amount + '&from=' + from + '&to=' + to)
      .then(function (res) {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(function (data) {
        var rate = data.rates[to];
        var unitRate = rate / amount;

        resultMain.textContent = formatNumber(amount) + ' ' + from + ' = ' + formatNumber(rate) + ' ' + to;
        resultSub.textContent = '1 ' + from + ' = ' + formatNumber(unitRate) + ' ' + to;
        resultBox.classList.add('active');
      })
      .catch(function () {
        resultMain.textContent = 'Conversion failed';
        resultSub.textContent = 'Check your connection or try different currencies';
        resultBox.classList.remove('active');
      })
      .finally(function () {
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="fa-solid fa-arrow-right-arrow-left"></i> Convert';
      });
  }

  swapBtn.addEventListener('click', function () {
    var temp = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value = temp;
  });

  convertBtn.addEventListener('click', convert);

  amountEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') convert();
  });

  populateSelects();
  convert();
});
