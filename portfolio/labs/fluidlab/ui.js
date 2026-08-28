(function () {
  'use strict';

  var api = window.FluidLab;
  var panel = document.getElementById('controlPanel');
  var settingsButton = document.getElementById('settingsButton');
  var pauseButton = document.getElementById('pauseButton');
  var pauseStatus = document.getElementById('pauseStatus');
  var toast = document.getElementById('toast');
  var toastTimer = 0;
  var storageKey = 'xiaolin-fluid-lab-settings';

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 1500);
  }

  function setPanel(open) {
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    settingsButton.setAttribute('aria-expanded', String(open));
    settingsButton.classList.toggle('active', open);
  }

  function syncPaused(paused) {
    pauseStatus.hidden = !paused;
    pauseButton.classList.toggle('active', paused);
    pauseButton.setAttribute('aria-label', paused ? '继续流动' : '暂停流动');
    pauseButton.setAttribute('title', paused ? '继续流动' : '暂停流动');
    pauseButton.firstElementChild.innerHTML = paused ? '&#9654;' : '&#8545;';
  }

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (error) {
      return {};
    }
  }

  function saveSettings() {
    var settings = { palette: document.querySelector('.palette.active')?.dataset.palette || 'aurora' };
    document.querySelectorAll('[data-option]').forEach(function (input) {
      settings[input.dataset.option] = Number(input.value);
    });
    document.querySelectorAll('[data-toggle]').forEach(function (input) {
      settings[input.dataset.toggle] = input.checked;
    });
    settings.quality = document.getElementById('qualitySelect').value;
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
      // Controls remain available when storage is blocked.
    }
  }

  function applySavedSettings() {
    var settings = readSettings();
    document.querySelectorAll('[data-option]').forEach(function (input) {
      var key = input.dataset.option;
      if (Number.isFinite(settings[key])) input.value = settings[key];
      document.getElementById(input.dataset.output).value = input.value;
      api.setOption(key, Number(input.value));
    });
    document.querySelectorAll('[data-toggle]').forEach(function (input) {
      var key = input.dataset.toggle;
      if (typeof settings[key] === 'boolean') input.checked = settings[key];
      api.setOption(key, input.checked);
    });
    var quality = ['low', 'medium', 'high'].includes(settings.quality) ? settings.quality : 'medium';
    document.getElementById('qualitySelect').value = quality;
    api.setQuality(quality);
    var palette = settings.palette || 'aurora';
    document.querySelectorAll('[data-palette]').forEach(function (button) {
      button.classList.toggle('active', button.dataset.palette === palette);
    });
    api.setPalette(palette);
  }

  if (!api) {
    showToast('当前浏览器无法启动 WebGL');
    settingsButton.disabled = true;
    return;
  }

  settingsButton.addEventListener('click', function () {
    setPanel(!panel.classList.contains('open'));
  });

  document.getElementById('panelClose').addEventListener('click', function () {
    setPanel(false);
    settingsButton.focus();
  });

  document.getElementById('burstButton').addEventListener('click', function () {
    api.burst(12);
    showToast('已生成一组流光');
  });

  pauseButton.addEventListener('click', function () {
    syncPaused(api.togglePause());
  });

  document.getElementById('clearButton').addEventListener('click', function () {
    api.clear();
    showToast('画布已清空');
  });

  document.getElementById('captureButton').addEventListener('click', function () {
    api.capture();
    showToast('图片已保存');
  });

  document.querySelectorAll('[data-palette]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-palette]').forEach(function (item) {
        item.classList.toggle('active', item === button);
      });
      api.setPalette(button.dataset.palette);
      api.burst(8);
      saveSettings();
    });
  });

  document.querySelectorAll('[data-option]').forEach(function (input) {
    input.addEventListener('input', function () {
      document.getElementById(input.dataset.output).value = input.value;
      api.setOption(input.dataset.option, Number(input.value));
      saveSettings();
    });
  });

  document.querySelectorAll('[data-toggle]').forEach(function (input) {
    input.addEventListener('change', function () {
      api.setOption(input.dataset.toggle, input.checked);
      saveSettings();
    });
  });

  document.getElementById('qualitySelect').addEventListener('change', function (event) {
    api.setQuality(event.target.value);
    saveSettings();
    showToast('画质已切换');
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && panel.classList.contains('open')) setPanel(false);
    if (event.code === 'KeyP') window.setTimeout(function () { syncPaused(api.state().paused); }, 0);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && !api.state().paused) syncPaused(api.setPaused(true));
  });

  applySavedSettings();
  syncPaused(api.state().paused);
  setPanel(false);
}());
