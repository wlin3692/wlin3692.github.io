const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const livesElement = document.getElementById('lives');
const bestElement = document.getElementById('best');
const statusText = document.getElementById('statusText');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

const width = canvas.width;
const height = canvas.height;
const paddle = { x: width / 2 - 58, y: height - 40, w: 116, h: 12, speed: 8, target: width / 2 };
const ball = { x: width / 2, y: height - 65, r: 8, vx: 4, vy: -5 };
const keys = { left: false, right: false };
const palette = ['#4fdbed', '#ff6378', '#ffd166', '#7adf9f', '#b395e9', '#ef8354', '#4f9de8'];
let bricks = [];
let score = 0;
let level = 1;
let lives = 3;
let mode = 'ready';
let lastFrame = 0;
let best = Number(localStorage.getItem('xiaolin-breakout-best') || 0);

bestElement.textContent = String(best);

function createBricks() {
  bricks = [];
  const rows = Math.min(4 + level, 7);
  const cols = 9;
  const gap = 8;
  const brickW = 70;
  const brickH = 20;
  const startX = (width - (cols * brickW + (cols - 1) * gap)) / 2;
  const startY = 75;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      bricks.push({ x: startX + col * (brickW + gap), y: startY + row * (brickH + gap), w: brickW, h: brickH, alive: true, color: palette[row % palette.length] });
    }
  }
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height - 65;
  ball.vx = (Math.random() > .5 ? 1 : -1) * (4 + level * .25);
  ball.vy = -(5 + level * .3);
  paddle.x = width / 2 - paddle.w / 2;
  paddle.target = width / 2;
}

function resetGame() {
  score = 0;
  level = 1;
  lives = 3;
  mode = 'ready';
  createBricks();
  resetBall();
  startButton.textContent = '开始游戏';
  statusText.textContent = '点击开始，准备发球';
  updateHud();
}

function updateHud() {
  scoreElement.textContent = String(score);
  levelElement.textContent = String(level);
  livesElement.textContent = String(lives);
}

function startGame() {
  if (mode === 'over') resetGame();
  if (mode === 'playing') return;
  mode = 'playing';
  startButton.textContent = '进行中…';
  statusText.textContent = '保持球拍移动';
}

function togglePause() {
  if (mode === 'playing') {
    mode = 'paused';
    statusText.textContent = '已暂停';
    pauseButton.textContent = '▶';
  } else if (mode === 'paused') {
    mode = 'playing';
    statusText.textContent = '保持球拍移动';
    pauseButton.textContent = 'Ⅱ';
  }
}

function drawBackground() {
  ctx.fillStyle = '#030b12';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(79,219,237,.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
}

function drawPaddle() {
  ctx.fillStyle = '#4fdbed';
  ctx.shadowColor = '#4fdbed';
  ctx.shadowBlur = 14;
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.shadowBlur = 0;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd166';
  ctx.shadowColor = '#ffd166';
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawBricks() {
  bricks.forEach((brick) => {
    if (!brick.alive) return;
    ctx.fillStyle = brick.color;
    ctx.globalAlpha = .88;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    ctx.globalAlpha = 1;
  });
}

function drawOverlay(title, subtitle) {
  ctx.fillStyle = 'rgba(3,11,18,.76)';
  ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#e5f6fa';
  ctx.font = '700 34px system-ui, sans-serif';
  ctx.fillText(title, width / 2, height / 2 - 14);
  ctx.fillStyle = '#83a6b2';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(subtitle, width / 2, height / 2 + 24);
}

function draw() {
  drawBackground();
  drawBricks();
  drawPaddle();
  drawBall();
  if (mode === 'ready') drawOverlay('准备开始', '点击“开始游戏”或按空格键');
  if (mode === 'paused') drawOverlay('已暂停', '按暂停按钮或空格键继续');
  if (mode === 'over') drawOverlay('游戏结束', '最终得分 ' + score + ' · 点击重新开始');
}

function movePaddle() {
  if (keys.left) paddle.x -= paddle.speed;
  if (keys.right) paddle.x += paddle.speed;
  if (!keys.left && !keys.right) paddle.x += (paddle.target - (paddle.x + paddle.w / 2)) * .18;
  paddle.x = Math.max(0, Math.min(width - paddle.w, paddle.x));
}

function circleHitsRect(circle, rect) {
  const nearX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const nearY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - nearX;
  const dy = circle.y - nearY;
  return dx * dx + dy * dy < circle.r * circle.r;
}

function update() {
  if (mode !== 'playing') return;
  movePaddle();
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.x - ball.r <= 0 || ball.x + ball.r >= width) { ball.vx *= -1; ball.x = Math.max(ball.r, Math.min(width - ball.r, ball.x)); }
  if (ball.y - ball.r <= 0) { ball.vy = Math.abs(ball.vy); ball.y = ball.r; }
  if (ball.vy > 0 && circleHitsRect(ball, paddle)) {
    const offset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
    ball.vx = offset * 6;
    ball.vy = -Math.abs(ball.vy);
    ball.y = paddle.y - ball.r - 1;
  }
  for (const brick of bricks) {
    if (!brick.alive || !circleHitsRect(ball, brick)) continue;
    brick.alive = false;
    ball.vy *= -1;
    score += 10 * level;
    updateHud();
    break;
  }
  if (ball.y - ball.r > height) {
    lives -= 1;
    updateHud();
    if (lives <= 0) {
      mode = 'over';
      startButton.textContent = '重新开始';
      statusText.textContent = '本轮结束';
      best = Math.max(best, score);
      bestElement.textContent = String(best);
      localStorage.setItem('xiaolin-breakout-best', String(best));
    } else {
      mode = 'ready';
      resetBall();
      startButton.textContent = '继续游戏';
      statusText.textContent = '球已准备好，继续挑战';
    }
  }
  if (bricks.every((brick) => !brick.alive)) {
    level += 1;
    score += 100;
    createBricks();
    resetBall();
    updateHud();
    statusText.textContent = '第 ' + level + ' 关';
  }
}

function frame(timestamp) {
  if (timestamp - lastFrame > 32) { update(); lastFrame = timestamp; }
  draw();
  requestAnimationFrame(frame);
}

function moveTarget(event) {
  const rect = canvas.getBoundingClientRect();
  paddle.target = (event.clientX - rect.left) * width / rect.width;
}

canvas.addEventListener('pointermove', moveTarget);
canvas.addEventListener('pointerdown', function (event) { moveTarget(event); if (mode === 'ready' || mode === 'over') startGame(); });
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);
resetButton.addEventListener('click', resetGame);
window.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') { keys.left = true; event.preventDefault(); }
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') { keys.right = true; event.preventDefault(); }
  if (event.key === ' ') { if (mode === 'ready' || mode === 'over') startGame(); else togglePause(); event.preventDefault(); }
});
window.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') keys.left = false;
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') keys.right = false;
});

resetGame();
requestAnimationFrame(frame);
