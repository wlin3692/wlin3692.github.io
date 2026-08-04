const wordElement = document.getElementById('word');
const input = document.getElementById('text');
const timeElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const accuracyElement = document.getElementById('accuracy');
const streakElement = document.getElementById('streak');
const bestElement = document.getElementById('best');
const stateText = document.getElementById('stateText');
const liveMark = document.querySelector('.live-mark');
const progressBar = document.getElementById('progressBar');
const startButton = document.getElementById('startButton');
const resultPanel = document.getElementById('resultPanel');
const resultWords = document.getElementById('resultWords');
const resultAccuracy = document.getElementById('resultAccuracy');
const resultTitle = document.getElementById('resultTitle');
const restartButton = document.getElementById('restartButton');
const settingsButton = document.getElementById('settingsButton');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');
const durationSelect = document.getElementById('duration');

const words = ['design', 'canvas', 'motion', 'create', 'future', 'studio', 'layout', 'visual', 'bright', 'system', 'focus', 'pixel', 'circle', 'signal', 'craft', 'shape', 'color', 'space', 'flow', 'idea', 'build', 'skill', 'route', 'dream'];
const bestKey = 'xiaolin-typing-best';
let currentWord = '';
let seconds = Number(durationSelect.value);
let timeLeft = seconds;
let score = 0;
let streak = 0;
let completed = 0;
let correctChars = 0;
let mistakes = 0;
let previousText = '';
let timer = null;
let running = false;

function randomWord() {
  let next = words[Math.floor(Math.random() * words.length)];
  while (next === currentWord && words.length > 1) next = words[Math.floor(Math.random() * words.length)];
  return next;
}

function setWord() {
  currentWord = randomWord();
  wordElement.textContent = currentWord;
  input.value = '';
  previousText = '';
}

function accuracy() {
  const total = correctChars + mistakes;
  return total ? Math.round(correctChars / total * 100) : 100;
}

function updateStats() {
  timeElement.textContent = String(timeLeft);
  scoreElement.textContent = String(score);
  accuracyElement.textContent = String(accuracy());
  streakElement.textContent = String(streak);
  progressBar.style.transform = 'scaleX(' + Math.max(timeLeft / seconds, 0) + ')';
}

function startGame() {
  if (running) return;
  if (!currentWord) setWord();
  running = true;
  resultPanel.hidden = true;
  input.disabled = false;
  startButton.textContent = '训练中…';
  startButton.disabled = true;
  stateText.textContent = '进行中';
  liveMark.classList.add('running');
  input.focus();
  timer = window.setInterval(function () {
    timeLeft -= 1;
    updateStats();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function resetGame() {
  window.clearInterval(timer);
  running = false;
  seconds = Number(durationSelect.value);
  timeLeft = seconds;
  score = 0;
  streak = 0;
  completed = 0;
  correctChars = 0;
  mistakes = 0;
  input.value = '';
  currentWord = '';
  input.disabled = false;
  startButton.disabled = false;
  startButton.textContent = '开始训练';
  stateText.textContent = '准备开始';
  liveMark.classList.remove('running');
  wordElement.textContent = '准备好了吗？';
  updateStats();
}

function endGame() {
  window.clearInterval(timer);
  running = false;
  input.disabled = true;
  startButton.disabled = false;
  startButton.textContent = '再来一局';
  stateText.textContent = '本轮结束';
  liveMark.classList.remove('running');
  resultWords.textContent = String(completed);
  resultAccuracy.textContent = String(accuracy());
  resultTitle.textContent = score >= Number(bestElement.textContent) && score > 0 ? '新的最佳成绩' : '训练完成';
  const best = Math.max(score, Number(bestElement.textContent));
  bestElement.textContent = String(best);
  localStorage.setItem(bestKey, String(best));
  resultPanel.hidden = false;
}

input.addEventListener('input', function () {
  if (!running) startGame();
  const value = input.value;
  if (value.length > previousText.length) {
    const typedChar = value[value.length - 1];
    if (typedChar === currentWord[value.length - 1]) correctChars += 1;
    else { mistakes += 1; streak = 0; }
  }
  previousText = value;
  if (value === currentWord) {
    completed += 1;
    streak += 1;
    score += 1 + Math.floor(streak / 5);
    setWord();
  }
  updateStats();
});

startButton.addEventListener('click', function () {
  if (!running && timeLeft < seconds) resetGame();
  startGame();
});
restartButton.addEventListener('click', resetGame);
durationSelect.addEventListener('change', resetGame);
settingsButton.addEventListener('click', function () { settingsPanel.hidden = !settingsPanel.hidden; });
closeSettings.addEventListener('click', function () { settingsPanel.hidden = true; });

bestElement.textContent = localStorage.getItem(bestKey) || '0';
durationSelect.value = localStorage.getItem('xiaolin-typing-duration') || '45';
durationSelect.addEventListener('change', function () { localStorage.setItem('xiaolin-typing-duration', durationSelect.value); });
resetGame();
