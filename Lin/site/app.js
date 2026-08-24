// ===== components.js =====
// 首页公共组件统一放在这里，便于修改导航、页脚和音乐播放器。
window.renderHomeComponents = function renderHomeComponents() {
  const welcomeTitle = '欢迎来到小林的个人网页';
  const welcomeTitleMarkup = Array.from(welcomeTitle)
    .map((character, index) => `<span class="welcome-title__character" style="--shine-delay:${(index * 0.12).toFixed(2)}s" aria-hidden="true">${character}</span>`)
    .join('');

  document.getElementById('siteTop').innerHTML = `
    <div class="loader" id="loader"><div class="loader-spinner"></div></div>
    <header>
      <h1 class="welcome-title" aria-label="${welcomeTitle}">${welcomeTitleMarkup}</h1>
      <p>探索无限可能，创造美好未来</p>
      <div class="home-music-bar">
        <button id="homePlay" type="button" title="播放" aria-label="播放背景音乐"><i class="bi bi-play-fill" aria-hidden="true"></i></button>
        <button id="homePause" type="button" title="暂停" aria-label="暂停背景音乐"><i class="bi bi-pause-fill" aria-hidden="true"></i></button>
        <span id="homeMusicStatus">背景音乐</span>
      </div>
    </header>
    <nav id="navbar" aria-label="主导航">
      <div class="nav-container">
        <a href="#home" class="logo" aria-label="相遇不一定有结局 但一定有意义"><img class="site-brand-icon" data-full-src="Lin/site/dragon-shield-icon.webp" data-video-src="assets/videos/biao.mp4" src="Lin/site/dragon-shield-icon-256.png" alt="龙盾图标，点击播放介绍动画" width="38" height="38" title="点击播放龙盾动画" tabindex="0" role="button"><span class="brand-copy"><strong>相遇不一定有结局 但一定有意义</strong><small>网络空间安全学习者 · 网页交互开发</small></span></a>
        <ul class="nav-links" id="navLinks">
          <li><a href="#home" class="active">首页</a></li>
          <li><a href="#about">关于我</a></li>
          <li><a href="#services">服务</a></li>
          <li><a href="#portfolio">作品集</a></li>
          <li><a href="#updates">更新日志</a></li>
          <li><a href="#contact">联系我们</a></li>
          <li><a href="#guestbook">留言板</a></li>
          <li><a href="word/Lin/login/denglu.html">登录</a></li>
          <li><a href="word/Lin/funlab/选项界面.html" aria-label="小林的趣味页面">🐷</a></li>
        </ul>
        <button class="music-toggle" id="musicToggle" type="button" title="音乐播放器" aria-label="打开音乐播放器" aria-expanded="false"><i class="bi bi-music-note-beamed"></i></button>
        <button class="quick-search-toggle" id="quickSearch" type="button" title="快速搜索" aria-label="打开快速搜索"><i class="bi bi-search"></i></button>
        <button class="theme-toggle" id="themeToggle" type="button" aria-label="切换到夜间模式"></button>
        <button class="hamburger" id="hamburger" type="button" aria-label="打开导航菜单" aria-controls="navLinks" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </nav>`;

  document.getElementById('siteBottom').innerHTML = `
<!-- 页脚 -->
<footer>
  <div class="footer-content">
    <div class="social-links">
      <a href="mailto:wlin3692@163.com" title="邮箱" aria-label="发送邮件"><i class="bi bi-envelope" aria-hidden="true"></i></a>
      <a href="tel:18244733692" title="电话" aria-label="拨打电话"><i class="bi bi-telephone" aria-hidden="true"></i></a>
      <button type="button" class="social-placeholder" data-platform="微信" title="微信" aria-label="微信"><i class="bi bi-wechat" aria-hidden="true"></i></button>
      <button type="button" class="social-placeholder" data-platform="QQ" title="QQ" aria-label="QQ"><i class="bi bi-tencent-qq" aria-hidden="true"></i></button>
      <button type="button" class="social-placeholder" data-platform="微博" title="微博" aria-label="微博"><i class="bi bi-sina-weibo" aria-hidden="true"></i></button>
    </div>
    <div class="footer-info"><p><strong>小林工作室</strong></p><p>专业 · 创新 · 品质</p></div>
    <p><a href="pages/status.html">网站状态</a> · <a href="pages/report.html">问题反馈</a> · <a href="mailto:wlin3692@163.com">发送邮件</a></p>
    <p>&copy; ${new Date().getFullYear()} 小林的个人网页. 版权所有.</p>
  </div>
</footer>
<!-- 返回顶部 -->
<a href="#home" class="back-to-top" id="backToTop" aria-label="返回顶部" title="返回顶部"><i class="bi bi-arrow-up" aria-hidden="true"></i></a>
    <audio id="bgMusic" preload="none" loop><source data-src="Lin/site/linlin.ogg" type="audio/ogg"></audio>
    <div id="musicWin" class="music-win" hidden>
      <div class="music-head"><span>音乐播放器</span><button id="closeMusic" type="button" aria-label="关闭播放器">×</button></div>
      <div class="music-track">
        <i class="bi bi-music-note-beamed"></i>
        <span><strong>背景音乐</strong><small id="musicStatus">准备播放</small></span>
      </div>
      <canvas id="musicSpectrum" class="music-spectrum" width="288" height="58" aria-hidden="true"></canvas>
      <div class="music-progress-row">
        <span id="musicCurrentTime">0:00</span>
        <input id="musicProgress" type="range" min="0" max="100" value="0" step="0.1" aria-label="音乐播放进度">
        <span id="musicDuration">0:00</span>
      </div>
      <div class="music-body">
        <div class="music-actions">
          <button id="playBtn" class="btn-circle" type="button" title="播放" aria-label="播放背景音乐"><i class="bi bi-play-fill" aria-hidden="true"></i></button>
          <button id="pauseBtn" class="btn-circle" type="button" title="暂停" aria-label="暂停背景音乐"><i class="bi bi-pause-fill" aria-hidden="true"></i></button>
          <button id="stopBtn" class="btn-circle" type="button" title="停止" aria-label="停止背景音乐"><i class="bi bi-stop-fill" aria-hidden="true"></i></button>
        </div>
        <div class="volume-control">
          <button id="muteBtn" type="button" title="静音" aria-label="静音"><i class="bi bi-volume-up-fill"></i></button>
          <input id="volumeSlider" type="range" min="0" max="100" value="70" aria-label="音量">
        </div>
      </div>
    </div>
    <button class="effect-settings-toggle" id="effectSettingsToggle" type="button" title="效果设置" aria-label="打开效果设置" aria-expanded="false"><i class="bi bi-sliders"></i></button>
    <aside class="effect-settings-panel" id="effectSettingsPanel" aria-label="效果设置" hidden>
      <div class="effect-settings-head"><strong>效果设置</strong><button id="closeEffectSettings" type="button" title="关闭" aria-label="关闭效果设置"><i class="bi bi-x-lg"></i></button></div>
      <div class="effect-presets" role="group" aria-label="背景效果预设">
        <button type="button" data-effect-preset="fresh">清爽</button>
        <button type="button" data-effect-preset="romantic">浪漫</button>
        <button type="button" data-effect-preset="starry">星空</button>
        <button type="button" data-effect-preset="quiet">静谧</button>
      </div>
      <label class="effect-setting"><span><i class="bi bi-stars"></i> 动态背景</span><input type="checkbox" data-effect="ambient" checked></label>
      <label class="effect-setting"><span><i class="bi bi-flower1"></i> 飘落花瓣</span><input type="checkbox" data-effect="petals" checked></label>
      <label class="effect-setting"><span><i class="bi bi-grid-3x3-gap"></i> 星空粒子</span><input type="checkbox" data-effect="starfield" checked></label>
      <label class="effect-setting"><span><i class="bi bi-cursor"></i> 光标轨迹</span><input type="checkbox" data-effect="trails" checked></label>
      <div class="accent-setting">
        <strong>主题色</strong>
        <div class="accent-swatches" role="group" aria-label="选择主题色">
          <button type="button" data-accent-theme="original" style="--swatch:#0066ff" aria-label="原版主题" title="原版"></button>
          <button type="button" data-accent-theme="coral" style="--swatch:#e54868" aria-label="珊瑚主题" title="珊瑚"></button>
          <button type="button" data-accent-theme="forest" style="--swatch:#168a5b" aria-label="森林主题" title="森林"></button>
          <button type="button" data-accent-theme="gold" style="--swatch:#b56a00" aria-label="暖金主题" title="暖金"></button>
        </div>
      </div>
    </aside>`;
};

