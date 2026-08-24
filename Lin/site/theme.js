// 尽早应用主题，减少页面打开时的颜色闪烁。
(function applyInitialTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('lin-theme');
  } catch (error) {
    // 某些隐私模式会禁用本地存储，仍可在本次浏览中切换主题。
  }
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = savedTheme || (systemDark ? 'dark' : 'light');
})();

window.siteAccentThemes = {
  original: null,
  coral: { theme: '#e54868', dark: '#c93554', light: '#b45309' },
  forest: { theme: '#168a5b', dark: '#0f6b45', light: '#0e7490' },
  gold: { theme: '#b56a00', dark: '#8f5300', light: '#b91c1c' }
};

window.applySiteAccent = function applySiteAccent(name) {
  const normalizedName = name === 'blue' ? 'original' : name;
  const selectedName = normalizedName in window.siteAccentThemes ? normalizedName : 'original';
  const accent = window.siteAccentThemes[selectedName];
  document.documentElement.dataset.accent = selectedName;
  if (!accent) {
    document.documentElement.style.removeProperty('--theme');
    document.documentElement.style.removeProperty('--theme-dark');
    document.documentElement.style.removeProperty('--theme-light');
    return;
  }
  document.documentElement.style.setProperty('--theme', accent.theme);
  document.documentElement.style.setProperty('--theme-dark', accent.dark);
  document.documentElement.style.setProperty('--theme-light', accent.light);
};

(function applyInitialAccent() {
  let savedAccent = 'original';
  try {
    savedAccent = localStorage.getItem('lin-accent-theme') || 'original';
  } catch (error) {
    // Use the default accent when storage is unavailable.
  }
  window.applySiteAccent(savedAccent);
})();

window.initNightMode = function initNightMode() {
  const button = document.getElementById('themeToggle');
  if (!button) return;

  function updateButton() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    button.innerHTML = isDark
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
    button.title = isDark ? '切换到日间模式' : '切换到夜间模式';
    button.setAttribute('aria-label', button.title);
    button.setAttribute('aria-pressed', String(isDark));
  }

  button.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem('lin-theme', nextTheme);
    } catch (error) {
      // 本地存储不可用时忽略保存，不影响当前页面切换。
    }
    updateButton();
  });

  updateButton();
};

window.initAccentTheme = function initAccentTheme() {
  const buttons = Array.from(document.querySelectorAll('[data-accent-theme]'));
  if (!buttons.length) return;

  function updateButtons() {
    const current = document.documentElement.dataset.accent || 'original';
    buttons.forEach(button => {
      const selected = button.dataset.accentTheme === current;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.accentTheme;
      window.applySiteAccent(name);
      try {
        localStorage.setItem('lin-accent-theme', name);
      } catch (error) {
        // The selected accent still applies to the current page.
      }
      updateButtons();
      showToast('主题色已切换。');
    });
  });

  updateButtons();
};
