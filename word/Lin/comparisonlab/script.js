(() => {
  const comparison = document.querySelector('#comparison');
  const before = document.querySelector('.comparison__before');
  const handle = document.querySelector('#handle');
  const positionLabel = document.querySelector('#positionLabel');
  let percent = 50;
  let dragging = false;

  function setPosition(next) {
    percent = Math.max(0, Math.min(100, next));
    before.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
    handle.setAttribute('aria-valuenow', String(Math.round(percent)));
    positionLabel.textContent = `对比位置 ${Math.round(percent)}%`;
  }

  function fromPointer(event) {
    const rect = comparison.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    setPosition(((clientX - rect.left) / rect.width) * 100);
  }

  comparison.addEventListener('pointerdown', (event) => { dragging = true; comparison.setPointerCapture(event.pointerId); fromPointer(event); });
  comparison.addEventListener('pointermove', (event) => { if (dragging) fromPointer(event); });
  comparison.addEventListener('pointerup', () => { dragging = false; });
  comparison.addEventListener('pointercancel', () => { dragging = false; });
  handle.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      setPosition(percent + (event.key === 'ArrowRight' ? 2 : -2));
    }
    if (event.key === 'Home') setPosition(0);
    if (event.key === 'End') setPosition(100);
  });
  setPosition(50);
})();