// ===== effects.js =====
// 只管理页面视觉效果：加载动画、平滑滚动、导航高亮和返回顶部。
window.initHomeEffects = function initHomeEffects() {
  if (window.AOS) AOS.init({ duration: 550, once: true, offset: 60 });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<div class="scroll-progress__bar"></div>';
  document.body.prepend(progress);
  const progressBar = progress.firstElementChild;

  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 150);
  });

  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');

  function setNavigationOpen(open) {
    if (!navLinks) return;
    navLinks.classList.toggle('active', open);
    hamburger?.setAttribute('aria-expanded', String(open));
    hamburger?.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  }

  hamburger?.addEventListener('click', () => {
    setNavigationOpen(!navLinks?.classList.contains('active'));
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (target.id === 'main-content') target.focus({ preventScroll: true });
      setNavigationOpen(false);
    });
  });

  const sections = document.querySelectorAll('section');
  const menuItems = document.querySelectorAll('.nav-links a[href^="#"]');
  const topButton = document.getElementById('backToTop');
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progressBar.style.transform = 'scaleX(' + ratio + ')';
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
    topButton?.classList.toggle('visible', window.scrollY > 300);
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) current = section.id;
    });
    menuItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('effect-visible');
        observer.unobserve(entry.target);
        setTimeout(() => entry.target.classList.remove('effect-ready', 'effect-visible'), 700);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.service-item').forEach(item => {
      item.classList.add('effect-ready');
      observer.observe(item);
    });
  }

  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('pointerdown', event => {
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.className = 'button-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = event.clientX - rect.left + 'px';
      ripple.style.top = event.clientY - rect.top + 'px';
      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(card => {
      card.classList.add('effect-glow');
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', ((event.clientX - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--pointer-y', ((event.clientY - rect.top) / rect.height * 100) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
      });
    });

    document.querySelectorAll('.service-item').forEach(item => {
      item.addEventListener('pointermove', event => {
        const rect = item.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        item.style.setProperty('--tilt-x', (-y * 3) + 'deg');
        item.style.setProperty('--tilt-y', (x * 3) + 'deg');
        item.classList.add('effect-tilt');
      });
      item.addEventListener('pointerleave', () => {
        item.classList.remove('effect-tilt');
        item.style.removeProperty('--tilt-x');
        item.style.removeProperty('--tilt-y');
      });
    });
  }
};

