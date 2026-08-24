(function initPageTransitions() {
  const root = document.documentElement;
  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.alt = '图片暂时无法加载';
    image.classList.add('image-load-fallback');
    image.removeAttribute('src');
  }, true);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const transitionDuration = 240;
  let navigating = false;

  root.classList.add('page-transition-enabled');

  function showPage() {
    navigating = false;
    root.classList.remove('page-transition-leaving');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add('page-transition-entered'));
    });
  }

  function getNavigationTarget(element) {
    const anchor = element.matches('a[href]') ? element : null;
    if (anchor) {
      if (anchor.hasAttribute('download')) return null;
      const target = anchor.getAttribute('target');
      if (target && target.toLowerCase() !== '_self') return null;
    }

    const rawHref = anchor?.getAttribute('href') || element.dataset.transitionHref;
    if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) return null;

    let url;
    try {
      url = new URL(rawHref, window.location.href);
    } catch (error) {
      return null;
    }

    const sameSite = url.origin === window.location.origin ||
      (url.protocol === 'file:' && window.location.protocol === 'file:');
    if (!sameSite || !['http:', 'https:', 'file:'].includes(url.protocol)) return null;
    if (url.href === window.location.href) return null;
    return url;
  }

  function navigate(element, event) {
    if (navigating) return;
    const url = getNavigationTarget(element);
    if (!url) return;

    event.preventDefault();
    navigating = true;
    root.classList.remove('page-transition-entered');
    root.classList.add('page-transition-leaving');
    window.setTimeout(() => window.location.assign(url.href), reduceMotion.matches ? 0 : transitionDuration);
  }

  let iconViewer = null;
  let iconReturnFocus = null;
  function closeIconViewer() {
    if (!iconViewer) return;
    const video = iconViewer.querySelector('.brand-icon-viewer__video');
    video?.pause();
    iconViewer.classList.remove('is-open');
    iconViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    iconReturnFocus?.focus();
  }
  function openIconViewer(icon) {
    if (!iconViewer) {
      iconViewer = document.createElement('div');
      iconViewer.className = 'brand-icon-viewer';
      iconViewer.setAttribute('aria-hidden', 'true');
      iconViewer.innerHTML = '<div class="brand-icon-viewer__panel" role="dialog" aria-modal="true" aria-label="龙盾动画"><button type="button" class="brand-icon-viewer__close" aria-label="关闭图标预览">×</button><video class="brand-icon-viewer__video" playsinline preload="auto" controls></video><img class="brand-icon-viewer__image" alt="网站龙盾图标" hidden></div>';
      document.body.appendChild(iconViewer);
      iconViewer.addEventListener('click', event => { if (event.target === iconViewer || event.target.closest('.brand-icon-viewer__close')) closeIconViewer(); });
      iconViewer.querySelector('.brand-icon-viewer__video').addEventListener('ended', () => {
        const video = iconViewer.querySelector('.brand-icon-viewer__video');
        const image = iconViewer.querySelector('.brand-icon-viewer__image');
        video.hidden = true;
        image.hidden = false;
        image.focus?.();
      });
    }
    iconReturnFocus = icon;
    const video = iconViewer.querySelector('.brand-icon-viewer__video');
    const image = iconViewer.querySelector('.brand-icon-viewer__image');
    image.src = icon.dataset.fullSrc || icon.currentSrc || icon.src;
    if (icon.dataset.videoSrc) {
      video.hidden = false;
      image.hidden = true;
      video.loop = false;
      video.src = icon.dataset.videoSrc;
      video.currentTime = 0;
    } else {
      video.hidden = true;
      image.hidden = false;
    }
    iconViewer.classList.add('is-open');
    iconViewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    iconViewer.querySelector('.brand-icon-viewer__close').focus();
    if (icon.dataset.videoSrc) {
      video.play().catch(() => { video.controls = true; });
    }
  }

  document.addEventListener('click', event => {
    const icon = event.target.closest('.site-brand-icon');
    if (!icon) return;
    event.preventDefault();
    event.stopPropagation();
    openIconViewer(icon);
  });

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const element = event.target.closest('a[href], [data-transition-href]');
    if (element) navigate(element, event);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && iconViewer?.classList.contains('is-open')) {
      closeIconViewer();
      return;
    }
    if (event.defaultPrevented || (event.key !== 'Enter' && event.key !== ' ')) return;
    if (event.target.closest('.site-brand-icon')) {
      event.preventDefault();
      openIconViewer(event.target.closest('.site-brand-icon'));
      return;
    }
    const element = event.target.closest('[data-transition-href]');
    if (element) navigate(element, event);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPage, { once: true });
  } else {
    showPage();
  }
  window.addEventListener('pageshow', showPage);
})();
