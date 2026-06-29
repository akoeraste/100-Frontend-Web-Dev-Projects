document.addEventListener('DOMContentLoaded', function () {
  var chatContainer = document.getElementById('chatContainer');
  var userInput = document.getElementById('userInput');
  var sendBtn = document.getElementById('sendBtn');
  var clearBtn = document.getElementById('clearBtn');

  var jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
    "What's a programmer's favorite hangout place? Foo Bar.",
    "Why do Java developers wear glasses? Because they can't C#.",
    "How do you comfort a JavaScript bug? You console it.",
    "Why did the developer go broke? Because he used up all his cache.",
    "What's a computer's least favorite food? Spam.",
    "Why did the programmer quit his job? Because he didn't get arrays."
  ];

  var facts = [
    "The first computer bug was an actual bug — a moth found in a Harvard Mark II computer in 1947.",
    "The first website ever created is still online: info.cern.ch.",
    "Over 6,000 new computer viruses are created every month.",
    "The average person spends about 7 hours a day looking at screens.",
    "JavaScript was created in just 10 days by Brendan Eich in 1995.",
    "There are approximately 1.8 billion websites on the internet."
  ];

  function getResponse(input) {
    var msg = input.toLowerCase().trim();

    if (/^(hi|hello|hey|howdy|sup|yo)/.test(msg))
      return "Hey! How can I help you today?";

    if (/how are you|how('s| is) it going/.test(msg))
      return "I'm just a bot, but I'm doing great! Thanks for asking. How about you?";

    if (/your name|who are you/.test(msg))
      return "I'm ChatBot, your friendly AI assistant built with JavaScript!";

    if (/joke|funny|laugh|humor/.test(msg))
      return jokes[Math.floor(Math.random() * jokes.length)];

    if (/fact|interesting|did you know/.test(msg))
      return facts[Math.floor(Math.random() * facts.length)];

    if (/time|clock/.test(msg))
      return "It's currently " + new Date().toLocaleTimeString() + ".";

    if (/date|today|day/.test(msg))
      return "Today is " + new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ".";

    if (/weather/.test(msg))
      return "I can't check live weather, but you can try project 051 — Weather + Geolocation!";

    if (/thank|thanks/.test(msg))
      return "You're welcome! Let me know if there's anything else.";

    if (/bye|goodbye|see you/.test(msg))
      return "Goodbye! Have a great day! 👋";

    if (/help|what can you do/.test(msg))
      return "I can tell jokes, share fun facts, tell you the time and date, do basic math, and chat! Try asking me something.";

    var mathMatch = msg.match(/(\d+\.?\d*)\s*([+\-*/x×÷])\s*(\d+\.?\d*)/);
    if (mathMatch) {
      var a = parseFloat(mathMatch[1]);
      var op = mathMatch[2];
      var b = parseFloat(mathMatch[3]);
      var result;
      if (op === '+') result = a + b;
      else if (op === '-') result = a - b;
      else if (op === '*' || op === 'x' || op === '×') result = a * b;
      else if (op === '/' || op === '÷') result = b !== 0 ? a / b : 'undefined (division by zero)';
      if (result !== undefined) return "The answer is " + result + ".";
    }

    var fallbacks = [
      "Interesting! Tell me more about that.",
      "I'm not sure I understand, but I'm learning! Try asking me for a joke or fact.",
      "Hmm, that's a tough one. Maybe try rephrasing?",
      "I don't have an answer for that yet. Try asking about time, math, jokes, or facts!",
      "Great question! I wish I knew the answer. Ask me something else?"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  function addMessage(text, sender) {
    var div = document.createElement('div');
    div.className = 'message ' + sender;
    div.innerHTML =
      '<div class="msg-avatar"><i class="fa-solid ' + (sender === 'bot' ? 'fa-robot' : 'fa-user') + '"></i></div>' +
      '<div class="msg-bubble"><p>' + escapeHTML(text) + '</p></div>';
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'message bot';
    div.id = 'typingIndicator';
    div.innerHTML =
      '<div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>' +
      '<div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>';
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function removeTyping() {
    var el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function send() {
    var text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    showTyping();
    var delay = 500 + Math.random() * 800;

    setTimeout(function () {
      removeTyping();
      var response = getResponse(text);
      addMessage(response, 'bot');
    }, delay);
  }

  sendBtn.addEventListener('click', send);
  userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') send();
  });

  clearBtn.addEventListener('click', function () {
    chatContainer.innerHTML = '';
    addMessage("Chat cleared! How can I help you?", 'bot');
  });

  userInput.focus();
});
