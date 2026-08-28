(function initEnhancements() {
  "use strict";

  var THEME_KEY = "xiaolin-2048-theme";
  var SOUND_KEY = "xiaolin-2048-sound";
  var themeButton = document.querySelector("[data-theme-toggle]");
  var themeIcon = document.querySelector("[data-theme-icon]");
  var soundButton = document.querySelector("[data-sound-toggle]");
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var soundEnabled = readSetting(SOUND_KEY) !== "false";
  var audioContext = null;

  themeButton.addEventListener("click", function () {
    var nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    saveSetting(THEME_KEY, nextTheme);
    updateThemeButton();
  });

  soundButton.addEventListener("click", function () {
    soundEnabled = !soundEnabled;
    saveSetting(SOUND_KEY, String(soundEnabled));
    updateSoundButton();
    if (soundEnabled) playTone(520, 0.08, 0.018);
  });

  updateThemeButton();
  updateSoundButton();

  window.Game2048Enhancements = {
    onMove: function (details) {
      if (details.merged) {
        playTone(440 + Math.min(details.scoreGain, 512) / 4, 0.07, 0.014);
        vibrate(10);
      }
      if (details.won) {
        playSequence([[620, 0.08, 0], [820, 0.12, 0.09]]);
        vibrate(35);
      } else if (details.over) {
        playTone(135, 0.2, 0.028, "sawtooth");
        vibrate(45);
      }
    },
    onRestart: function () {
      playSequence([[330, 0.05, 0], [440, 0.06, 0.05]]);
    }
  };

  function updateThemeButton() {
    var dark = document.documentElement.dataset.theme === "dark";
    var label = dark ? "切换到浅色模式" : "切换到深色模式";
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    themeButton.setAttribute("aria-pressed", String(dark));
    themeIcon.textContent = dark ? "○" : "◐";
    if (themeColor) themeColor.setAttribute("content", dark ? "#171d1a" : "#f2f6f3");
  }

  function updateSoundButton() {
    soundButton.classList.toggle("is-muted", !soundEnabled);
    soundButton.setAttribute("aria-pressed", String(!soundEnabled));
    soundButton.setAttribute("aria-label", soundEnabled ? "关闭音效" : "开启音效");
    soundButton.title = soundButton.getAttribute("aria-label");
  }

  function getAudioContext() {
    if (audioContext) return audioContext;
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
    return audioContext;
  }

  function playTone(frequency, duration, volume, type, delay) {
    if (!soundEnabled) return;
    var context = getAudioContext();
    if (!context) return;
    if (context.state === "suspended") context.resume().catch(function () {});

    var oscillator = context.createOscillator();
    var gain = context.createGain();
    var startAt = context.currentTime + (delay || 0);
    oscillator.type = type || "square";
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume || 0.016, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.02);
  }

  function playSequence(notes) {
    notes.forEach(function (note) {
      playTone(note[0], note[1], 0.016, "square", note[2]);
    });
  }

  function vibrate(duration) {
    try {
      if (navigator.vibrate) navigator.vibrate(duration);
    } catch (error) {
      // Vibration is optional.
    }
  }

  function readSetting(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // The current-page setting still applies.
    }
  }
})();
