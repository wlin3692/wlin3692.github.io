const field = document.getElementById('field');
const countInput = document.getElementById('countInput');
const opacityInput = document.getElementById('opacityInput');
const colorInput = document.getElementById('colorInput');
const countValue = document.getElementById('countValue');
const opacityValue = document.getElementById('opacityValue');
const fieldLabel = document.getElementById('fieldLabel');
const refreshButton = document.getElementById('refreshButton');
let nest = null;

function renderNest() {
  if (nest) nest.destroy();
  const count = Number(countInput.value);
  const opacity = Number(opacityInput.value) / 100;
  countValue.textContent = String(count);
  opacityValue.textContent = opacity.toFixed(2);
  fieldLabel.textContent = (count > 125 ? 'DENSE' : count < 65 ? 'SPARSE' : 'CALM') + ' / ' + String(count).padStart(3, '0');
  nest = new window.CanvasNest(field, { color: colorInput.value, pointColor: colorInput.value, opacity, count, zIndex: 0 });
}

[countInput, opacityInput, colorInput].forEach(function (control) { control.addEventListener('input', renderNest); control.addEventListener('change', renderNest); });
refreshButton.addEventListener('click', renderNest);
renderNest();
