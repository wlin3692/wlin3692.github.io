const field = document.getElementById('particleField');
const countInput = document.getElementById('countInput');
const speedInput = document.getElementById('speedInput');
const shapeInput = document.getElementById('shapeInput');
const modeInput = document.getElementById('modeInput');
const countValue = document.getElementById('countValue');
const speedValue = document.getElementById('speedValue');
const fieldStatus = document.getElementById('fieldStatus');
const refreshButton = document.getElementById('refreshButton');
const colors = Array.from(document.querySelectorAll('.color'));
let theme = '#66e3c4';

function config() {
  const count = Number(countInput.value);
  const speed = Number(speedInput.value);
  const base = {
    particles: { number: { value: count, density: { enable: true, value_area: 800 } }, color: { value: theme }, shape: { type: shapeInput.value, stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } }, opacity: { value: .65, random: true }, size: { value: 4, random: true }, line_linked: { enable: modeInput.value === 'grab', distance: 150, color: theme, opacity: .45, width: 1 }, move: { enable: true, speed, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false } } },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: modeInput.value === 'push' ? 'repulse' : modeInput.value }, onclick: { enable: true, mode: modeInput.value === 'push' ? 'push' : 'bubble' }, resize: true }, modes: { grab: { distance: 230, line_linked: { opacity: .8 } }, bubble: { distance: 180, size: 18, duration: 2, opacity: 1, speed: 3 }, repulse: { distance: 130 }, push: { particles_nb: 4 } } }, retina_detect: true
  };
  return base;
}

function render() {
  if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) window.pJSDom[0].pJS.fn.vendors.destroypJS();
  window.pJSDom = [];
  particlesJS('particleField', config());
  countValue.textContent = String(countInput.value);
  speedValue.textContent = String(speedInput.value);
  fieldStatus.textContent = String(countInput.value).padStart(3, '0') + ' PARTICLES';
}

[countInput, speedInput, shapeInput, modeInput].forEach(function (control) { control.addEventListener('input', render); control.addEventListener('change', render); });
colors.forEach(function (button) { button.addEventListener('click', function () { theme = button.dataset.color; colors.forEach((item) => item.classList.toggle('active', item === button)); render(); }); });
refreshButton.addEventListener('click', render);
render();
