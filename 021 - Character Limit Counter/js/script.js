document.addEventListener('DOMContentLoaded', function () {
  var textArea = document.getElementById('textArea');
  var limitInput = document.getElementById('limitInput');
  var charCount = document.getElementById('charCount');
  var charLimit = document.getElementById('charLimit');
  var remaining = document.getElementById('remaining');
  var ringFill = document.getElementById('ringFill');
  var barFill = document.getElementById('barFill');
  var card = document.getElementById('textareaCard');
  var circumference = 2 * Math.PI * 17;

  textArea.addEventListener('input', update);
  limitInput.addEventListener('input', function () { charLimit.textContent = this.value; update(); });
  update();

  function update() {
    var len = textArea.value.length;
    var limit = parseInt(limitInput.value) || 280;
    var pct = Math.min(len / limit, 1);
    var rem = limit - len;

    charCount.textContent = len;
    charLimit.textContent = limit;

    var offset = circumference - (pct * circumference);
    ringFill.style.strokeDashoffset = Math.max(offset, 0);
    barFill.style.width = (pct * 100) + '%';

    ringFill.className = 'ring-fill';
    barFill.className = 'bar-fill';
    remaining.className = 'remaining';
    card.className = 'textarea-card';

    if (len > limit) {
      remaining.textContent = Math.abs(rem) + ' over limit';
      ringFill.classList.add('over'); barFill.classList.add('over');
      remaining.classList.add('over'); card.classList.add('over');
    } else if (pct > 0.85) {
      remaining.textContent = rem + ' remaining';
      ringFill.classList.add('warning'); barFill.classList.add('warning');
      remaining.classList.add('warning'); card.classList.add('warning');
    } else {
      remaining.textContent = rem + ' remaining';
    }

    var text = textArea.value.trim();
    document.getElementById('wordCount').textContent = text.length === 0 ? 0 : text.split(/\s+/).length;
    document.getElementById('lineCount').textContent = text.length === 0 ? 0 : text.split(/\n/).length;
    document.getElementById('noSpaceCount').textContent = textArea.value.replace(/\s/g, '').length;
  }
});
