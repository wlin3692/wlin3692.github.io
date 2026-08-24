(function initUtilityPages() {
  window.initNightMode?.();

  const statusGrid = document.getElementById('statusGrid');
  if (statusGrid) initStatusPage();
  if (document.getElementById('reportForm')) initReportPage();

  function initStatusPage() {
    const search = document.getElementById('statusSearch');
    const filterButtons = Array.from(document.querySelectorAll('[data-status-filter]'));
    const checkButton = document.getElementById('statusCheck');
    const moreButton = document.getElementById('statusMore');
    const empty = document.getElementById('statusEmpty');
    const summary = document.getElementById('statusSummary');
    const total = document.getElementById('statusProjectCount');
    const batchSize = 12;
    let projects = [];
    let activeFilter = 'all';
    let visibleLimit = batchSize;

    function matchingProjects() {
      const query = search.value.trim().toLocaleLowerCase('zh-CN');
      return projects.filter((project) => {
        const searchText = [project.title, project.description, project.category, ...(project.keywords || [])].join(' ').toLocaleLowerCase('zh-CN');
        return (activeFilter === 'all' || project.category === activeFilter) && (!query || searchText.includes(query));
      });
    }

    function card(project) {
      // The manifest is generated from pages/projects.html, so its preview
      // paths are relative to that directory. This utility page lives at root.
      const preview = String(project.preview || '').replace(/^\.\.\//, '');
      const item = document.createElement('article');
      item.className = 'status-project';
      const content = document.createElement('div');
      const title = document.createElement('a');
      title.className = 'status-project__title';
      title.href = preview;
      title.textContent = project.title;
      const meta = document.createElement('p');
      meta.className = 'status-project__meta';
      meta.textContent = project.category + ' · ' + project.description;
      content.append(title, meta);
      const badge = document.createElement('span');
      badge.className = 'status-project__badge';
      badge.innerHTML = '<i class="bi bi-folder-check" aria-hidden="true"></i><span>待检测</span>';
      badge.dataset.link = preview;
      item.append(content, badge);
      return item;
    }

    function render() {
      const matching = matchingProjects();
      const shown = matching.slice(0, visibleLimit);
      statusGrid.replaceChildren(...shown.map(card));
      empty.hidden = matching.length !== 0;
      moreButton.hidden = matching.length <= shown.length;
      summary.textContent = matching.length ? `显示 ${shown.length} / ${matching.length} 个项目` : '没有找到匹配项目';
    }

    async function checkVisibleProjects() {
      const badges = Array.from(statusGrid.querySelectorAll('.status-project__badge'));
      if (!badges.length) return;
      if (window.location.protocol === 'file:') {
        summary.textContent = '请使用本地服务器或正式域名后再检测入口。';
        return;
      }
      checkButton.disabled = true;
      checkButton.innerHTML = '<i class="bi bi-arrow-repeat"></i> 检测中…';
      await Promise.all(badges.map(async (badge) => {
        badge.className = 'status-project__badge is-pending';
        badge.innerHTML = '<i class="bi bi-arrow-repeat" aria-hidden="true"></i><span>检测中</span>';
        try {
          const response = await fetch(badge.dataset.link, { method: 'HEAD', cache: 'no-store' });
          const available = response.ok;
          badge.className = 'status-project__badge' + (available ? '' : ' is-error');
          badge.innerHTML = available ? '<i class="bi bi-check-circle" aria-hidden="true"></i><span>可访问</span>' : '<i class="bi bi-exclamation-circle" aria-hidden="true"></i><span>状态 ' + response.status + '</span>';
        } catch (error) {
          badge.className = 'status-project__badge is-error';
          badge.innerHTML = '<i class="bi bi-exclamation-circle" aria-hidden="true"></i><span>无法检测</span>';
        }
      }));
      checkButton.disabled = false;
      checkButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i> 重新检测当前项目';
      summary.textContent = `已完成当前 ${badges.length} 个项目的入口检测`;
    }

    search.addEventListener('input', () => { visibleLimit = batchSize; render(); });
    filterButtons.forEach((button) => button.addEventListener('click', () => {
      activeFilter = button.dataset.statusFilter;
      filterButtons.forEach((item) => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
      visibleLimit = batchSize;
      render();
    }));
    moreButton.addEventListener('click', () => { visibleLimit += batchSize; render(); });
    checkButton.addEventListener('click', checkVisibleProjects);

    fetch('data/projects.json').then((response) => {
      if (!response.ok) throw new Error('Unable to load project list');
      return response.json();
    }).then((data) => {
      projects = data.projects || [];
      total.textContent = String(projects.length);
      render();
    }).catch(() => {
      document.getElementById('statusOverall').textContent = '项目清单无法读取';
      summary.textContent = '无法读取项目清单，请返回首页后重试。';
    });
  }

  function initReportPage() {
    const form = document.getElementById('reportForm');
    const page = document.getElementById('reportPage');
    const issue = document.getElementById('reportIssue');
    const counter = document.getElementById('reportCounter');
    const status = document.getElementById('reportStatus');
    const params = new URLSearchParams(window.location.search);
    page.value = params.get('page') || '';
    issue.value = params.get('issue') || '';
    const updateCounter = () => { counter.textContent = issue.value.length + ' / 1000'; };
    updateCounter();
    issue.addEventListener('input', updateCounter);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = '网站问题反馈：' + data.get('page');
      const body = '问题类型：' + data.get('type') + '\n问题页面：' + data.get('page') + '\n问题描述：' + data.get('issue') + '\n联系方式：' + (data.get('contact') || '未提供');
      status.hidden = false;
      status.textContent = '邮件应用即将打开，请确认发送。';
      window.location.href = 'mailto:wlin3692@163.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
