document.addEventListener('DOMContentLoaded', function () {
  var eventsList = document.getElementById('eventsList');
  var emptyState = document.getElementById('emptyState');
  var addBtn = document.getElementById('addBtn');
  var overlay = document.getElementById('overlay');
  var modalTitle = document.getElementById('modalTitle');
  var eventForm = document.getElementById('eventForm');
  var eventName = document.getElementById('eventName');
  var eventDate = document.getElementById('eventDate');
  var colorOpts = document.querySelectorAll('.color-opt');

  var events = JSON.parse(localStorage.getItem('countdownEvents') || '[]');
  var editingId = null;
  var selectedColor = 'purple';
  var tickInterval = null;

  function save() {
    localStorage.setItem('countdownEvents', JSON.stringify(events));
  }

  function openModal(edit) {
    editingId = edit ? edit.id : null;
    modalTitle.textContent = edit ? 'Edit Event' : 'New Event';
    eventName.value = edit ? edit.name : '';
    eventDate.value = edit ? edit.date : '';
    selectedColor = edit ? edit.color : 'purple';
    colorOpts.forEach(function (o) {
      o.classList.toggle('active', o.dataset.color === selectedColor);
    });
    overlay.classList.add('active');
    eventName.focus();
  }

  function closeModal() {
    overlay.classList.remove('active');
    eventForm.reset();
    editingId = null;
  }

  function getTimeDiff(target) {
    var diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    var s = Math.floor(diff / 1000);
    var m = Math.floor(s / 60); s %= 60;
    var h = Math.floor(m / 60); m %= 60;
    var d = Math.floor(h / 24); h %= 24;
    return { expired: false, days: d, hours: h, minutes: m, seconds: s };
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function renderEvents() {
    eventsList.innerHTML = '';
    emptyState.classList.toggle('hidden', events.length > 0);

    events.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });

    events.forEach(function (ev) {
      var t = getTimeDiff(ev.date);
      var card = document.createElement('div');
      card.className = 'event-card' + (t.expired ? ' expired' : '');
      card.dataset.id = ev.id;
      card.dataset.color = ev.color;

      card.innerHTML =
        '<div class="event-header">' +
          '<div><div class="event-name">' + escapeHTML(ev.name) + '</div>' +
          '<div class="event-date">' + formatDate(ev.date) + '</div></div>' +
          '<div class="event-actions">' +
            '<button class="event-action edit-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
            '<button class="event-action del del-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
          '</div>' +
        '</div>' +
        '<div class="countdown-grid">' +
          '<div class="cd-unit"><span class="cd-value cd-days">' + pad(t.days) + '</span><span class="cd-label">Days</span></div>' +
          '<div class="cd-unit"><span class="cd-value cd-hours">' + pad(t.hours) + '</span><span class="cd-label">Hours</span></div>' +
          '<div class="cd-unit"><span class="cd-value cd-mins">' + pad(t.minutes) + '</span><span class="cd-label">Mins</span></div>' +
          '<div class="cd-unit"><span class="cd-value cd-secs">' + pad(t.seconds) + '</span><span class="cd-label">Secs</span></div>' +
        '</div>' +
        (t.expired ? '<div class="expired-badge">Event has passed</div>' : '');

      card.querySelector('.edit-btn').addEventListener('click', function () { openModal(ev); });
      card.querySelector('.del-btn').addEventListener('click', function () {
        events = events.filter(function (e) { return e.id !== ev.id; });
        save();
        renderEvents();
      });

      eventsList.appendChild(card);
    });
  }

  function tickAll() {
    events.forEach(function (ev) {
      var card = eventsList.querySelector('[data-id="' + ev.id + '"]');
      if (!card) return;
      var t = getTimeDiff(ev.date);
      card.querySelector('.cd-days').textContent = pad(t.days);
      card.querySelector('.cd-hours').textContent = pad(t.hours);
      card.querySelector('.cd-mins').textContent = pad(t.minutes);
      card.querySelector('.cd-secs').textContent = pad(t.seconds);
      if (t.expired && !card.classList.contains('expired')) {
        card.classList.add('expired');
        if (!card.querySelector('.expired-badge')) {
          var badge = document.createElement('div');
          badge.className = 'expired-badge';
          badge.textContent = 'Event has passed';
          card.appendChild(badge);
        }
      }
    });
  }

  function escapeHTML(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  colorOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      colorOpts.forEach(function (o) { o.classList.remove('active'); });
      opt.classList.add('active');
      selectedColor = opt.dataset.color;
    });
  });

  addBtn.addEventListener('click', function () { openModal(null); });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  overlay.querySelectorAll('[data-close]').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  eventForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (editingId) {
      events = events.map(function (ev) {
        if (ev.id === editingId) {
          return { id: ev.id, name: eventName.value.trim(), date: eventDate.value, color: selectedColor };
        }
        return ev;
      });
    } else {
      events.push({
        id: Date.now().toString(),
        name: eventName.value.trim(),
        date: eventDate.value,
        color: selectedColor
      });
    }
    save();
    closeModal();
    renderEvents();
  });

  renderEvents();
  tickInterval = setInterval(tickAll, 1000);
});