// ===== Navigation Dots =====
window.initSectionNav = function initSectionNav() {
  var sections = document.querySelectorAll('section[id]');
  if (sections.length < 2) return;

  var wrapper = document.createElement('div');
  wrapper.className = 'section-nav-dots';
  wrapper.setAttribute('aria-label', '章节导航');
  document.body.appendChild(wrapper);

  var navMap = {
    home: '\u9996\u9875', about: '\u5173\u4e8e', services: '\u670d\u52a1',
    portfolio: '\u4f5c\u54c1', contact: '\u8054\u7cfb', guestbook: '\u672c\u5730\u7559\u8a00'
  };
  var dots = [];
  sections.forEach(function(sec) {
    var id = sec.id;
    if (!id) return;
    var dot = document.createElement('button');
    dot.className = 'section-nav-dot';
    dot.setAttribute('aria-label', '跳转到' + (navMap[id] || id));
    dot.dataset.tooltip = navMap[id] || id;
    dot.dataset.target = '#' + id;
    dot.addEventListener('click', function() {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    wrapper.appendChild(dot);
    dots.push(dot);
  });

  function updateActive() {
    var current = '';
    var scrollY = window.scrollY + 150;
    sections.forEach(function(sec) {
      if (scrollY >= sec.offsetTop) current = sec.id;
    });
    dots.forEach(function(dot, i) {
      if (sections[i].id === current) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  function checkVisible() {
    if (window.scrollY > window.innerHeight * 0.4) wrapper.classList.add('visible');
    else wrapper.classList.remove('visible');
  }

  window.addEventListener('scroll', function() { updateActive(); checkVisible(); }, { passive: true });
  setTimeout(function() { updateActive(); checkVisible(); }, 300);
};

// ===== Ambient Background =====
window.initAmbientBg = function initAmbientBg() {
  var container = document.createElement('div');
  container.className = 'ambient-bg';
  document.body.prepend(container);

  var colors = [
    { light: 'rgba(0,102,255,', dark: 'rgba(96,165,250,' },
    { light: 'rgba(50,205,50,', dark: 'rgba(52,211,153,' },
    { light: 'rgba(168,85,247,', dark: 'rgba(192,132,252,' }
  ];

  for (var i = 0; i < 3; i++) {
    var ball = document.createElement('div');
    ball.className = 'ambient-ball';
    var size = 200 + Math.random() * 250;
    var isDark = document.documentElement.dataset.theme === 'dark';
    var c = isDark ? colors[i].dark : colors[i].light;
    ball.style.cssText =
      'width:' + size + 'px; height:' + size + 'px;' +
      'background:' + c + '0.15);' +
      'top:' + (10 + Math.random() * 70) + '%;' +
      'left:' + (10 + Math.random() * 70) + '%;' +
      'animation: ambient-shift ' + (12 + Math.random() * 8) + 's ease-in-out infinite;' +
      'animation-delay: -' + (i * 3) + 's;';
    container.appendChild(ball);
  }

  var observer = new MutationObserver(function() {
    var dark = document.documentElement.dataset.theme === 'dark';
    container.querySelectorAll('.ambient-ball').forEach(function(ball, i) {
      var c = dark ? colors[i].dark : colors[i].light;
      ball.style.background = c + '0.15)';
    });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
};

// ===== Falling Petals =====
window.initPetals = function initPetals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var layer = document.createElement('div');
  layer.className = 'petal-layer';
  document.body.appendChild(layer);

  var petalColors = [
    'rgba(255,107,148,', 'rgba(255,154,185,', 'rgba(255,200,210,',
    'rgba(255,230,240,', 'rgba(248,180,200,'
  ];
  var activePetals = 0;
  var maxPetals = 15;
  var enabled = true;

  function spawnPetal() {
    if (!enabled || activePetals >= maxPetals) return;
    activePetals++;

    var petal = document.createElement('div');
    petal.className = 'petal';
    var c = petalColors[Math.floor(Math.random() * petalColors.length)];
    var size = 10 + Math.random() * 8;
    var duration = 6 + Math.random() * 5;
    var delay = Math.random() * 2;
    var startX = Math.random() * 100;
    petal.style.cssText =
      'left:' + startX + '%;' +
      'width:' + size + 'px; height:' + (size * 0.7) + 'px;' +
      'background:' + c + '.65);' +
      'animation: petal-fall ' + duration + 's ease-in ' + delay + 's forwards;' +
      'transform: rotate(' + (Math.random() * 360) + 'deg);';
    layer.appendChild(petal);

    petal.addEventListener('animationend', function() {
      petal.remove();
      activePetals--;
    }, { once: true });
  }

  var interval = setInterval(spawnPetal, 1800);
  for (var i = 0; i < 4; i++) setTimeout(spawnPetal, i * 600);

  function setEnabled(nextEnabled) {
    enabled = nextEnabled;
    layer.hidden = !enabled;
    if (!enabled) {
      if (interval) clearInterval(interval);
      interval = null;
      layer.replaceChildren();
      activePetals = 0;
    } else if (!interval) {
      interval = setInterval(spawnPetal, 1800);
      spawnPetal();
    }
  }

  document.addEventListener('site-effect-change', function(event) {
    if (event.detail && event.detail.effect === 'petals') setEnabled(event.detail.enabled);
  });

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) { clearInterval(interval); interval = null; }
    else if (enabled && !interval) { interval = setInterval(spawnPetal, 1800); }
  });

  setEnabled(!document.documentElement.classList.contains('effect-petals-off'));
};

// ===== features.js =====
window.showToast = function showToast(message, type = 'success') {
  let region = document.querySelector('.toast-region');
  if (!region) {
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }

  const toast = document.createElement('div');
  toast.className = 'site-toast' + (type === 'error' ? ' error' : '');
  toast.innerHTML = '<i class="bi ' + (type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle') + '"></i><span></span>';
  toast.querySelector('span').textContent = message;
  region.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2800);
};

window.initAdvancedFeatures = function initAdvancedFeatures() {
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', '图片预览');
  lightbox.innerHTML = `
    <figure class="image-lightbox__figure">
      <button class="image-lightbox__close" type="button" aria-label="关闭图片预览"><i class="bi bi-x-lg"></i></button>
      <img class="image-lightbox__image" alt="">
      <figcaption class="image-lightbox__caption"></figcaption>
    </figure>`;
  document.body.appendChild(lightbox);

  const previewImage = lightbox.querySelector('.image-lightbox__image');
  const caption = lightbox.querySelector('.image-lightbox__caption');
  const closeButton = lightbox.querySelector('.image-lightbox__close');

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.removeProperty('overflow');
  }

  document.querySelectorAll('.welcome-image, #portfolio .service-item img').forEach(image => {
    if (image.closest('a')) return;
    image.classList.add('image-previewable');
    image.addEventListener('click', () => {
      previewImage.src = image.currentSrc || image.src;
      previewImage.alt = image.alt;
      caption.textContent = image.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  document.querySelectorAll('.copy-contact').forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        showToast(button.dataset.label + '已复制');
      } catch (error) {
        const input = document.createElement('textarea');
        input.value = value;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        showToast(button.dataset.label + '已复制');
      }
    });
  });

  document.querySelectorAll('.social-placeholder').forEach(button => {
    button.addEventListener('click', () => {
      showToast(button.dataset.platform + '联系方式暂未配置。', 'error');
    });
  });
};

// ===== 打字机效果=====
window.initTypewriter = function initTypewriter() {
  const targets = document.querySelectorAll('[data-typewriter]');
  targets.forEach(el => {
    const fullText = el.textContent;
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    const speed = 60;
    function type() {
      if (i < fullText.length) {
        el.textContent += fullText.charAt(i);
        i++;
        setTimeout(type, speed + Math.random() * 40);
      }
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        type();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
  });
};

// ===== 粒子光标拖尾 =====
window.initParticleTrail = function initParticleTrail() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '900'
  });
  // Keep the overlay outside body so page transforms cannot create a scrolling
  // containing block for this viewport-relative canvas.
  document.documentElement.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let hearts = [];
  let lastX = -200, lastY = -200;
  let raf = null;
  let enabled = true;
  let cssWidth = 0;
  let cssHeight = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // 用 clientWidth/clientHeight 取 canvas 实际 CSS 渲染尺寸（不含滚动条、不含边框）
    cssWidth = canvas.clientWidth || window.innerWidth;
    cssHeight = canvas.clientHeight || window.innerHeight;
    
    const w = Math.max(1, Math.round(cssWidth * dpr));
    const h = Math.max(1, Math.round(cssHeight * dpr));
    
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    
    // 直接用 dpr 设置变换矩阵，避免 canvas.width/cssWidth 的除法误差
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  resize();
  window.addEventListener('resize', resize);

  function drawHeart(cx, cy, sz, rot, alpha, hue, lightness) {
    const s = sz * 0.8;
    ctx.save();
    // 修正心形中心，让视觉中心对准鼠标
    ctx.translate(cx, cy - 0.35 * s);
    ctx.rotate(rot);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.moveTo(0, -0.3);
    ctx.bezierCurveTo(-0.6, -0.6, -1, -0.1, -1, 0.2);
    ctx.bezierCurveTo(-1, 0.6, -0.3, 0.9, 0, 1.2);
    ctx.bezierCurveTo(0.3, 0.9, 1, 0.6, 1, 0.2);
    ctx.bezierCurveTo(1, -0.1, 0.6, -0.6, 0, -0.3);
    ctx.closePath();
    ctx.shadowColor = 'rgba(255, 80, 120, ' + (alpha * 0.5) + ')';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'hsla(' + hue + ', 100%, ' + lightness + '%, ' + alpha + ')';
    ctx.fill();
    ctx.restore();
  }

  function addParticle(x, y) {
    hearts.push({
      x: x + (Math.random() - 0.5) * 3,
      y: y + (Math.random() - 0.5) * 3,
      life: 1,
      size: 3 + Math.random() * 3,
      rotation: (Math.random() - 0.5) * 0.5,
      vy: -(0.35 + Math.random() * 0.45),
      vx: (Math.random() - 0.5) * 0.25,
      hue: 340 + Math.random() * 18,
      lightness: 72 + Math.random() * 10
    });
  }

  function ensureAnimation() {
    if (enabled && raf === null) raf = requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', event => {
    if (!enabled || (event.pointerType && event.pointerType !== 'mouse')) return;
    
    // 关键修复：canvas 是 fixed 全覆盖，clientX/clientY 就是 canvas 内部坐标
    // 彻底去掉 getBoundingClientRect()，避免滚动/变换导致 rect 偏移
    // Convert viewport coordinates into the canvas' actual drawing space.
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width ? cssWidth / rect.width : 1;
    const scaleY = rect.height ? cssHeight / rect.height : 1;
    const mx = (event.clientX - rect.left) * scaleX;
    const my = (event.clientY - rect.top) * scaleY;
    
    if (lastX < 0 || lastY < 0) {
      lastX = mx;
      lastY = my;
      return;
    }

    const dx = mx - lastX;
    const dy = my - lastY;
    const distance = Math.hypot(dx, dy);
    const steps = Math.min(6, Math.max(1, Math.ceil(distance / 12)));
    for (let index = 1; index <= steps; index += 1) {
      const progress = index / steps;
      addParticle(lastX + dx * progress, lastY + dy * progress);
    }
    if (hearts.length > 80) hearts.splice(0, hearts.length - 80);

    lastX = mx;
    lastY = my;
    ensureAnimation();
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    lastX = -200;
    lastY = -200;
  });

  function draw() {
    raf = null;
    if (!enabled) return;
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    hearts = hearts.filter(h => {
      h.x += h.vx;
      h.y += h.vy;
      h.vy += 0.006;
      h.life -= 0.025;
      h.rotation += 0.02;
      if (h.life <= 0) return false;
      drawHeart(h.x, h.y, h.size, h.rotation, h.life, h.hue, h.lightness);
      return true;
    });

    if (hearts.length) raf = requestAnimationFrame(draw);
  }

  function setEnabled(nextEnabled) {
    enabled = nextEnabled;
    canvas.hidden = !enabled;
    if (!enabled) {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      hearts = [];
      lastX = -200;
      lastY = -200;
      ctx.clearRect(0, 0, cssWidth, cssHeight);
    }
  }

  document.addEventListener('site-effect-change', event => {
    if (event.detail?.effect === 'trails') setEnabled(event.detail.enabled);
  });

  setEnabled(!document.documentElement.classList.contains('effect-trails-off'));
};

// ===== 技能进度条动画 =====
window.initSkillBars = function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width || '0%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => observer.observe(bar));
};

