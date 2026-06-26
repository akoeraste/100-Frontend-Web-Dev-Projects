document.addEventListener('DOMContentLoaded', function () {
  var notesGrid = document.getElementById('notesGrid');
  var addBtn = document.getElementById('addBtn');
  var noteCountEl = document.getElementById('noteCount');
  var emptyState = document.getElementById('emptyState');
  var searchInput = document.getElementById('searchInput');

  var colors = ['purple', 'blue', 'green', 'amber', 'pink', 'cyan'];
  var notes = JSON.parse(localStorage.getItem('stickyNotes') || '[]');

  function save() {
    localStorage.setItem('stickyNotes', JSON.stringify(notes));
  }

  function updateCount() {
    var count = notes.length;
    noteCountEl.textContent = count + (count === 1 ? ' note' : ' notes');
    emptyState.classList.toggle('hidden', count > 0);
  }

  function formatDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function createNoteEl(note) {
    var div = document.createElement('div');
    div.className = 'note';
    div.dataset.id = note.id;
    div.dataset.color = note.color;

    var colorDots = colors.map(function (c) {
      return '<span class="color-dot' + (c === note.color ? ' active' : '') + '" data-c="' + c + '"></span>';
    }).join('');

    div.innerHTML =
      '<div class="note-header">' +
        '<input class="note-title" placeholder="Title..." value="' + escapeAttr(note.title) + '" />' +
        '<div class="note-actions">' +
          '<button class="note-action del" title="Delete"><i class="fa-solid fa-trash"></i></button>' +
        '</div>' +
      '</div>' +
      '<textarea class="note-body" placeholder="Write something...">' + escapeHTML(note.body) + '</textarea>' +
      '<div class="color-picker">' + colorDots + '</div>' +
      '<div class="note-date">' + formatDate(note.created) + '</div>';

    var titleInput = div.querySelector('.note-title');
    var bodyInput = div.querySelector('.note-body');
    var delBtn = div.querySelector('.del');
    var dots = div.querySelectorAll('.color-dot');

    titleInput.addEventListener('input', function () {
      note.title = titleInput.value;
      save();
    });

    bodyInput.addEventListener('input', function () {
      note.body = bodyInput.value;
      save();
    });

    delBtn.addEventListener('click', function () {
      notes = notes.filter(function (n) { return n.id !== note.id; });
      save();
      div.style.transform = 'scale(0.8)';
      div.style.opacity = '0';
      setTimeout(function () {
        div.remove();
        updateCount();
      }, 200);
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        note.color = dot.dataset.c;
        div.dataset.color = note.color;
        dots.forEach(function (d) { d.classList.remove('active'); });
        dot.classList.add('active');
        save();
      });
    });

    return div;
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderNotes(filter) {
    notesGrid.innerHTML = '';
    var filtered = notes;

    if (filter) {
      var q = filter.toLowerCase();
      filtered = notes.filter(function (n) {
        return n.title.toLowerCase().indexOf(q) !== -1 || n.body.toLowerCase().indexOf(q) !== -1;
      });
    }

    filtered.forEach(function (note) {
      notesGrid.appendChild(createNoteEl(note));
    });

    updateCount();
  }

  addBtn.addEventListener('click', function () {
    var note = {
      id: Date.now().toString(),
      title: '',
      body: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      created: Date.now()
    };
    notes.unshift(note);
    save();
    renderNotes(searchInput.value.trim());
    var firstNote = notesGrid.querySelector('.note-title');
    if (firstNote) firstNote.focus();
  });

  searchInput.addEventListener('input', function () {
    renderNotes(searchInput.value.trim());
  });

  renderNotes();
});
