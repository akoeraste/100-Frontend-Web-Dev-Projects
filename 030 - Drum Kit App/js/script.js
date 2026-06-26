document.addEventListener('DOMContentLoaded', function () {
  var volumeEl = document.getElementById('volume');
  var pads = document.querySelectorAll('.pad');
  var audioCtx = null;

  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function getVolume() {
    return volumeEl.value / 100;
  }

  function noise(ctx, duration) {
    var len = ctx.sampleRate * duration;
    var buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    return src;
  }

  var sounds = {
    kick: function () {
      var ctx = getCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(getVolume(), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    },
    snare: function () {
      var ctx = getCtx();
      var n = noise(ctx, 0.2);
      var nGain = ctx.createGain();
      var filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      nGain.gain.setValueAtTime(getVolume() * 0.6, ctx.currentTime);
      nGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      n.connect(filter);
      filter.connect(nGain);
      nGain.connect(ctx.destination);
      n.start(ctx.currentTime);

      var osc = ctx.createOscillator();
      var oGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      oGain.gain.setValueAtTime(getVolume() * 0.7, ctx.currentTime);
      oGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(oGain);
      oGain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    },
    hihat: function () {
      var ctx = getCtx();
      var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
      var fundamental = 40;
      ratios.forEach(function (r) {
        var osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = fundamental * r;
        var gain = ctx.createGain();
        gain.gain.setValueAtTime(getVolume() * 0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        var bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 10000;
        osc.connect(bp);
        bp.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
      });
    },
    openhat: function () {
      var ctx = getCtx();
      var n = noise(ctx, 0.4);
      var gain = ctx.createGain();
      var hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 6000;
      gain.gain.setValueAtTime(getVolume() * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      n.connect(hp);
      hp.connect(gain);
      gain.connect(ctx.destination);
      n.start(ctx.currentTime);
    },
    tom1: function () {
      var ctx = getCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(getVolume(), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    },
    tom2: function () {
      var ctx = getCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(getVolume(), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    },
    clap: function () {
      var ctx = getCtx();
      for (var i = 0; i < 3; i++) {
        (function (delay) {
          var n = noise(ctx, 0.04);
          var gain = ctx.createGain();
          var bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.value = 2500;
          gain.gain.setValueAtTime(getVolume() * 0.7, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.04);
          n.connect(bp);
          bp.connect(gain);
          gain.connect(ctx.destination);
          n.start(ctx.currentTime + delay);
        })(i * 0.025);
      }
      var tail = noise(ctx, 0.15);
      var tGain = ctx.createGain();
      var tBp = ctx.createBiquadFilter();
      tBp.type = 'bandpass';
      tBp.frequency.value = 2500;
      tGain.gain.setValueAtTime(getVolume() * 0.5, ctx.currentTime + 0.075);
      tGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      tail.connect(tBp);
      tBp.connect(tGain);
      tGain.connect(ctx.destination);
      tail.start(ctx.currentTime + 0.075);
    },
    rim: function () {
      var ctx = getCtx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(getVolume() * 0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    },
    crash: function () {
      var ctx = getCtx();
      var n = noise(ctx, 0.8);
      var gain = ctx.createGain();
      var hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 4000;
      gain.gain.setValueAtTime(getVolume() * 0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      n.connect(hp);
      hp.connect(gain);
      gain.connect(ctx.destination);
      n.start(ctx.currentTime);
    }
  };

  function playPad(pad) {
    var sound = pad.dataset.sound;
    if (sounds[sound]) sounds[sound]();
    pad.classList.add('active');
    setTimeout(function () { pad.classList.remove('active'); }, 150);
  }

  pads.forEach(function (pad) {
    pad.addEventListener('click', function () { playPad(pad); });
  });

  document.addEventListener('keydown', function (e) {
    var key = e.key.toUpperCase();
    var pad = document.querySelector('.pad[data-key="' + key + '"]');
    if (pad) playPad(pad);
  });
});