// ===== 数字滚动计数 =====
window.initCountUp = function initCountUp() {
  const counters = document.querySelectorAll('[data-countup]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.countup, 10);
        const initial = parseInt(el.textContent, 10);
        const startValue = Number.isFinite(initial) ? initial : 0;
        const duration = 2000;
        const suffix = el.dataset.countupSuffix || '';
        const start = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(startValue + (target - startValue) * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));
};

// ===== portfolio.js =====
window.initPortfolioExplorer = function initPortfolioExplorer() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const search = document.getElementById('portfolioSearch');
  const filterButtons = Array.from(document.querySelectorAll('.portfolio-filter'));
  const favoritesOnly = document.getElementById('portfolioFavoritesOnly');
  const summary = document.getElementById('portfolioSummary');
  const empty = document.getElementById('portfolioEmpty');
  const storageKey = 'xiaolin-portfolio-favorites';
  let activeFilter = 'all';
  let favorites = new Set();

  try {
    favorites = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));
  } catch (error) {
    favorites = new Set();
  }

  function saveFavorites() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      // Browsing still works when storage is disabled.
    }
  }

  function updateFavoriteButton(card) {
    const button = card.querySelector('.project-favorite');
    const isFavorite = favorites.has(card.dataset.projectId);
    const projectName = card.querySelector('h3').textContent.trim();
    button.classList.toggle('active', isFavorite);
    button.setAttribute('aria-pressed', String(isFavorite));
    button.setAttribute('aria-label', (isFavorite ? '取消收藏' : '收藏') + projectName);
    button.title = isFavorite ? '取消收藏' : '收藏';
    button.innerHTML = '<i class="bi ' + (isFavorite ? 'bi-heart-fill' : 'bi-heart') + '"></i>';
  }

  function applyFilters() {
    if (!search || !summary || !empty || !favoritesOnly) {
      cards.forEach(card => { card.hidden = false; });
      return;
    }
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    let visibleCount = 0;

    cards.forEach(card => {
      const haystack = (card.textContent + ' ' + card.dataset.keywords).toLocaleLowerCase('zh-CN');
      const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
      const queryMatch = !query || haystack.includes(query);
      const favoriteMatch = !favoritesOnly.checked || favorites.has(card.dataset.projectId);
      const matchesFilters = categoryMatch && queryMatch && favoriteMatch;
      const visible = matchesFilters;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    summary.textContent = '显示 ' + visibleCount + ' / ' + cards.length + ' 个作品';
    empty.hidden = visibleCount !== 0;
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    });
  });

  search?.addEventListener('input', applyFilters);
  favoritesOnly?.addEventListener('change', applyFilters);

  cards.forEach(card => {
    updateFavoriteButton(card);
    card.querySelector('.project-favorite').addEventListener('click', () => {
      const id = card.dataset.projectId;
      if (favorites.has(id)) favorites.delete(id);
      else favorites.add(id);
      saveFavorites();
      updateFavoriteButton(card);
      applyFilters();
      showToast(favorites.has(id) ? '已加入收藏。' : '已取消收藏。');
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setNavigationOpen(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!navLinks?.classList.contains('active')) return;
    if (!event.target.closest('#navbar')) setNavigationOpen(false);
  });

  applyFilters();

  const modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="project-modal__panel" role="dialog" aria-modal="true" aria-labelledby="projectModalTitle">
      <button class="project-modal__close" type="button" aria-label="关闭作品详情"><i class="bi bi-x-lg"></i></button>
      <img class="project-modal__image" alt="">
      <div class="project-modal__body">
        <h3 id="projectModalTitle"></h3>
        <p></p>
        <div class="project-tags"></div>
        <a class="btn project-modal__link"><i class="bi bi-box-arrow-up-right"></i> 打开作品</a>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const modalImage = modal.querySelector('.project-modal__image');
  const modalTitle = modal.querySelector('h3');
  const modalText = modal.querySelector('p');
  const modalTags = modal.querySelector('.project-tags');
  const modalLink = modal.querySelector('.project-modal__link');
  const closeButton = modal.querySelector('.project-modal__close');
  let returnFocus = null;

  function openModal(card, trigger) {
    const image = card.querySelector('img');
    const title = card.querySelector('h3').textContent.trim();
    const link = card.querySelector('.project-actions a');
    modal.dataset.projectId = card.dataset.projectId;
    modalImage.src = image.src;
    modalImage.alt = title + '预览';
    modalTitle.textContent = title;
    modalText.textContent = card.querySelector('.project-content > p').textContent.trim();
    modalTags.innerHTML = card.querySelector('.project-tags').innerHTML;
    modalLink.href = link.getAttribute('href');
    returnFocus = trigger;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    delete modal.dataset.projectId;
    document.body.style.overflow = '';
    returnFocus?.focus();
  }

  cards.forEach(card => {
    const trigger = card.querySelector('.project-detail');
    trigger.addEventListener('click', () => openModal(card, trigger));
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key !== 'Tab' || !modal.classList.contains('open')) return;

    const focusable = Array.from(modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element => !element.hidden && element.getClientRects().length > 0);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  applyFilters();
};

// ===== guestbook.js =====
window.initGuestbook = function initGuestbook() {
  const form = document.getElementById('guestbookForm');
  if (!form) return;

  const nameInput = document.getElementById('guestbookName');
  const messageInput = document.getElementById('guestbookMessage');
  const counter = document.getElementById('guestbookCounter');
  const count = document.getElementById('guestbookCount');
  const clearButton = document.getElementById('guestbookClear');
  const list = document.getElementById('guestbookList');
  const storageKey = 'xiaolin-guestbook-messages-v1';
  const maximumEntries = 50;
  let entries = [];

  try {
    const savedEntries = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(savedEntries)) {
      entries = savedEntries.filter(entry =>
        entry && typeof entry.id === 'string' && typeof entry.name === 'string' &&
        typeof entry.message === 'string' && Number.isFinite(entry.createdAt)
      ).slice(0, maximumEntries);
    }
  } catch (error) {
    entries = [];
  }

  function saveEntries() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
      return true;
    } catch (error) {
      return false;
    }
  }

  function formatDate(timestamp) {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(timestamp));
  }

  function createEntry(entry) {
    const article = document.createElement('article');
    article.className = 'guestbook-entry';
    article.dataset.entryId = entry.id;

    const avatar = document.createElement('span');
    avatar.className = 'guestbook-entry__avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = entry.name.trim().slice(0, 1).toUpperCase() || '访';

    const content = document.createElement('div');
    content.className = 'guestbook-entry__content';

    const header = document.createElement('div');
    header.className = 'guestbook-entry__header';

    const identity = document.createElement('div');
    const author = document.createElement('strong');
    author.textContent = entry.name;
    const time = document.createElement('time');
    time.dateTime = new Date(entry.createdAt).toISOString();
    time.textContent = formatDate(entry.createdAt);
    identity.append(author, time);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'guestbook-entry__delete';
    deleteButton.dataset.deleteEntry = entry.id;
    deleteButton.title = '删除这条留言';
    deleteButton.setAttribute('aria-label', '删除' + entry.name + '的留言');
    deleteButton.innerHTML = '<i class="bi bi-trash3" aria-hidden="true"></i>';

    const message = document.createElement('p');
    message.className = 'guestbook-entry__message';
    message.textContent = entry.message;

    header.append(identity, deleteButton);
    content.append(header, message);
    article.append(avatar, content);
    return article;
  }

  function renderEntries() {
    list.replaceChildren();
    count.textContent = entries.length + ' 条';
    if (clearButton) clearButton.hidden = entries.length === 0;

    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'guestbook-empty';
      empty.innerHTML = '<i class="bi bi-chat-square-heart" aria-hidden="true"></i><span>还没有留言</span>';
      list.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    entries.forEach(entry => fragment.appendChild(createEntry(entry)));
    list.appendChild(fragment);
  }

  function updateCounter() {
    counter.textContent = messageInput.value.length + ' / ' + messageInput.maxLength;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) {
      showToast('请填写昵称和留言内容。', 'error');
      (!name ? nameInput : messageInput).focus();
      return;
    }

    const createdAt = Date.now();
    entries.unshift({
      id: window.crypto?.randomUUID?.() || createdAt + '-' + Math.random().toString(36).slice(2),
      name: name.slice(0, nameInput.maxLength),
      message: message.slice(0, messageInput.maxLength),
      createdAt
    });
    entries = entries.slice(0, maximumEntries);
    const saved = saveEntries();
    renderEntries();
    form.reset();
    updateCounter();
    nameInput.focus();
    showToast(saved ? '留言已发布并保存在当前浏览器。' : '留言已发布，但浏览器阻止了本地保存。', saved ? 'success' : 'error');
  });

  messageInput.addEventListener('input', updateCounter);
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-entry]');
    if (!button) return;
    entries = entries.filter(entry => entry.id !== button.dataset.deleteEntry);
    saveEntries();
    renderEntries();
    showToast('留言已删除。');
  });

  clearButton?.addEventListener('click', () => {
    if (!entries.length || !window.confirm('确定清空当前浏览器中的全部留言吗？')) return;
    entries = [];
    saveEntries();
    renderEntries();
    showToast('已清空本机留言。');
  });

  updateCounter();
  renderEntries();
};

