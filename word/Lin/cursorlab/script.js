import { rainbowCursor, bubbleCursor, emojiCursor, fairyDustCursor } from './src/index.js';

const stage = document.getElementById('effectStage');
const effectInput = document.getElementById('effectInput');
const themeInput = document.getElementById('themeInput');
const emojiInput = document.getElementById('emojiInput');
const reduceInput = document.getElementById('reduceInput');
const restartButton = document.getElementById('restartButton');
const effectName = document.getElementById('effectName');
const effectStatus = document.getElementById('effectStatus');
let activeEffect = null;

const names = { rainbow: '彩虹轨迹', bubble: '气泡粒子', emoji: '表情雨', fairy: '魔法尘埃' };
const themes = {
  warm: { colors: ['#ff5f6d', '#ffc371', '#ffe66d'], fill: '#ff9f68', stroke: '#ffe66d' },
  cool: { colors: ['#66e3c4', '#7aa2ff', '#c4a7e7'], fill: '#66e3c4', stroke: '#b7f5ea' },
  mono: { colors: ['#f4f4f4', '#a9b2bb', '#66717c'], fill: '#d8e1e8', stroke: '#fff' }
};

function destroyActive() {
  if (!activeEffect) return;
  try { activeEffect.destroy(); } catch (error) { /* Effect may already be inactive. */ }
  activeEffect = null;
}

function renderEffect() {
  destroyActive();
  const type = effectInput.value;
  const theme = themes[themeInput.value];
  const shared = { element: stage, zIndex: '-1' };
  if (type === 'rainbow') activeEffect = new rainbowCursor({ ...shared, colors: theme.colors, size: 3, length: 18 });
  if (type === 'bubble') activeEffect = new bubbleCursor({ ...shared, fillColor: theme.fill, strokeColor: theme.stroke });
  if (type === 'emoji') activeEffect = new emojiCursor({ ...shared, emoji: [emojiInput.value, '✦', '·'], delay: 28 });
  if (type === 'fairy') activeEffect = new fairyDustCursor({ ...shared, colors: theme.colors, fairySymbol: emojiInput.value });
  effectName.textContent = names[type];
  effectStatus.textContent = reduceInput.checked ? '动态已暂停' : '效果运行中';
}

[effectInput, themeInput, emojiInput].forEach((control) => control.addEventListener('change', renderEffect));
reduceInput.addEventListener('change', () => { if (reduceInput.checked) destroyActive(); else renderEffect(); effectStatus.textContent = reduceInput.checked ? '动态已暂停' : '效果运行中'; });
restartButton.addEventListener('click', renderEffect);
renderEffect();
