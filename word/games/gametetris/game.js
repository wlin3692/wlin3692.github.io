(function () {
  'use strict';

  var COLS = 10;
  var ROWS = 20;
  var STORAGE = {
    best: 'xiaolin-tetris-best',
    theme: 'xiaolin-tetris-theme',
    sound: 'xiaolin-tetris-sound'
  };

  var PIECES = [
    { name: 'I', size: 4, blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: '#32c7d9' },
    { name: 'J', size: 3, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: '#3f6fdb' },
    { name: 'L', size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: '#f2923d' },
    { name: 'O', size: 2, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: '#f4c542' },
    { name: 'S', size: 3, blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: '#58b957' },
    { name: 'T', size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: '#a766d1' },
    { name: 'Z', size: 3, blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: '#e35757' }
  ];

  var boardCanvas = document.getElementById('board');
  var boardContext = boardCanvas.getContext('2d');
  var nextCanvas = document.getElementById('next');
  var nextContext = nextCanvas.getContext('2d');
  var scoreElement = document.getElementById('score');
  var bestElement = document.getElementById('best');
  var levelElement = document.getElementById('level');
  var linesElement = document.getElementById('lines');
  var statusElement = document.getElementById('status');
  var overlay = document.getElementById('gameOverlay');
  var overlayTag = document.getElementById('overlayTag');
  var overlayTitle = document.getElementById('overlayTitle');
  var overlayAction = document.getElementById('overlayAction');
  var pauseButton = document.getElementById('pauseButton');
  var restartButton = document.getElementById('restartButton');
  var soundToggle = document.getElementById('soundToggle');
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  var board = createBoard();
  var bag = [];
  var current = null;
  var next = null;
  var playing = false;
  var paused = false;
  var ended = false;
  var score = 0;
  var best = readNumber(STORAGE.best);
  var lines = 0;
  var level = 1;
  var accumulator = 0;
  var lastFrame = performance.now();
  var boardSize = { width: 300, height: 600 };
  var nextSize = { width: 120, height: 120 };
  var soundEnabled = readBoolean(STORAGE.sound, true);
  var audioContext = null;
  var repeatTimer = 0;
  var repeatInterval = 0;

  function createBoard() {
    return Array.from({ length: ROWS }, function () {
      return Array(COLS).fill(null);
    });
  }

  function readNumber(key) {
    try {
      var value = parseInt(localStorage.getItem(key), 10);
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function readBoolean(key, fallback) {
    try {
      var value = localStorage.getItem(key);
      return value === null ? fallback : value !== 'false';
    } catch (error) {
      return fallback;
    }
  }

  function store(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      // The game remains playable when storage is unavailable.
    }
  }

  function shuffle(values) {
    for (var index = values.length - 1; index > 0; index -= 1) {
      var randomIndex = Math.floor(Math.random() * (index + 1));
      var swap = values[index];
      values[index] = values[randomIndex];
      values[randomIndex] = swap;
    }
    return values;
  }

  function takeType() {
    if (!bag.length) bag = shuffle(PIECES.slice());
    return bag.pop();
  }

  function makePiece(type) {
    return {
      type: type,
      direction: 0,
      x: Math.floor((COLS - type.size) / 2),
      y: 0
    };
  }

  function eachBlock(piece, callback) {
    var bit = 0x8000;
    var row = 0;
    var column = 0;
    var shape = piece.type.blocks[piece.direction];
    while (bit > 0) {
      if (shape & bit) callback(piece.x + column, piece.y + row, column, row);
      bit >>= 1;
      column += 1;
      if (column === 4) {
        column = 0;
        row += 1;
      }
    }
  }

  function collides(piece) {
    var hit = false;
    eachBlock(piece, function (x, y) {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS || board[y][x]) hit = true;
    });
    return hit;
  }

  function newGame() {
    board = createBoard();
    bag = [];
    current = null;
    next = makePiece(takeType());
    score = 0;
    lines = 0;
    level = 1;
    accumulator = 0;
    ended = false;
    paused = false;
    playing = true;
    spawnPiece();
    closeOverlay();
    updateStatus('进行中');
    updateNumbers();
    setPauseLabel(false);
    tone(420, .05, .035);
  }

  function spawnPiece() {
    current = next || makePiece(takeType());
    next = makePiece(takeType());
    if (collides(current)) finishGame();
  }

  function finishGame() {
    playing = false;
    paused = false;
    ended = true;
    updateBest();
    updateStatus('已结束');
    openOverlay('GAME OVER', '本局结束', '再来一局');
    setPauseLabel(false);
    tone(130, .24, .06);
  }

  function updateBest() {
    if (score > best) {
      best = score;
      store(STORAGE.best, best);
    }
  }

  function updateNumbers() {
    updateBest();
    scoreElement.textContent = score.toLocaleString('zh-CN');
    bestElement.textContent = best.toLocaleString('zh-CN');
    levelElement.textContent = level;
    linesElement.textContent = lines;
  }

  function updateStatus(value) {
    statusElement.textContent = value;
  }

  function dropInterval() {
    return Math.max(90, 760 - ((level - 1) * 65));
  }

  function move(dx, dy) {
    if (!current) return false;
    var moved = {
      type: current.type,
      direction: current.direction,
      x: current.x + dx,
      y: current.y + dy
    };
    if (collides(moved)) return false;
    current = moved;
    return true;
  }

  function rotate() {
    if (!current) return;
    var direction = (current.direction + 1) % 4;
    var kicks = [0, -1, 1, -2, 2];
    for (var index = 0; index < kicks.length; index += 1) {
      var rotated = {
        type: current.type,
        direction: direction,
        x: current.x + kicks[index],
        y: current.y
      };
      if (!collides(rotated)) {
        current = rotated;
        tone(520, .025, .018);
        return;
      }
    }
  }

  function stepDown(reward) {
    if (move(0, 1)) {
      if (reward) {
        score += 1;
        updateNumbers();
      }
      return true;
    }
    lockPiece();
    return false;
  }

  function hardDrop() {
    var distance = 0;
    while (move(0, 1)) distance += 1;
    score += distance * 2;
    lockPiece();
    tone(210, .045, .035);
  }

  function lockPiece() {
    if (!current || ended) return;
    eachBlock(current, function (x, y) {
      if (y >= 0 && y < ROWS) board[y][x] = current.type.color;
    });
    clearLines();
    spawnPiece();
    accumulator = 0;
    updateNumbers();
  }

  function clearLines() {
    var remaining = board.filter(function (row) {
      return !row.every(Boolean);
    });
    var count = ROWS - remaining.length;
    if (!count) return;
    while (remaining.length < ROWS) remaining.unshift(Array(COLS).fill(null));
    board = remaining;
    score += [0, 100, 300, 500, 800][count] * level;
    lines += count;
    level = Math.floor(lines / 10) + 1;
    tone(count === 4 ? 760 : 650, .12, .055);
  }

  function performAction(action) {
    if (!playing || paused || ended) return;
    if (action === 'left') move(-1, 0);
    if (action === 'right') move(1, 0);
    if (action === 'down') stepDown(true);
    if (action === 'rotate') rotate();
    if (action === 'drop') hardDrop();
  }

  function setPaused(value) {
    if (!playing || ended) return;
    paused = value;
    setPauseLabel(paused);
    if (paused) {
      updateStatus('已暂停');
      openOverlay('PAUSED', '游戏暂停', '继续游戏');
    } else {
      accumulator = 0;
      lastFrame = performance.now();
      updateStatus('进行中');
      closeOverlay();
      tone(430, .04, .025);
    }
  }

  function setPauseLabel(isPaused) {
    pauseButton.setAttribute('aria-label', isPaused ? '继续游戏' : '暂停游戏');
    pauseButton.setAttribute('title', isPaused ? '继续游戏' : '暂停游戏');
    pauseButton.firstElementChild.innerHTML = isPaused ? '&#9654;' : '&#8545;';
  }

  function openOverlay(tag, title, action) {
    overlayTag.textContent = tag;
    overlayTitle.textContent = title;
    overlayAction.textContent = action;
    overlay.classList.add('open');
  }

  function closeOverlay() {
    overlay.classList.remove('open');
  }

  function initAudio() {
    if (!soundEnabled || audioContext) return;
    var AudioApi = window.AudioContext || window.webkitAudioContext;
    if (AudioApi) audioContext = new AudioApi();
  }

  function tone(frequency, duration, volume) {
    if (!soundEnabled) return;
    initAudio();
    if (!audioContext) return;
    if (audioContext.state === 'suspended') audioContext.resume();
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  }

  function setSound(enabled, silent) {
    soundEnabled = enabled;
    store(STORAGE.sound, soundEnabled);
    soundToggle.classList.toggle('active', soundEnabled);
    soundToggle.setAttribute('aria-label', soundEnabled ? '关闭音效' : '开启音效');
    soundToggle.setAttribute('title', soundEnabled ? '关闭音效' : '开启音效');
    soundToggle.firstElementChild.textContent = soundEnabled ? '\u266A' : '\u00D7';
    if (soundEnabled && !silent) tone(580, .04, .025);
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    store(STORAGE.theme, theme);
    var dark = theme === 'dark';
    themeToggle.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
    themeToggle.setAttribute('title', dark ? '切换到浅色模式' : '切换到深色模式');
    themeMeta.setAttribute('content', dark ? '#101512' : '#eef1ec');
  }

  function resizeCanvas(canvas, context) {
    var rect = canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(1, Math.round(rect.width));
    var height = Math.max(1, Math.round(rect.height));
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { width: width, height: height };
  }

  function drawBlock(context, x, y, unitX, unitY, color, alpha) {
    var gap = Math.max(1, Math.min(unitX, unitY) * .055);
    context.save();
    context.globalAlpha = alpha === undefined ? 1 : alpha;
    context.fillStyle = color;
    context.fillRect((x * unitX) + gap, (y * unitY) + gap, unitX - (gap * 2), unitY - (gap * 2));
    context.strokeStyle = 'rgba(0, 0, 0, .28)';
    context.lineWidth = 1;
    context.strokeRect((x * unitX) + gap + .5, (y * unitY) + gap + .5, unitX - (gap * 2) - 1, unitY - (gap * 2) - 1);
    context.fillStyle = 'rgba(255, 255, 255, .2)';
    context.fillRect((x * unitX) + (gap * 1.7), (y * unitY) + (gap * 1.7), unitX - (gap * 3.4), Math.max(1, unitY * .06));
    context.restore();
  }

  function drawBoard() {
    boardSize = resizeCanvas(boardCanvas, boardContext);
    var styles = getComputedStyle(document.documentElement);
    var unitX = boardSize.width / COLS;
    var unitY = boardSize.height / ROWS;
    boardContext.fillStyle = styles.getPropertyValue('--board').trim();
    boardContext.fillRect(0, 0, boardSize.width, boardSize.height);

    boardContext.beginPath();
    boardContext.strokeStyle = styles.getPropertyValue('--grid').trim();
    boardContext.lineWidth = 1;
    for (var x = 1; x < COLS; x += 1) {
      boardContext.moveTo(Math.round(x * unitX) + .5, 0);
      boardContext.lineTo(Math.round(x * unitX) + .5, boardSize.height);
    }
    for (var y = 1; y < ROWS; y += 1) {
      boardContext.moveTo(0, Math.round(y * unitY) + .5);
      boardContext.lineTo(boardSize.width, Math.round(y * unitY) + .5);
    }
    boardContext.stroke();

    board.forEach(function (row, y) {
      row.forEach(function (color, x) {
        if (color) drawBlock(boardContext, x, y, unitX, unitY, color);
      });
    });

    if (current) {
      var ghost = {
        type: current.type,
        direction: current.direction,
        x: current.x,
        y: current.y
      };
      while (!collides({ type: ghost.type, direction: ghost.direction, x: ghost.x, y: ghost.y + 1 })) ghost.y += 1;
      if (ghost.y !== current.y) {
        eachBlock(ghost, function (x, y) {
          drawBlock(boardContext, x, y, unitX, unitY, ghost.type.color, .2);
        });
      }
      eachBlock(current, function (x, y) {
        drawBlock(boardContext, x, y, unitX, unitY, current.type.color);
      });
    }
  }

  function drawNext() {
    nextSize = resizeCanvas(nextCanvas, nextContext);
    nextContext.clearRect(0, 0, nextSize.width, nextSize.height);
    if (!next) return;
    var unit = Math.min(nextSize.width, nextSize.height) / 5;
    var offsetX = ((nextSize.width / unit) - next.type.size) / 2;
    var offsetY = ((nextSize.height / unit) - next.type.size) / 2;
    var preview = {
      type: next.type,
      direction: next.direction,
      x: offsetX,
      y: offsetY
    };
    eachBlock(preview, function (x, y) {
      drawBlock(nextContext, x, y, unit, unit, next.type.color);
    });
  }

  function frame(now) {
    var delta = Math.min(200, now - lastFrame);
    lastFrame = now;
    if (playing && !paused && !ended) {
      accumulator += delta;
      if (accumulator >= dropInterval()) {
        accumulator -= dropInterval();
        stepDown(false);
      }
    }
    drawBoard();
    drawNext();
    requestAnimationFrame(frame);
  }

  function clearRepeat() {
    window.clearTimeout(repeatTimer);
    window.clearInterval(repeatInterval);
    repeatTimer = 0;
    repeatInterval = 0;
  }

  document.querySelectorAll('[data-action]').forEach(function (button) {
    button.addEventListener('pointerdown', function (event) {
      event.preventDefault();
      initAudio();
      var action = button.dataset.action;
      performAction(action);
      clearRepeat();
      if (action === 'left' || action === 'right' || action === 'down') {
        repeatTimer = window.setTimeout(function () {
          repeatInterval = window.setInterval(function () {
            performAction(action);
          }, 70);
        }, 180);
      }
    });
    button.addEventListener('pointerup', clearRepeat);
    button.addEventListener('pointercancel', clearRepeat);
    button.addEventListener('pointerleave', clearRepeat);
  });

  document.addEventListener('keydown', function (event) {
    var action = null;
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') action = 'left';
    if (event.code === 'ArrowRight' || event.code === 'KeyD') action = 'right';
    if (event.code === 'ArrowDown' || event.code === 'KeyS') action = 'down';
    if (event.code === 'ArrowUp' || event.code === 'KeyW') action = 'rotate';
    if (event.code === 'Space' && playing && !paused) action = 'drop';
    if (action) {
      event.preventDefault();
      initAudio();
      performAction(action);
      return;
    }
    if (event.code === 'Space' && !playing) {
      event.preventDefault();
      initAudio();
      newGame();
    }
    if (event.code === 'KeyP' || event.code === 'Escape') {
      event.preventDefault();
      setPaused(!paused);
    }
  });

  overlayAction.addEventListener('click', function () {
    initAudio();
    if (paused) setPaused(false);
    else newGame();
  });

  pauseButton.addEventListener('click', function () {
    initAudio();
    setPaused(!paused);
  });

  restartButton.addEventListener('click', function () {
    initAudio();
    newGame();
  });

  soundToggle.addEventListener('click', function () {
    if (!soundEnabled) initAudio();
    setSound(!soundEnabled);
  });

  themeToggle.addEventListener('click', function () {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && playing && !paused && !ended) setPaused(true);
  });

  window.addEventListener('resize', function () {
    drawBoard();
    drawNext();
  });

  setTheme(document.documentElement.dataset.theme || 'light');
  setSound(soundEnabled, true);
  updateNumbers();
  updateStatus('待机');
  requestAnimationFrame(frame);

  window.TetrisGame = {
    newGame: newGame,
    pause: function () { setPaused(true); },
    resume: function () { setPaused(false); },
    action: performAction,
    state: function () {
      return { score: score, best: best, level: level, lines: lines, playing: playing, paused: paused, ended: ended };
    }
  };
}());