// ===== enhancements.js =====
window.initSiteEnhancements = function initSiteEnhancements() {
  const palette = document.createElement('div');
  palette.className = 'command-palette';
  palette.setAttribute('role', 'dialog');
  palette.setAttribute('aria-modal', 'true');
  palette.setAttribute('aria-label', '快速搜索');
  palette.setAttribute('aria-hidden', 'true');
  palette.innerHTML = `
    <div class="command-palette__panel">
      <input class="command-palette__input" type="search" autocomplete="off" placeholder="搜索栏目、服务或快捷操作…" role="combobox" aria-expanded="false" aria-controls="commandPaletteResults" aria-autocomplete="list">
      <div class="command-palette__results" id="commandPaletteResults" role="listbox"></div>
    </div>`;
  document.body.appendChild(palette);

  const input = palette.querySelector('.command-palette__input');
  const results = palette.querySelector('.command-palette__results');
  let activeIndex = -1;
  const entries = [
    { label: '首页', detail: '返回首页', icon: 'bi-house', target: '#home' },
    { label: '关于我们', detail: '了解团队与能力', icon: 'bi-person', target: '#about' },
    { label: '技能方向', detail: '查看技能进度', icon: 'bi-bar-chart', target: '#about' },
    { label: '服务', detail: '查看全部服务', icon: 'bi-grid', target: '#services' },
    { label: '作品集', detail: '浏览项目作品', icon: 'bi-folder2-open', target: '#portfolio' },
    { label: '联系我们', detail: '发送留言或查看联系方式', icon: 'bi-chat-dots', target: '#contact' },
    { label: '切换深浅模式', detail: '在日间与夜间模式间切换', icon: 'bi-circle-half', action: () => document.getElementById('themeToggle')?.click() },
    { label: '音乐播放器', detail: '打开或关闭音乐播放器', icon: 'bi-music-note-beamed', action: () => document.getElementById('musicToggle')?.click() },
    { label: '效果设置', detail: '管理背景与光标效果', icon: 'bi-sliders', action: () => document.getElementById('effectSettingsToggle')?.click() },
    { label: '轮换主题色', detail: '切换到下一套页面配色', icon: 'bi-palette', action: cycleAccentTheme },
    ...Array.from(document.querySelectorAll('#services .service-item')).map(item => ({
      label: item.querySelector('h3')?.textContent.trim() || '服务',
      detail: '咨询这项服务',
      icon: 'bi-arrow-right-circle',
      target: '#contact'
    }))
  ];

  function cycleAccentTheme() {
    const names = Object.keys(window.siteAccentThemes || {});
    if (!names.length) return;
    const current = document.documentElement.dataset.accent || names[0];
    const next = names[(names.indexOf(current) + 1) % names.length];
    document.querySelector('[data-accent-theme="' + next + '"]')?.click();
  }

  function executeEntry(entry) {
    closePalette();
    if (entry.action) entry.action();
    else document.querySelector(entry.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setActiveResult(index) {
    const buttons = Array.from(results.querySelectorAll('.command-palette__result'));
    if (!buttons.length) {
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
      return;
    }
    activeIndex = (index + buttons.length) % buttons.length;
    buttons.forEach((button, buttonIndex) => {
      const active = buttonIndex === activeIndex;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    input.setAttribute('aria-activedescendant', buttons[activeIndex].id);
    buttons[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function renderResults(query = '') {
    const normalized = query.trim().toLowerCase();
    const filtered = entries.filter(entry =>
      !normalized || (entry.label + entry.detail).toLowerCase().includes(normalized)
    );
    results.innerHTML = '';
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
    if (!filtered.length) {
      results.innerHTML = '<div class="command-palette__empty">没有找到匹配内容</div>';
      return;
    }
    filtered.forEach((entry, index) => {
      const button = document.createElement('button');
      button.className = 'command-palette__result';
      button.type = 'button';
      button.id = 'commandResult' + index;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', 'false');
      button.innerHTML = '<i class="bi ' + entry.icon + '"></i><span><strong></strong><small></small></span>';
      button.querySelector('strong').textContent = entry.label;
      button.querySelector('small').textContent = ' · ' + entry.detail;
      button.addEventListener('pointermove', () => setActiveResult(index));
      button.addEventListener('click', () => executeEntry(entry));
      results.appendChild(button);
    });
  }

  function openPalette() {
    renderResults();
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    input.setAttribute('aria-expanded', 'true');
    input.value = '';
    input.focus();
  }
  function closePalette() {
    if (!palette.classList.contains('open')) return;
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  const searchButton = document.getElementById('quickSearch');
  searchButton?.addEventListener('click', openPalette);
  input.addEventListener('input', () => renderResults(input.value));
  input.addEventListener('keydown', event => {
    const buttons = Array.from(results.querySelectorAll('.command-palette__result'));
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResult(activeIndex + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult(activeIndex <= 0 ? buttons.length - 1 : activeIndex - 1);
    } else if (event.key === 'Enter' && buttons.length) {
      event.preventDefault();
      buttons[activeIndex >= 0 ? activeIndex : 0].click();
    }
  });
  palette.addEventListener('click', event => {
    if (event.target === palette) closePalette();
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      palette.classList.contains('open') ? closePalette() : openPalette();
    }
    if (event.key === 'Escape') closePalette();
  });

  document.querySelectorAll('.item-button').forEach(button => {
    button.addEventListener('click', () => {
      const service = button.closest('.service-item')?.querySelector('h3')?.textContent.trim();
      const message = document.querySelector('#contactForm textarea[name="message"]');
      if (service && message && !message.value) {
        message.value = '我想咨询：' + service + '。';
        message.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  const message = document.querySelector('#contactForm textarea[name="message"]');
  if (message) {
    message.maxLength = 500;
    const counter = document.createElement('small');
    counter.className = 'message-counter';
    message.insertAdjacentElement('afterend', counter);
    const updateCounter = () => { counter.textContent = message.value.length + ' / 500'; };
    message.addEventListener('input', updateCounter);
    updateCounter();
  }

  document.querySelectorAll('#portfolio img').forEach(image => {
    image.loading = 'lazy';
    image.decoding = 'async';
  });
};
// ===== 1. 粒子星空背景 =====
window.initParticleStarfield = function initParticleStarfield() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const c = document.createElement('canvas');
  c.id = 'particle-starfield';
  c.setAttribute('aria-hidden', 'true');
  document.body.prepend(c);
  const ctx = c.getContext('2d');
  let pts = [], mx = -9999, my = -9999, raf = null, scrollY = 0, enabled = true;
  const resize = () => { c.width = innerWidth; c.height = innerHeight; };
  resize();
  addEventListener('resize', resize);
  addEventListener('scroll', function() { scrollY = window.scrollY || window.pageYOffset; }, { passive: true });
  const create = () => {
    const count = Math.min(80, Math.floor(innerWidth * innerHeight / 12000));
    pts = [];
    for (let i = 0; i < count; i++) pts.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: 1.2 + Math.random() * 2.5, dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35, a: 0.3 + Math.random() * 0.5, d: 0.3 + Math.random() * 0.7 });
  };
  create();
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  addEventListener('mouseleave', () => { mx = -9999; my = -9999; });
  const draw = () => {
    if (!enabled) {
      raf = null;
      return;
    }
    ctx.clearRect(0, 0, c.width, c.height);
    const dark = document.documentElement.dataset.theme === 'dark';
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
      if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
      const dx = mx - p.x, dy = my - p.y, dist = Math.hypot(dx, dy);
      if (dist < 180) { const f = (180 - dist) / 180 * 0.04; p.x -= dx * f; p.y -= dy * f; }
      const parallaxY = p.y + p.d * scrollY * 0.15;
      const px = p.x, py = parallaxY;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dark ? 'rgba(150,200,255,' + p.a * 0.6 + ')' : 'rgba(0,102,255,' + p.a * 0.4 + ')';
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const p2 = pts[j], d2 = Math.hypot(px - (p2.x + p2.d * scrollY * 0.15), py - (p2.y + p2.d * scrollY * 0.15));
        if (d2 < 120) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p2.x + p2.d * scrollY * 0.15, p2.y + p2.d * scrollY * 0.15); ctx.strokeStyle = dark ? 'rgba(150,200,255,' + (1 - d2 / 120) * 0.15 + ')' : 'rgba(0,102,255,' + (1 - d2 / 120) * 0.1 + ')'; ctx.lineWidth = 0.8; ctx.stroke(); }
      }
    }
    raf = requestAnimationFrame(draw);
  };

  const setEnabled = nextEnabled => {
    enabled = nextEnabled;
    c.hidden = !enabled;
    if (!enabled) {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      ctx.clearRect(0, 0, c.width, c.height);
    } else if (raf === null) {
      draw();
    }
  };

  document.addEventListener('site-effect-change', event => {
    if (event.detail?.effect === 'starfield') setEnabled(event.detail.enabled);
  });

  setEnabled(!document.documentElement.classList.contains('effect-starfield-off'));
};
// ===== 3. 滚动进度圆环返回顶部 =====
window.initScrollRing = function initScrollRing() {
  const old = document.getElementById('backToTop'); if (old) old.style.display = 'none';
  const wrap = document.createElement('div');
  wrap.className = 'scroll-ring-wrap';
  wrap.setAttribute('role','button'); wrap.setAttribute('tabindex','0'); wrap.setAttribute('aria-label','返回顶部');
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns,'svg');
  svg.setAttribute('class','scroll-ring-svg'); svg.setAttribute('viewBox','0 0 54 54');
  const bg = document.createElementNS(ns,'circle');
  bg.setAttribute('class','scroll-ring-bg'); bg.setAttribute('cx','27'); bg.setAttribute('cy','27'); bg.setAttribute('r','23');
  svg.appendChild(bg);
  const prog = document.createElementNS(ns,'circle');
  prog.setAttribute('class','scroll-ring-progress'); prog.setAttribute('cx','27'); prog.setAttribute('cy','27'); prog.setAttribute('r','23');
  prog.setAttribute('stroke-dasharray','144.51'); prog.setAttribute('stroke-dashoffset','0');
  svg.appendChild(prog);
  wrap.appendChild(svg);
  const hb = document.createElement('div'); hb.className = 'scroll-ring-hover-bg'; wrap.appendChild(hb);
  const icon = document.createElement('i'); icon.className = 'bi bi-arrow-up scroll-ring-icon'; wrap.appendChild(icon);
  document.body.appendChild(wrap);
  const circ = 144.51; let tick = false;
  const update = () => {
    const st = window.scrollY, dh = document.documentElement.scrollHeight - innerHeight;
    const p = dh > 0 ? st / dh : 0;
    prog.setAttribute('stroke-dashoffset', circ * (1 - p));
    wrap.classList.toggle('visible', st > 300);
  };
  addEventListener('scroll', () => { if (!tick) { requestAnimationFrame(() => { update(); tick = false; }); tick = true; } });
  wrap.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
  update();
};
// ===== 5. 全屏点击波纹 =====
window.initPageRipple = function initPageRipple() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div'); layer.className = 'page-ripple-layer'; document.body.appendChild(layer);
  document.addEventListener('click', e => {
    const r = document.createElement('span'); r.className = 'page-ripple';
    const s = 30 + Math.random() * 40;
    r.style.width = s + 'px'; r.style.height = s + 'px';
    r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px';
    layer.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
};
// ===== 4. 时间问候语 =====
window.initTimeGreeting = function initTimeGreeting() {
  const h1 = document.querySelector('header h1'); if (!h1) return;
  const hour = new Date().getHours();
  let g, e;
  if (hour < 6) { g = '凌晨好'; e = '\u{1F319}'; }
  else if (hour < 9) { g = '早上好'; e = '\u{1F305}'; }
  else if (hour < 12) { g = '上午好'; e = '\u2600\uFE0F'; }
  else if (hour < 14) { g = '中午好'; e = '\u{1F31E}'; }
  else if (hour < 18) { g = '下午好'; e = '\u{1F324}\uFE0F'; }
  else if (hour < 22) { g = '晚上好'; e = '\u{1F306}'; }
  else { g = '夜深了'; e = '\u{1F303}'; }
  const span = document.createElement('span');
  span.className = 'time-greeting';
  span.textContent = g + '\uFF0C' + e + ' \u6B22\u8FCE\u6765\u5230\u5C0F\u6797\u7684\u5DE5\u4F5C\u5BA4';
  h1.insertAdjacentElement('afterend', span);
};
// ===== 6. 卡片悬浮渐变边框 =====
window.initGradientBorder = function initGradientBorder() {
  document.querySelectorAll('.card:not(#contact)').forEach(function(card) {
    card.classList.add('gradient-border');
  });
};

// ===== 7. 滚动文字逐行揭示 =====
window.initTextReveal = function initTextReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.card p').forEach(function(p) {
    if (p.closest('.service-item') || p.closest('.section-actions')) return;
    if (p.classList.contains('reveal-text')) return;
    if (p.textContent.trim().length < 20) {
      p.classList.add('reveal-text');
      return;
    }

    p.classList.add('reveal-text');

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(p);
  });
};
// ===== 8. header typing rotate =====
window.initTypingRotate = function initTypingRotate() {
  var q = document.querySelector("header h1");
  if (!q) return;
  var L = ["探索无限可能，创造美好未来", "用代码构建梦想，用创意点亮生活", "每一次相遇，都是最好的安排"];
  var p = document.querySelector("header .typing-rotate");
  if (!p) { p = document.createElement("p"); p.className = "typing-rotate"; q.insertAdjacentElement("afterend", p); }
  var i = 0, ci = 0, del = false;
  function ty() {
    var f = L[i];
    if (del) {
      p.textContent = f.substring(0, ci); ci--;
      if (ci < 0) { del = false; i = (i + 1) % L.length; ci = 0; setTimeout(ty, 400); return; }
      setTimeout(ty, 35);
    } else {
      p.textContent = f.substring(0, ci + 1); ci++;
      if (ci >= f.length) { del = true; setTimeout(ty, 2200); return; }
      setTimeout(ty, 80 + Math.random() * 40);
    }
  }
  setTimeout(ty, 600);
};

// ===== 9. 可持久化的效果设置 =====
window.initEffectSettings = function initEffectSettings() {
  const toggle = document.getElementById('effectSettingsToggle');
  const panel = document.getElementById('effectSettingsPanel');
  const closeButton = document.getElementById('closeEffectSettings');
  if (!toggle || !panel || !closeButton) return;

  const storageKey = 'lin-effect-settings';
  const checkboxes = Array.from(panel.querySelectorAll('[data-effect]'));
  const presetButtons = Array.from(panel.querySelectorAll('[data-effect-preset]'));
  const presets = {
    fresh: { ambient: true, petals: false, starfield: false, trails: true },
    romantic: { ambient: true, petals: true, starfield: false, trails: true },
    starry: { ambient: true, petals: false, starfield: true, trails: true },
    quiet: { ambient: false, petals: false, starfield: false, trails: false }
  };
  let saved = {};

  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch (error) {
    saved = {};
  }

  function save() {
    const state = {};
    checkboxes.forEach(input => { state[input.dataset.effect] = input.checked; });
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      // Settings still apply for the current page when storage is unavailable.
    }
  }

  function applyEffect(effect, enabled, persist) {
    document.documentElement.classList.toggle('effect-' + effect + '-off', !enabled);
    document.dispatchEvent(new CustomEvent('site-effect-change', {
      detail: { effect: effect, enabled: enabled }
    }));
    if (persist) save();
  }

  function updateActivePreset() {
    const activeName = Object.keys(presets).find(name =>
      checkboxes.every(input => presets[name][input.dataset.effect] === input.checked)
    );
    presetButtons.forEach(button => {
      const active = button.dataset.effectPreset === activeName;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function applyPreset(name) {
    const preset = presets[name];
    if (!preset) return;
    checkboxes.forEach(input => {
      input.checked = preset[input.dataset.effect];
      applyEffect(input.dataset.effect, input.checked, false);
    });
    save();
    updateActivePreset();
  }

  function setPanel(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭效果设置' : '打开效果设置');
    toggle.classList.toggle('active', open);
    if (open) {
      document.dispatchEvent(new CustomEvent('site-panel-open', { detail: { panel: 'effects' } }));
      closeButton.focus();
    }
  }

  checkboxes.forEach(input => {
    const enabled = saved[input.dataset.effect] !== false;
    input.checked = enabled;
    applyEffect(input.dataset.effect, enabled, false);
    input.addEventListener('change', () => {
      applyEffect(input.dataset.effect, input.checked, true);
      updateActivePreset();
    });
  });

  presetButtons.forEach(button => {
    button.addEventListener('click', () => applyPreset(button.dataset.effectPreset));
  });
  updateActivePreset();

  toggle.addEventListener('click', () => setPanel(panel.hidden));
  closeButton.addEventListener('click', () => {
    setPanel(false);
    toggle.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setPanel(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!panel.hidden && !panel.contains(event.target) && !toggle.contains(event.target)) setPanel(false);
  });
  document.addEventListener('site-panel-open', event => {
    if (event.detail?.panel !== 'effects' && !panel.hidden) setPanel(false);
  });

  setPanel(false);
};

// ===== 10. page entrance animation =====
window.initEntrance = function initEntrance() {
  document.body.classList.add("entrance-init");
  requestAnimationFrame(function() { requestAnimationFrame(function() { document.body.classList.add("entrance-ready"); }); });
  setTimeout(function() { document.body.classList.remove("entrance-init", "entrance-ready"); }, 1500);
};

// ===== main.js =====

renderHomeComponents();
initEntrance();
initNightMode();
initAccentTheme();
initHomeEffects();
initAdvancedFeatures();
initSiteEnhancements();
initPortfolioExplorer();
initGuestbook();
initTypewriter();
initParticleStarfield();
initScrollRing();
initTimeGreeting();
initPageRipple();
initParticleTrail();
initSkillBars();
initCountUp();
initGradientBorder();
initTypingRotate();
initTextReveal();
initSectionNav();
initAmbientBg();
initPetals();
initEffectSettings();

const audio = document.getElementById('bgMusic');
const deferredAudioSource = audio.querySelector('source[data-src]');
const musicWin = document.getElementById('musicWin');
const musicToggle = document.getElementById('musicToggle');
const musicProgress = document.getElementById('musicProgress');
const musicCurrentTime = document.getElementById('musicCurrentTime');
const musicDuration = document.getElementById('musicDuration');
const musicStatus = document.getElementById('musicStatus');
const homeMusicStatus = document.getElementById('homeMusicStatus');
const volumeSlider = document.getElementById('volumeSlider');
const muteButton = document.getElementById('muteBtn');
const musicSpectrum = document.getElementById('musicSpectrum');
const spectrumContext = musicSpectrum.getContext('2d');
let lastAudibleVolume = .7;
let audioContext = null;
let audioSource = null;
let audioAnalyser = null;
let spectrumData = null;
let spectrumFrame = 0;
let spectrumUnavailable = false;

audio.volume = lastAudibleVolume;

function formatAudioTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return minutes + ':' + seconds;
}

function updateMusicToggle(open) {
  musicToggle.setAttribute('aria-expanded', String(open));
  musicToggle.setAttribute('aria-label', open ? '关闭音乐播放器' : '打开音乐播放器');
  musicToggle.classList.toggle('active', open);
}

function setMusicWindow(open) {
  musicWin.hidden = !open;
  updateMusicToggle(open);
  if (open) {
    document.dispatchEvent(new CustomEvent('site-panel-open', { detail: { panel: 'music' } }));
    requestAnimationFrame(syncMusicSpectrum);
  } else {
    stopMusicSpectrum(false);
  }
}

function updateVolumeButton() {
  const muted = audio.muted || audio.volume === 0;
  muteButton.innerHTML = '<i class="bi ' + (muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill') + '"></i>';
  muteButton.title = muted ? '取消静音' : '静音';
  muteButton.setAttribute('aria-label', muteButton.title);
  muteButton.setAttribute('aria-pressed', String(muted));
}

function updateAudioProgress() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  const progress = duration > 0 ? audio.currentTime / duration * 100 : 0;
  musicProgress.value = String(progress);
  musicCurrentTime.textContent = formatAudioTime(audio.currentTime);
  musicDuration.textContent = formatAudioTime(duration);
}

function getSpectrumSize() {
  const width = musicSpectrum.clientWidth;
  const height = musicSpectrum.clientHeight;
  if (!width || !height) return null;

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(width * pixelRatio);
  const pixelHeight = Math.round(height * pixelRatio);
  if (musicSpectrum.width !== pixelWidth || musicSpectrum.height !== pixelHeight) {
    musicSpectrum.width = pixelWidth;
    musicSpectrum.height = pixelHeight;
  }
  spectrumContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  return { width, height };
}

function getSpectrumColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--theme').trim() || '#0066ff';
}

function drawIdleSpectrum(animate = false) {
  if (musicWin.hidden) return;
  const size = getSpectrumSize();
  if (!size) return;

  const barCount = 28;
  const gap = 3;
  const barWidth = Math.max(2, (size.width - gap * (barCount - 1)) / barCount);
  spectrumContext.clearRect(0, 0, size.width, size.height);
  spectrumContext.fillStyle = getSpectrumColor();
  const phase = animate ? performance.now() / 420 : 0;
  for (let index = 0; index < barCount; index += 1) {
    const barHeight = 6 + (Math.sin(index * .78 + phase) + 1) * 8;
    spectrumContext.fillRect(index * (barWidth + gap), size.height - barHeight, barWidth, barHeight);
  }
  spectrumContext.globalAlpha = 1;
}

function canAnimateSpectrum() {
  return audioAnalyser && !audio.paused && !musicWin.hidden && !document.hidden;
}

function drawMusicSpectrum() {
  if (!canAnimateSpectrum()) {
    spectrumFrame = 0;
    const animateIdle = !audio.paused && !musicWin.hidden && !document.hidden;
    drawIdleSpectrum(animateIdle);
    if (animateIdle) spectrumFrame = requestAnimationFrame(drawMusicSpectrum);
    return;
  }

  const size = getSpectrumSize();
  if (!size) {
    spectrumFrame = 0;
    return;
  }

  audioAnalyser.getByteFrequencyData(spectrumData);
  const barCount = 28;
  const gap = 3;
  const barWidth = Math.max(2, (size.width - gap * (barCount - 1)) / barCount);
  const sampleStep = Math.max(1, Math.floor(spectrumData.length * .72 / barCount));
  spectrumContext.clearRect(0, 0, size.width, size.height);
  spectrumContext.fillStyle = getSpectrumColor();

  for (let index = 0; index < barCount; index += 1) {
    const strength = spectrumData[index * sampleStep] / 255;
    const barHeight = Math.max(7, Math.pow(strength, .55) * (size.height - 4));
    spectrumContext.globalAlpha = .48 + strength * .52;
    spectrumContext.fillRect(index * (barWidth + gap), size.height - barHeight, barWidth, barHeight);
  }
  spectrumContext.globalAlpha = 1;
  spectrumFrame = requestAnimationFrame(drawMusicSpectrum);
}

function stopMusicSpectrum(showIdle = true) {
  if (spectrumFrame) cancelAnimationFrame(spectrumFrame);
  spectrumFrame = 0;
  if (showIdle) drawIdleSpectrum();
}

function syncMusicSpectrum() {
  stopMusicSpectrum(false);
  const shouldAnimate = !audio.paused && !musicWin.hidden && !document.hidden;
  if (shouldAnimate) {
    spectrumFrame = requestAnimationFrame(drawMusicSpectrum);
  } else {
    drawIdleSpectrum();
  }
}

async function ensureAudioAnalyser() {
  if (spectrumUnavailable) return;
  try {
    if (!audioContext) {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) {
        spectrumUnavailable = true;
        return;
      }
      audioContext = new AudioContextConstructor();
      audioSource = audioContext.createMediaElementSource(audio);
      audioAnalyser = audioContext.createAnalyser();
      audioAnalyser.fftSize = 128;
      audioAnalyser.smoothingTimeConstant = .82;
      spectrumData = new Uint8Array(audioAnalyser.frequencyBinCount);
      audioSource.connect(audioAnalyser);
      audioAnalyser.connect(audioContext.destination);
    }
    if (audioContext.state === 'suspended') await audioContext.resume();
  } catch (error) {
    spectrumUnavailable = true;
    audioAnalyser = null;
  }
}

