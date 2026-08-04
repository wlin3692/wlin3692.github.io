const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const canvasWrap = document.getElementById('canvasWrap');
const emptyHint = document.getElementById('emptyHint');
const status = document.getElementById('canvasStatus');
const brushTool = document.getElementById('brushTool');
const eraserTool = document.getElementById('eraserTool');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const clearButton = document.getElementById('clearButton');
const downloadButton = document.getElementById('downloadButton');
const gridButton = document.getElementById('gridButton');
const sizeInput = document.getElementById('brushSize');
const sizeOutput = document.getElementById('sizeOutput');
const colorPicker = document.getElementById('colorPicker');
const swatches = Array.from(document.querySelectorAll('.swatch'));

let drawing = false;
let hasDrawing = false;
let lastPoint = null;
let mode = 'brush';
let brushSize = Number(sizeInput.value);
let color = colorPicker.value;
let history = [];
let historyIndex = -1;

function fillCanvas() {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function pointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height,
    pressure: event.pressure > 0 ? event.pressure : 0.5
  };
}

function applyStrokeStyle(pressure) {
  ctx.strokeStyle = mode === 'eraser' ? '#ffffff' : color;
  ctx.fillStyle = ctx.strokeStyle;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = brushSize * (0.75 + pressure * 0.5);
}

function drawDot(point) {
  applyStrokeStyle(point.pressure);
  ctx.beginPath();
  ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawSegment(from, to) {
  applyStrokeStyle(to.pressure);
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function updateHistoryButtons() {
  undoButton.disabled = historyIndex <= 0;
  redoButton.disabled = historyIndex >= history.length - 1;
}

function pushHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push({ src: canvas.toDataURL('image/png'), hasDrawing: hasDrawing });
  if (history.length > 24) history.shift();
  historyIndex = history.length - 1;
  updateHistoryButtons();
}

function restoreHistory(index) {
  if (index < 0 || index >= history.length) return;
  const image = new Image();
  image.onload = function () {
    fillCanvas();
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    historyIndex = index;
    hasDrawing = history[index].hasDrawing;
    emptyHint.classList.toggle('hidden', hasDrawing);
    updateHistoryButtons();
  };
  image.src = history[index].src;
}

function setMode(nextMode) {
  mode = nextMode;
  const brushActive = mode === 'brush';
  brushTool.classList.toggle('active', brushActive);
  eraserTool.classList.toggle('active', !brushActive);
  brushTool.setAttribute('aria-pressed', String(brushActive));
  eraserTool.setAttribute('aria-pressed', String(!brushActive));
  status.textContent = (brushActive ? '画笔' : '橡皮擦') + ' · ' + brushSize + ' px';
}

function selectColor(nextColor) {
  color = nextColor;
  colorPicker.value = nextColor;
  swatches.forEach(function (swatch) {
    const active = swatch.dataset.color.toLowerCase() === nextColor.toLowerCase();
    swatch.classList.toggle('active', active);
    swatch.setAttribute('aria-pressed', String(active));
  });
  setMode('brush');
}

canvas.addEventListener('pointerdown', function (event) {
  if (event.button !== undefined && event.button !== 0) return;
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  drawing = true;
  lastPoint = pointFromEvent(event);
  drawDot(lastPoint);
  hasDrawing = true;
  emptyHint.classList.add('hidden');
});

canvas.addEventListener('pointermove', function (event) {
  if (!drawing) return;
  event.preventDefault();
  const samples = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
  samples.forEach(function (sample) {
    const nextPoint = pointFromEvent(sample);
    drawSegment(lastPoint, nextPoint);
    lastPoint = nextPoint;
  });
});

function finishStroke(event) {
  if (!drawing) return;
  drawing = false;
  lastPoint = null;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  pushHistory();
}

canvas.addEventListener('pointerup', finishStroke);
canvas.addEventListener('pointercancel', finishStroke);
brushTool.addEventListener('click', function () { setMode('brush'); });
eraserTool.addEventListener('click', function () { setMode('eraser'); });

sizeInput.addEventListener('input', function () {
  brushSize = Number(sizeInput.value);
  sizeOutput.value = String(brushSize);
  sizeOutput.textContent = String(brushSize);
  setMode(mode);
});

swatches.forEach(function (swatch) {
  swatch.addEventListener('click', function () { selectColor(swatch.dataset.color); });
});
colorPicker.addEventListener('input', function () { selectColor(colorPicker.value); });
undoButton.addEventListener('click', function () { restoreHistory(historyIndex - 1); });
redoButton.addEventListener('click', function () { restoreHistory(historyIndex + 1); });

clearButton.addEventListener('click', function () {
  fillCanvas();
  hasDrawing = false;
  emptyHint.classList.remove('hidden');
  pushHistory();
});

gridButton.addEventListener('click', function () {
  const active = canvasWrap.classList.toggle('grid');
  gridButton.classList.toggle('active', active);
  gridButton.setAttribute('aria-pressed', String(active));
  gridButton.setAttribute('aria-label', active ? '隐藏网格' : '显示网格');
});

downloadButton.addEventListener('click', function () {
  const link = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  link.download = 'xiaolin-sketch-' + stamp + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

window.addEventListener('keydown', function (event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    restoreHistory(historyIndex + (event.shiftKey ? 1 : -1));
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    downloadButton.click();
  }
  if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'e') setMode('eraser');
  if (!event.ctrlKey && !event.metaKey && event.key.toLowerCase() === 'b') setMode('brush');
});

fillCanvas();
pushHistory();
setMode('brush');
