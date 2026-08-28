(() => {
  const map = document.querySelector('#seatMap');
  const movie = document.querySelector('#movie');
  const count = document.querySelector('#count');
  const total = document.querySelector('#total');
  const confirm = document.querySelector('#confirm');
  const reset = document.querySelector('#reset');
  const savedNote = document.querySelector('#savedNote');
  const rows = 7;
  const columns = 10;
  const occupied = new Set([3, 4, 16, 17, 27, 28, 39, 40, 41, 53, 64, 65]);
  const storageKey = 'lin-seatplanner-selection';

  function buildMap() {
    for (let row = 0; row < rows; row += 1) {
      const rowElement = document.createElement('div');
      rowElement.className = 'seat-row';
      const rowLabel = document.createElement('span');
      rowLabel.className = 'row-label';
      rowLabel.textContent = String.fromCharCode(65 + row);
      rowElement.append(rowLabel);
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const seat = document.createElement('button');
        seat.type = 'button';
        seat.className = 'seat';
        seat.dataset.index = String(index);
        seat.dataset.label = `${String.fromCharCode(65 + row)}${String(column + 1).padStart(2, '0')}`;
        seat.setAttribute('aria-label', `座位 ${seat.dataset.label}`);
        if (occupied.has(index)) { seat.classList.add('seat--occupied'); seat.disabled = true; }
        if (column === 4) seat.classList.add('aisle-after');
        rowElement.append(seat);
      }
      map.append(rowElement);
    }
  }

  function saveSelection() {
    const selected = [...map.querySelectorAll('.seat--selected')].map((seat) => seat.dataset.index);
    localStorage.setItem(storageKey, JSON.stringify(selected));
  }

  function updateSummary() {
    const selected = map.querySelectorAll('.seat--selected');
    const price = Number(movie.value);
    count.textContent = String(selected.length);
    total.textContent = String(selected.length * price);
    confirm.disabled = selected.length === 0;
    saveSelection();
  }

  function restoreSelection() {
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (error) { saved = []; }
    saved.forEach((index) => {
      const seat = map.querySelector(`[data-index="${index}"]`);
      if (seat && !seat.disabled) seat.classList.add('seat--selected');
    });
    updateSummary();
  }

  map.addEventListener('click', (event) => {
    const seat = event.target.closest('.seat');
    if (!seat || seat.disabled) return;
    seat.classList.toggle('seat--selected');
    updateSummary();
  });
  movie.addEventListener('change', updateSummary);
  reset.addEventListener('click', () => { map.querySelectorAll('.seat--selected').forEach((seat) => seat.classList.remove('seat--selected')); updateSummary(); savedNote.textContent = '已清空本机保存的座位'; });
  confirm.addEventListener('click', () => { savedNote.textContent = `计划已记录：${count.textContent} 个座位，期待今晚的电影。`; });
  buildMap();
  restoreSelection();
})();