async function playMusic() {
  // Start the media element directly. The analyser is optional and must not
  // be able to prevent the actual background audio from reaching the output.
  if (deferredAudioSource && !deferredAudioSource.hasAttribute('src')) {
    deferredAudioSource.src = deferredAudioSource.dataset.src;
    audio.load();
  }
  audio.play().catch(() => showToast('浏览器阻止了音乐播放，请再次点击播放按钮。', 'error'));
}

musicToggle.addEventListener('click', () => setMusicWindow(musicWin.hidden));
document.getElementById('homePlay').addEventListener('click', playMusic);
document.getElementById('homePause').addEventListener('click', () => audio.pause());
document.getElementById('playBtn').addEventListener('click', playMusic);
document.getElementById('pauseBtn').addEventListener('click', () => audio.pause());
document.getElementById('stopBtn').addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  musicStatus.textContent = '已停止';
  homeMusicStatus.textContent = '背景音乐';
  updateAudioProgress();
});
document.getElementById('closeMusic').addEventListener('click', () => {
  setMusicWindow(false);
});

musicProgress.addEventListener('input', () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = Number(musicProgress.value) / 100 * audio.duration;
  updateAudioProgress();
});

volumeSlider.addEventListener('input', () => {
  const nextVolume = Math.max(0, Math.min(1, Number(volumeSlider.value) / 100));
  audio.volume = nextVolume;
  audio.muted = false;
  if (nextVolume > 0) lastAudibleVolume = nextVolume;
  updateVolumeButton();
});

