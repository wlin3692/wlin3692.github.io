(() => {
  const tracks = [
    { title: '晨光漫游', description: '柔和的脉冲，适合打开一天的第一个窗口。', bpm: 72, notes: [261.63, 329.63, 392, 329.63], color: '#d7f06c' },
    { title: '雨线观察', description: '细碎的高频雨点，给长时间阅读留一点背景。', bpm: 84, notes: [196, 246.94, 293.66, 246.94], color: '#83d8ea' },
    { title: '夜航模式', description: '更深的低音和缓慢循环，适合收尾与整理。', bpm: 58, notes: [146.83, 174.61, 220, 174.61], color: '#b49aff' },
  ];
  const play = document.querySelector('#play'); const prev = document.querySelector('#prev'); const next = document.querySelector('#next'); const progress = document.querySelector('#progress'); const volume = document.querySelector('#volume'); const list = document.querySelector('#trackList'); const title = document.querySelector('#player-title'); const description = document.querySelector('#trackDescription'); const cover = document.querySelector('#cover'); const status = document.querySelector('#engineStatus'); const elapsed = document.querySelector('#elapsed');
  let index = 0; let playing = false; let position = 0; let timer; let audioContext; let master;

  function renderList() { list.innerHTML = tracks.map((track, item) => `<button type="button" class="track ${item === index ? 'is-active' : ''}" data-index="${item}"><span class="track__number">0${item + 1}</span><span><b>${track.title}</b><small>${track.description}</small></span><span class="track__bpm">${track.bpm} BPM</span></button>`).join(''); }
  function updateTime() { const minutes = Math.floor(position / 60).toString().padStart(2, '0'); const seconds = Math.floor(position % 60).toString().padStart(2, '0'); elapsed.textContent = `${minutes}:${seconds}`; progress.value = String(position); }
  function loadTrack(nextIndex) { index = (nextIndex + tracks.length) % tracks.length; const track = tracks[index]; title.textContent = track.title; description.textContent = track.description; cover.style.setProperty('--track-color', track.color); cover.querySelector('span').textContent = `0${index + 1}`; position = 0; updateTime(); renderList(); if (playing) startPulse(); }
  function ensureAudio() { if (!audioContext) { audioContext = new (window.AudioContext || window.webkitAudioContext)(); master = audioContext.createGain(); master.gain.value = Number(volume.value); master.connect(audioContext.destination); } if (audioContext.state === 'suspended') audioContext.resume(); }
  function pulse() { if (!playing || !audioContext) return; const track = tracks[index]; const note = track.notes[Math.floor(position / 60 * track.bpm) % track.notes.length]; const now = audioContext.currentTime; const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain(); oscillator.type = index === 2 ? 'triangle' : 'sine'; oscillator.frequency.value = note; gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.08, now + .03); gain.gain.exponentialRampToValueAtTime(0.0001, now + .7); oscillator.connect(gain).connect(master); oscillator.start(now); oscillator.stop(now + .72); }
  function startPulse() { clearInterval(timer); pulse(); timer = setInterval(pulse, (60000 / tracks[index].bpm)); }
  function toggle() { ensureAudio(); playing = !playing; document.body.classList.toggle('is-playing', playing); play.textContent = playing ? 'Ⅱ' : '▶'; play.setAttribute('aria-label', playing ? '暂停' : '播放'); status.textContent = playing ? '引擎运行中 · 现场生成' : '引擎已暂停'; if (playing) startPulse(); else clearInterval(timer); }
  play.addEventListener('click', toggle); prev.addEventListener('click', () => loadTrack(index - 1)); next.addEventListener('click', () => loadTrack(index + 1));
  list.addEventListener('click', (event) => { const button = event.target.closest('[data-index]'); if (button) loadTrack(Number(button.dataset.index)); });
  progress.addEventListener('input', () => { position = Number(progress.value); updateTime(); }); volume.addEventListener('input', () => { if (master) master.gain.value = Number(volume.value); });
  document.addEventListener('keydown', (event) => { if (event.code === 'Space' && event.target.tagName !== 'INPUT') { event.preventDefault(); toggle(); } });
  setInterval(() => { if (playing) { position = (position + 1) % 1500; updateTime(); } }, 1000); loadTrack(0);
})();
