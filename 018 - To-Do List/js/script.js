document.addEventListener('DOMContentLoaded', function () {
  var taskInput = document.getElementById('taskInput');
  var addBtn = document.getElementById('addBtn');
  var taskList = document.getElementById('taskList');
  var emptyMsg = document.getElementById('emptyMsg');
  var clearRow = document.getElementById('clearRow');
  var tasks = JSON.parse(localStorage.getItem('todos') || '[]');
  var filter = 'all';

  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') addTask(); });
  document.getElementById('clearDone').addEventListener('click', function () {
    tasks = tasks.filter(function (t) { return !t.done; }); save(); render();
  });

  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      filter = btn.getAttribute('data-filter');
      render();
    });
  });

  function addTask() {
    var text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now(), text: text, done: false });
    taskInput.value = '';
    save(); render();
  }

  function render() {
    taskList.innerHTML = '';
    var filtered = tasks.filter(function (t) {
      if (filter === 'active') return !t.done;
      if (filter === 'completed') return t.done;
      return true;
    });

    filtered.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' done' : '');
      li.innerHTML =
        '<button class="task-check"><i class="fa-solid fa-check"></i></button>' +
        '<span class="task-text">' + escHtml(task.text) + '</span>' +
        '<input class="task-edit" type="text" value="' + escAttr(task.text) + '" />' +
        '<div class="task-actions">' +
        '<button class="task-btn edit" title="Edit"><i class="fa-solid fa-pen"></i></button>' +
        '<button class="task-btn del" title="Delete"><i class="fa-solid fa-trash-can"></i></button>' +
        '</div>';

      li.querySelector('.task-check').addEventListener('click', function () {
        task.done = !task.done; save(); render();
      });

      li.querySelector('.del').addEventListener('click', function () {
        tasks = tasks.filter(function (t) { return t.id !== task.id; }); save(); render();
      });

      var editBtn = li.querySelector('.edit');
      var editInput = li.querySelector('.task-edit');
      var textSpan = li.querySelector('.task-text');

      editBtn.addEventListener('click', function () {
        var editing = editInput.style.display === 'block';
        if (editing) {
          var v = editInput.value.trim();
          if (v) { task.text = v; save(); }
          render();
        } else {
          textSpan.style.display = 'none';
          editInput.style.display = 'block';
          editInput.focus();
          editBtn.querySelector('i').className = 'fa-solid fa-check';
        }
      });

      editInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') editBtn.click();
        if (e.key === 'Escape') render();
      });

      taskList.appendChild(li);
    });

    var doneCount = tasks.filter(function (t) { return t.done; }).length;
    var activeCount = tasks.length - doneCount;
    document.getElementById('countAll').textContent = tasks.length;
    document.getElementById('countActive').textContent = activeCount;
    document.getElementById('countDone').textContent = doneCount;
    emptyMsg.style.display = filtered.length === 0 ? 'block' : 'none';
    clearRow.style.display = doneCount > 0 ? 'block' : 'none';
  }

  function save() { localStorage.setItem('todos', JSON.stringify(tasks)); }
  function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function escAttr(s) { return s.replace(/"/g, '&quot;'); }

  render();
});