muteButton.addEventListener('click', () => {
  if (audio.muted || audio.volume === 0) {
    audio.muted = false;
    if (audio.volume === 0) audio.volume = lastAudibleVolume;
  } else {
    lastAudibleVolume = audio.volume;
    audio.muted = true;
  }
  volumeSlider.value = String(Math.round((audio.muted ? 0 : audio.volume) * 100));
  updateVolumeButton();
});

audio.addEventListener('loadedmetadata', updateAudioProgress);
audio.addEventListener('durationchange', updateAudioProgress);
audio.addEventListener('timeupdate', updateAudioProgress);
audio.addEventListener('play', () => {
  musicStatus.textContent = '正在播放';
  homeMusicStatus.textContent = '正在播放';
  syncMusicSpectrum();
});
audio.addEventListener('pause', () => {
  if (audio.currentTime > 0) musicStatus.textContent = '已暂停';
  homeMusicStatus.textContent = audio.currentTime > 0 ? '已暂停' : '背景音乐';
  stopMusicSpectrum();
});

document.addEventListener('visibilitychange', syncMusicSpectrum);
window.addEventListener('resize', syncMusicSpectrum);
new MutationObserver(() => {
  if (!spectrumFrame) drawIdleSpectrum();
}).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-accent', 'style'] });

