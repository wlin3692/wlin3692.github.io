(() => {
  const specimen = document.querySelector('#specimen');
  const launchButton = document.querySelector('#disintegrateButton');
  const rebuildButton = document.querySelector('#rebuildButton');
  const effectChoices = document.querySelector('#effectChoices');
  const density = document.querySelector('#density');
  const densityValue = document.querySelector('#densityValue');
  const status = document.querySelector('.stage-status');
  const statusText = document.querySelector('#statusText');

  let ready = false;
  let running = false;

  function CometParticle() {
    this.name = 'CometParticle';
    this.animationDuration = 1350;
    this.angle = (-0.15 + Math.random() * 0.3) * Math.PI;
    this.distance = 80 + Math.random() * 240;
    this.size = 2 + Math.random() * 6;
    this.draw = (ctx, progress) => {
      const percent = Math.min(progress, 1);
      const x = this.startX + Math.cos(this.angle) * this.distance * percent;
      const y = this.startY + Math.sin(this.angle) * this.distance * percent + 28 * percent * percent;
      const alpha = Math.max(0, 1 - percent);
      ctx.beginPath();
      ctx.arc(x, y, this.size * alpha, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.rgbArray[0]}, ${this.rgbArray[1]}, ${this.rgbArray[2]}, ${alpha})`;
      ctx.fill();
    };
  }

  disintegrate.addParticleType(CometParticle);

  function updateDensityLabel() {
    const value = Number(density.value);
    densityValue.value = value <= 32 ? '细腻' : value <= 50 ? '标准' : '轻量';
    const object = disintegrate.getDisObj(specimen);
    if (object) object.particleReductionFactor = value;
  }

  function setReady() {
    ready = true;
    launchButton.disabled = false;
    status.classList.add('is-ready');
    statusText.textContent = '粒子画布已就绪';
    updateDensityLabel();
  }

  window.addEventListener('particlesReady', setReady);

  effectChoices.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-effect]');
    if (!button || running) return;
    effectChoices.querySelectorAll('button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    specimen.dataset.disParticleType = button.dataset.effect;
    const object = disintegrate.getDisObj(specimen);
    if (object) object.particleType = button.dataset.effect;
  });

  density.addEventListener('input', updateDensityLabel);

  launchButton.addEventListener('click', () => {
    if (!ready || running) return;
    const object = disintegrate.getDisObj(specimen);
    if (!object) return;
    running = true;
    launchButton.disabled = true;
    statusText.textContent = '正在分解元素';
    specimen.classList.add('is-disintegrating');
    disintegrate.createSimultaneousParticles(object);
  });

  specimen.addEventListener('disComplete', () => {
    specimen.hidden = true;
    rebuildButton.hidden = false;
    running = false;
    statusText.textContent = '元素已转换为粒子';
  });

  rebuildButton.addEventListener('click', () => {
    rebuildButton.hidden = true;
    specimen.hidden = false;
    requestAnimationFrame(() => specimen.classList.remove('is-disintegrating'));
    launchButton.disabled = false;
    statusText.textContent = '元素已重新构建';
  });

  disintegrate.init();
})();
