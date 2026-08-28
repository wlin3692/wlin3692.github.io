(function initSceneControls() {
  const back = document.createElement('a');
  back.className = 'scene-back';
  back.href = '../选项界面.html';
  back.setAttribute('aria-label', '返回选项界面');
  back.title = '返回';
  back.innerHTML = '<span aria-hidden="true">&#8592;</span>';
  document.body.appendChild(back);

  const audio = document.querySelector('audio[data-scene-audio]');
  if (!audio) return;

  const button = document.createElement('button');
  button.className = 'scene-audio';
  button.type = 'button';
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = '<span class="scene-audio__icon" aria-hidden="true">&#9654;</span><span class="scene-sr-only">播放音乐</span>';
  document.body.appendChild(button);

  const icon = button.querySelector('.scene-audio__icon');
  const label = button.querySelector('.scene-sr-only');

  function update() {
    const playing = !audio.paused && !audio.ended;
    button.classList.toggle('is-playing', playing);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? '暂停音乐' : '播放音乐');
    button.title = playing ? '暂停音乐' : '播放音乐';
    icon.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
    label.textContent = playing ? '暂停音乐' : '播放音乐';
  }

  button.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(function () {
        label.textContent = '音乐播放失败';
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('ended', update);
  audio.addEventListener('error', function () {
    button.disabled = true;
    label.textContent = '音乐加载失败';
  });
  update();

  if (audio.autoplay) audio.play().catch(update);
}());
