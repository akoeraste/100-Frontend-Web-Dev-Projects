document.addEventListener('DOMContentLoaded', function () {
  var loginScreen = document.getElementById('loginScreen');
  var chatScreen = document.getElementById('chatScreen');
  var nameInput = document.getElementById('nameInput');
  var joinBtn = document.getElementById('joinBtn');
  var colorOptions = document.getElementById('colorOptions');
  var colorOpts = colorOptions.querySelectorAll('.color-opt');

  var chatContainer = document.getElementById('chatContainer');
  var msgInput = document.getElementById('msgInput');
  var sendBtn = document.getElementById('sendBtn');
  var userBadge = document.getElementById('userBadge');
  var leaveBtn = document.getElementById('leaveBtn');

  var userName = '';
  var userColor = '#818cf8';
  var sessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  colorOpts.forEach(function (opt) {
    opt.style.background = opt.dataset.color;
    opt.addEventListener('click', function () {
      colorOpts.forEach(function (o) { o.classList.remove('active'); });
      opt.classList.add('active');
      userColor = opt.dataset.color;
    });
  });

  function formatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function getInitials(name) {
    return name.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  }

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function addMessage(data) {
    var isSelf = data.sessionId === sessionId;
    var div = document.createElement('div');
    div.className = 'message' + (isSelf ? ' self' : '');
    div.innerHTML =
      '<div class="msg-avatar" style="background:' + data.color + '">' + getInitials(data.name) + '</div>' +
      '<div class="msg-content">' +
        '<span class="msg-name">' + escapeHTML(data.name) + '</span>' +
        '<div class="msg-bubble"><p>' + escapeHTML(data.text) + '</p></div>' +
        '<span class="msg-time">' + data.time + '</span>' +
      '</div>';
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function addSystemMsg(text) {
    var div = document.createElement('div');
    div.className = 'system-msg';
    div.textContent = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function broadcastMessage(data) {
    localStorage.setItem('localchat_msg', JSON.stringify(data));
    localStorage.removeItem('localchat_msg');
  }

  function broadcastSystem(text) {
    var data = { type: 'system', text: text, sessionId: sessionId };
    localStorage.setItem('localchat_sys', JSON.stringify(data));
    localStorage.removeItem('localchat_sys');
  }

  function loadHistory() {
    var history = JSON.parse(localStorage.getItem('localchat_history') || '[]');
    history.forEach(function (data) {
      if (data.type === 'system') addSystemMsg(data.text);
      else addMessage(data);
    });
  }

  function saveToHistory(data) {
    var history = JSON.parse(localStorage.getItem('localchat_history') || '[]');
    history.push(data);
    if (history.length > 100) history = history.slice(-100);
    localStorage.setItem('localchat_history', JSON.stringify(history));
  }

  function joinChat() {
    var name = nameInput.value.trim();
    if (!name) { nameInput.focus(); return; }

    userName = name;
    userBadge.textContent = name;
    userBadge.style.background = userColor;

    loginScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');

    loadHistory();

    var sysText = name + ' joined the chat';
    addSystemMsg(sysText);
    saveToHistory({ type: 'system', text: sysText, sessionId: sessionId });
    broadcastSystem(sysText);

    msgInput.focus();
  }

  function sendMessage() {
    var text = msgInput.value.trim();
    if (!text) return;

    var data = {
      type: 'message',
      name: userName,
      color: userColor,
      text: text,
      time: formatTime(),
      sessionId: sessionId
    };

    addMessage(data);
    saveToHistory(data);
    broadcastMessage(data);
    msgInput.value = '';
  }

  window.addEventListener('storage', function (e) {
    if (e.key === 'localchat_msg' && e.newValue) {
      var data = JSON.parse(e.newValue);
      if (data.sessionId !== sessionId) addMessage(data);
    }
    if (e.key === 'localchat_sys' && e.newValue) {
      var data = JSON.parse(e.newValue);
      if (data.sessionId !== sessionId) addSystemMsg(data.text);
    }
  });

  joinBtn.addEventListener('click', joinChat);
  nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') joinChat(); });
  sendBtn.addEventListener('click', sendMessage);
  msgInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMessage(); });

  leaveBtn.addEventListener('click', function () {
    var sysText = userName + ' left the chat';
    saveToHistory({ type: 'system', text: sysText, sessionId: sessionId });
    broadcastSystem(sysText);
    chatScreen.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    chatContainer.innerHTML = '';
    nameInput.value = '';
  });
});