const musicHead = musicWin.querySelector('.music-head');
let offsetX = 0;
let offsetY = 0;
let dragPointerId = null;

function moveMusicWin(clientX, clientY) {
  const maxLeft = Math.max(0, window.innerWidth - musicWin.offsetWidth);
  const maxTop = Math.max(0, window.innerHeight - musicWin.offsetHeight);
  const left = Math.min(Math.max(0, clientX - offsetX), maxLeft);
  const top = Math.min(Math.max(0, clientY - offsetY), maxTop);

  musicWin.style.left = left + 'px';
  musicWin.style.top = top + 'px';
}

musicHead.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0 || event.target.closest('button')) return;

  const rect = musicWin.getBoundingClientRect();
  dragPointerId = event.pointerId;
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;

  // Switch from right/bottom anchoring to left/top before moving. Keeping both
  // top and bottom set makes an auto-height fixed element stretch vertically.
  musicWin.style.left = rect.left + 'px';
  musicWin.style.top = rect.top + 'px';
  musicWin.style.right = 'auto';
  musicWin.style.bottom = 'auto';
  musicWin.classList.add('is-dragging');
  musicHead.setPointerCapture(event.pointerId);
  event.preventDefault();
});

musicHead.addEventListener('pointermove', event => {
  if (event.pointerId !== dragPointerId) return;
  moveMusicWin(event.clientX, event.clientY);
});

function stopMusicDrag(event) {
  if (event.pointerId !== dragPointerId) return;
  dragPointerId = null;
  musicWin.classList.remove('is-dragging');
  if (musicHead.hasPointerCapture(event.pointerId)) {
    musicHead.releasePointerCapture(event.pointerId);
  }
}

musicHead.addEventListener('pointerup', stopMusicDrag);
musicHead.addEventListener('pointercancel', stopMusicDrag);

audio.addEventListener('error', () => {
  showToast('无法加载背景音乐，请确认音乐文件是否存在。', 'error');
});

updateMusicToggle(false);
updateVolumeButton();
updateAudioProgress();

document.addEventListener('site-panel-open', event => {
  if (event.detail?.panel !== 'music' && !musicWin.hidden) setMusicWindow(false);
});

document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.getElementById('contactFormStatus');
  const formData = new FormData(event.target);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const subject = '来自个人网站的留言 - ' + name;
  const body = '姓名：' + name + '\n邮箱：' + email + '\n\n留言：\n' + message;
  if (status) {
    status.hidden = false;
    status.textContent = '邮件应用即将打开，请在邮件应用中确认发送。';
  }
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.innerHTML = '<i class="bi bi-check2-circle"></i> 已准备邮件';
  }
  showToast('正在打开邮件应用，请确认发送。');
  window.location.href = 'mailto:wlin3692@163.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});

document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = 'true';
  image.alt = '图片暂时无法加载';
  image.classList.add('image-load-fallback');
  image.removeAttribute('src');
}, true);
