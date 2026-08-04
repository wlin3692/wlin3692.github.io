const hero = document.getElementById('heroText');
const stage = document.getElementById('stage');
const textInput = document.getElementById('textInput');
const depthInput = document.getElementById('depthInput');
const layersInput = document.getElementById('layersInput');
const directionInput = document.getElementById('directionInput');
const fadeInput = document.getElementById('fadeInput');
const pointerInput = document.getElementById('pointerInput');
const depthValue = document.getElementById('depthValue');
const layersValue = document.getElementById('layersValue');
const baseText = 'CREATE';

function refreshText() {
  const text = textInput.value.trim() || baseText;
  const depth = depthInput.value + 'px';
  const layers = Number(layersInput.value);
  const direction = directionInput.value;
  const fade = fadeInput.checked ? 'true' : 'false';
  const event = pointerInput.checked ? 'pointer' : 'none';
  hero.textContent = text;
  hero.dataset.z = 'true';
  hero.dataset.zDepth = depth;
  hero.dataset.zLayers = String(layers);
  hero.dataset.zDirection = direction;
  hero.dataset.zFade = fade;
  hero.dataset.zEvent = event;
  hero.dataset.zEventrotation = '28deg';
  depthValue.textContent = depthInput.value;
  layersValue.textContent = String(layers);
  window.Ztextify('#heroText', { depth, layers, direction, fade, event, eventRotation: '28deg' });
}

[textInput, depthInput, layersInput, directionInput, fadeInput, pointerInput].forEach(function (control) {
  control.addEventListener('input', refreshText);
  control.addEventListener('change', refreshText);
});

stage.addEventListener('pointermove', function (event) {
  if (!pointerInput.checked) return;
  const rect = stage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  stage.style.backgroundColor = 'hsl(' + Math.round(42 + x * 25) + ' 58% ' + Math.round(72 + y * 7) + '%)';
});

refreshText();
