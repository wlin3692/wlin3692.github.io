// 全部作品页的筛选、收藏和详情弹窗。
(function initProjectsPage() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const search = document.getElementById('portfolioSearch');
  const filters = Array.from(document.querySelectorAll('.portfolio-filter'));
  const favoritesOnly = document.getElementById('portfolioFavoritesOnly');
  const sortSelect = document.getElementById('portfolioSort');
  const resetButton = document.getElementById('portfolioReset');
  const summary = document.getElementById('portfolioSummary');
  const empty = document.getElementById('portfolioEmpty');
  const viewButtons = Array.from(document.querySelectorAll('[data-portfolio-view]'));
  const storageKey = 'xiaolin-portfolio-favorites';
  const viewStorageKey = 'xiaolin-portfolio-view';
  let activeFilter = 'all';
  let activeSort = 'featured';
  let favorites = new Set();
  let activeView = 'grid';

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  const initialFilter = params.get('category');
  const initialSort = params.get('sort');
  if (search) search.value = initialQuery;
  if (filters.some((item) => item.dataset.filter === initialFilter)) activeFilter = initialFilter;
  if (['featured', 'title', 'newest'].includes(initialSort)) activeSort = initialSort;
  if (sortSelect) sortSelect.value = activeSort;
  if (favoritesOnly) favoritesOnly.checked = params.get('favorites') === '1';
  try {
    const savedView = localStorage.getItem(viewStorageKey);
    if (savedView === 'list' || savedView === 'grid') activeView = savedView;
  } catch (error) {
    // 使用默认网格视图。
  }

  function applyView(view, persist = true) {
    activeView = view === 'list' ? 'list' : 'grid';
    grid.dataset.view = activeView;
    viewButtons.forEach((button) => {
      const selected = button.dataset.portfolioView === activeView;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (persist) {
      try { localStorage.setItem(viewStorageKey, activeView); } catch (error) { /* storage unavailable */ }
    }
  }

  try {
    favorites = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));
  } catch (error) {
    favorites = new Set();
  }

  const notify = window.showToast || function notify(message) {
    let region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.innerHTML = '<i class="bi bi-check-circle"></i><span></span>';
    toast.querySelector('span').textContent = message;
    region.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2800);
  };

  function saveFavorites() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      // 隐私模式下仍允许正常浏览作品。
    }
  }

  function updateFavoriteButton(card) {
    const button = card.querySelector('.project-favorite');
    if (!button) return;
    const selected = favorites.has(card.dataset.projectId);
    const title = card.querySelector('h3')?.textContent.trim() || '作品';
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', (selected ? '取消收藏' : '收藏') + title);
    button.title = selected ? '取消收藏' : '收藏';
    button.innerHTML = '<i class="bi ' + (selected ? 'bi-heart-fill' : 'bi-heart') + '"></i>';
  }

  function applyFilters() {
    if (!search || !summary || !empty || !favoritesOnly) {
      cards.forEach((card) => { card.hidden = false; });
      return;
    }
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    let visible = 0;
    cards.forEach(card => {
      const haystack = (card.textContent + ' ' + (card.dataset.keywords || '')).toLocaleLowerCase('zh-CN');
      const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
      const queryMatch = !query || haystack.includes(query);
      const favoriteMatch = !favoritesOnly.checked || favorites.has(card.dataset.projectId);
      const matches = categoryMatch && queryMatch && favoriteMatch;
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    summary.textContent = '显示 ' + visible + ' / ' + cards.length + ' 个作品';
    empty.hidden = visible !== 0;
    filters.forEach((button) => {
      const count = button.querySelector('.portfolio-filter-count');
      if (!count) return;
      const category = button.dataset.filter;
      count.textContent = category === 'all'
        ? cards.length
        : cards.filter((card) => card.dataset.category === category).length;
    });
    const next = new URLSearchParams();
    if (query) next.set('q', query);
    if (activeFilter !== 'all') next.set('category', activeFilter);
    if (activeSort !== 'featured') next.set('sort', activeSort);
    if (favoritesOnly.checked) next.set('favorites', '1');
    const queryString = next.toString();
    window.history.replaceState(null, '', queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname);
  }

  function sortCards() {
    const sorted = [...cards].sort((a, b) => {
      if (activeSort === 'title') {
        return (a.querySelector('h3')?.textContent || '').localeCompare(b.querySelector('h3')?.textContent || '', 'zh-CN');
      }
      if (activeSort === 'newest') return Number(b.dataset.added || cards.indexOf(b) + 1) - Number(a.dataset.added || cards.indexOf(a) + 1);
      return Number(a.dataset.featuredOrder || 999) - Number(b.dataset.featuredOrder || 999);
    });
    sorted.forEach((card) => grid.appendChild(card));
  }

  filters.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      filters.forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      sortCards();
      applyFilters();
    });
  });

  search?.addEventListener('input', applyFilters);
  favoritesOnly?.addEventListener('change', applyFilters);
  sortSelect?.addEventListener('change', () => {
    activeSort = sortSelect.value;
    sortCards();
    applyFilters();
  });
  resetButton?.addEventListener('click', () => {
    search.value = '';
    if (favoritesOnly) favoritesOnly.checked = false;
    activeFilter = 'all';
    activeSort = 'featured';
    sortSelect.value = activeSort;
    filters.forEach((item) => {
      item.classList.toggle('active', item.dataset.filter === 'all');
      item.setAttribute('aria-pressed', String(item.dataset.filter === 'all'));
    });
    sortCards();
    applyFilters();
    search.focus();
  });

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => applyView(button.dataset.portfolioView));
  });

  cards.forEach(card => {
    updateFavoriteButton(card);
    card.querySelector('.project-favorite')?.addEventListener('click', () => {
      const id = card.dataset.projectId;
      if (favorites.has(id)) favorites.delete(id);
      else favorites.add(id);
      saveFavorites();
      updateFavoriteButton(card);
      applyFilters();
      notify(favorites.has(id) ? '已加入收藏。' : '已取消收藏。');
    });
  });

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

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    returnFocus?.focus();
  }

  function openModal(card, trigger) {
    const image = card.querySelector('img');
    const title = card.querySelector('h3')?.textContent.trim() || '作品详情';
    const description = card.querySelector('.project-content > p, .project-body > p')?.textContent.trim() || '';
    const link = card.querySelector('.project-actions a');
    modalImage.src = image?.currentSrc || image?.src || '';
    modalImage.alt = title + '预览';
    modalTitle.textContent = title;
    modalText.textContent = description;
    modalTags.innerHTML = card.querySelector('.project-tags')?.innerHTML || '';
    modalLink.href = link?.getAttribute('href') || '#';
    returnFocus = trigger;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  cards.forEach(card => {
    card.querySelector('.project-detail')?.addEventListener('click', event => openModal(card, event.currentTarget));
  });
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
    if (event.key !== 'Tab' || !modal.classList.contains('open')) return;
    const focusable = Array.from(modal.querySelectorAll('a[href], button:not([disabled])'))
      .filter(item => item.getClientRects().length > 0);
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

  filters.forEach((item) => {
    const selected = item.dataset.filter === activeFilter;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  sortCards();
  applyView(activeView, false);
  window.initNightMode?.();
  applyFilters();
})();
