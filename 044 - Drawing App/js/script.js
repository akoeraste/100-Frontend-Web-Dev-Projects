document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var colorPicker = document.getElementById('colorPicker');
  var brushSize = document.getElementById('brushSize');
  var sizeLabel = document.getElementById('sizeLabel');
  var penTool = document.getElementById('penTool');
  var eraserTool = document.getElementById('eraserTool');
  var undoBtn = document.getElementById('undoBtn');
  var clearBtn = document.getElementById('clearBtn');
  var saveBtn = document.getElementById('saveBtn');

  var drawing = false;
  var erasing = false;
  var history = [];
  var bgColor = '#1a1a2e';

  function resize() {
    var wrap = canvas.parentElement;
    var w = wrap.clientWidth;
    var h = Math.round(w * 0.65);
    canvas.width = w;
    canvas.height = h;
    canvas.style.height = h + 'px';
    redraw();
  }

  function saveState() {
    history.push(canvas.toDataURL());
    if (history.length > 30) history.shift();
  }

  function redraw() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (history.length > 0) {
      var img = new Image();
      img.src = history[history.length - 1];
      img.onload = function () { ctx.drawImage(img, 0, 0); };
    }
  }

  function getPos(e) {
    var rect = canvas.getBoundingClientRect();
    var x, y;
    if (e.touches) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    return { x: x, y: y };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    var pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    var pos = getPos(e);
    ctx.lineWidth = parseInt(brushSize.value, 10);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (erasing) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = colorPicker.value;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function endDraw() {
    if (!drawing) return;
    drawing = false;
    ctx.closePath();
    ctx.globalCompositeOperation = 'source-over';
    saveState();
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchstart', startDraw);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', endDraw);

  brushSize.addEventListener('input', function () {
    sizeLabel.textContent = brushSize.value;
  });

  penTool.addEventListener('click', function () {
    erasing = false;
    penTool.classList.add('active');
    eraserTool.classList.remove('active');
  });

  eraserTool.addEventListener('click', function () {
    erasing = true;
    eraserTool.classList.add('active');
    penTool.classList.remove('active');
  });

  undoBtn.addEventListener('click', function () {
    if (history.length === 0) return;
    history.pop();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (history.length > 0) {
      var img = new Image();
      img.src = history[history.length - 1];
      img.onload = function () { ctx.drawImage(img, 0, 0); };
    }
  });

  clearBtn.addEventListener('click', function () {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    history = [];
  });

  saveBtn.addEventListener('click', function () {
    var link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  });

  window.addEventListener('resize', resize);
  resize();
  saveState();
});
