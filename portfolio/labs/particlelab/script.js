const field = document.getElementById('particleField');
const countInput = document.getElementById('countInput');
const speedInput = document.getElementById('speedInput');
const opacityInput = document.getElementById('opacityInput');
const shapeInput = document.getElementById('shapeInput');
const modeInput = document.getElementById('modeInput');
const countValue = document.getElementById('countValue');
const speedValue = document.getElementById('speedValue');
const opacityValue = document.getElementById('opacityValue');
const fieldStatus = document.getElementById('fieldStatus');
const fieldKicker = document.getElementById('fieldKicker');
const fieldHint = document.getElementById('fieldHint');
const modeNote = document.getElementById('modeNote');
const refreshButton = document.getElementById('refreshButton');
const colors = Array.from(document.querySelectorAll('.color'));
const modeTabs = Array.from(document.querySelectorAll('.mode-tab'));
let theme = '#66e3c4';
let labMode = new URLSearchParams(location.search).get('mode') === 'console' ? 'console' : 'link';

function config() {
  const count = Number(countInput.value);
  const speed = Number(speedInput.value);
  const base = {
    particles: { number: { value: count, density: { enable: true, value_area: 800 } }, color: { value: theme }, shape: { type: shapeInput.value, stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } }, opacity: { value: .65, random: true }, size: { value: 4, random: true }, line_linked: { enable: labMode === 'link' || modeInput.value === 'grab', distance: 150, color: theme, opacity: Number(opacityInput.value) / 100, width: 1 }, move: { enable: true, speed, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false } } },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: labMode === 'link' ? 'grab' : (modeInput.value === 'push' ? 'repulse' : modeInput.value) }, onclick: { enable: true, mode: labMode === 'link' ? 'bubble' : (modeInput.value === 'push' ? 'push' : 'bubble') }, resize: true }, modes: { grab: { distance: 230, line_linked: { opacity: .8 } }, bubble: { distance: 180, size: 18, duration: 2, opacity: 1, speed: 3 }, repulse: { distance: 130 }, push: { particles_nb: 4 } } }, retina_detect: true
  };
  return base;
}

function render() {
  if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) window.pJSDom[0].pJS.fn.vendors.destroypJS();
  window.pJSDom = [];
  particlesJS('particleField', config());
  countValue.textContent = String(countInput.value);
  speedValue.textContent = String(speedInput.value);
  opacityValue.textContent = (Number(opacityInput.value) / 100).toFixed(2);
  fieldStatus.textContent = String(countInput.value).padStart(3, '0') + ' PARTICLES';
  modeTabs.forEach((item) => {
    const active = item.dataset.mode === labMode;
    item.classList.toggle('active', active);
    item.setAttribute('aria-selected', String(active));
  });
  fieldKicker.textContent = labMode === 'link' ? 'LIVE CONNECTIONS' : 'LIVE PREVIEW';
  fieldHint.textContent = labMode === 'link' ? '移动指针，让粒子在轨迹周围形成连接' : '点击粒子场添加新的粒子';
  modeNote.textContent = labMode === 'link' ? '指针会吸引附近粒子并建立连线' : '参数会即时应用到动态粒子场';
}

[countInput, speedInput, opacityInput, shapeInput, modeInput].forEach(function (control) { control.addEventListener('input', render); control.addEventListener('change', render); });
modeTabs.forEach(function (button) { button.addEventListener('click', function () { labMode = button.dataset.mode; modeTabs.forEach((item) => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-selected', String(active)); }); render(); }); });
colors.forEach(function (button) { button.addEventListener('click', function () { theme = button.dataset.color; colors.forEach((item) => item.classList.toggle('active', item === button)); render(); }); });
refreshButton.addEventListener('click', render);
render();
