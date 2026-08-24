(function initCaseStudy() {
  const projects = {
    'dino-runner': { title: '小恐龙快跑', category: '游戏 / JavaScript', lead: '一个支持跳跃、下蹲、动态场景和本地记录的像素跑酷游戏。', overview: '围绕浏览器触控和键盘操作设计轻量跑酷体验，重点处理移动端输入、碰撞反馈、昼夜变化与成绩保存。', role: '交互设计 · 前端开发', timeline: '2026 · 2 周', outcome: '完成桌面与移动端双端体验', challenge: '如何让简单的跑酷规则在触屏设备上保持明确反馈？通过大尺寸触控区域、短促动画和即时分数反馈降低操作门槛。', highlights: ['键盘与触控双输入', '动态场景和难度节奏', '本地最高分与统计记录'], tags: ['JavaScript', 'Canvas', '响应式设计'], image: 'word/games/dinogame/imgs/dino-run-0.png', gallery: ['word/games/dinogame/imgs/dino-run-0.png', 'word/games/dinogame/imgs/dino-run-1.png'], link: 'word/games/dinogame/index.html' },
    'number-2048': { title: '2048 数字合成', category: '游戏 / JavaScript', lead: '支持键盘、触屏手势、深色模式和本地记录的数字益智游戏。', overview: '将经典 2048 规则整理为适合桌面和移动端的交互界面，补充手势识别、动画反馈和最佳成绩持久化。', role: '前端开发 · 交互实现', timeline: '2026 · 1 周', outcome: '支持键盘、触控和离线保存', challenge: '如何在不依赖后端的情况下保存连续游玩的成就？使用 LocalStorage 记录最佳分数，并在状态变化后同步更新界面。', highlights: ['触屏滑动和键盘操作', '合并动画与状态反馈', '本地最佳成绩保存'], tags: ['JavaScript', '游戏逻辑', '触屏交互'], image: 'word/games/game2048/meta/apple-touch-icon.png', gallery: ['word/games/game2048/meta/apple-touch-icon.png', 'word/games/game2048/meta/apple-touch-startup-image-640x920.png'], link: 'word/games/game2048/index.html' },
    'skill-roadmap': { title: '技能与项目路线图', category: '互动 / 数据可视化', lead: '拖拽组合技能、项目和成长目标，查看个人创作能力的完整脉络。', overview: '用可拖拽节点把技能学习、项目实践和目标规划连接起来，强调信息层级、状态保存和可视化浏览。', role: '产品构思 · 前端开发', timeline: '2026 · 2 周', outcome: '形成可编辑的个人成长地图', challenge: '信息节点多且关系复杂，采用颜色分组、连线层级和可拖拽布局，让用户先看全局再深入编辑。', highlights: ['节点拖拽与连接关系', '本地保存编辑状态', '响应式画布布局'], tags: ['JavaScript', 'SVG', 'LocalStorage'], image: 'word/Lin/skillmap/preview.svg', gallery: ['word/Lin/skillmap/preview.svg', 'Lin/site/666.webp'], link: 'word/Lin/skillmap/index.html' },
    minesweeper: { title: '休闲扫雷', category: '游戏 / JavaScript', lead: '经典规则与多档难度结合的浏览器扫雷游戏。', overview: '以熟悉的扫雷规则为基础，整理难度选择、格子状态和胜负反馈，让游戏在桌面与触屏设备上都能直接操作。', role: '前端开发 · 规则设计', timeline: '2026 · 5 天', outcome: '完成多档难度和触控适配', challenge: '在小屏幕上保持棋盘可读性，采用自适应格子尺寸和明确的长按/点击反馈，减少误触。', highlights: ['多档难度选择', '格子状态与胜负逻辑', '触控友好的棋盘布局'], tags: ['JavaScript', '游戏逻辑', '响应式设计'], image: 'Lin/site/222.jpg', gallery: ['Lin/site/222.jpg', 'word/games/sweeper/assets/open1.png'], link: 'word/games/sweeper/sweeper.html' },
    'fun-lab': { title: '趣味互动实验室', category: '互动 / 多媒体', lead: '集合动画、音乐与多种小互动的创意入口。', overview: '把多个轻量互动实验组织成一个可探索的入口，关注转场、视觉反馈和多媒体控制的连贯体验。', role: '体验设计 · 动效开发', timeline: '2026 · 2 周', outcome: '整合多个实验为统一入口', challenge: '不同实验风格不一致，通过统一导航、转场节奏和反馈组件建立连续的探索体验。', highlights: ['多媒体交互控制', '动画与页面转场', '适配移动端触控'], tags: ['JavaScript', 'CSS Animation', 'Web Audio'], image: 'Lin/site/666.webp', gallery: ['Lin/site/666.webp', 'Lin/site/222.jpg'], link: 'word/Lin/funlab/选项界面.html' },
    'cat-tracker': { title: '指针跟随小猫', category: '互动 / Canvas', lead: '移动鼠标或手指，小猫会自然转头追随屏幕上的小鱼。', overview: '用 Canvas 和指针坐标驱动角色朝向变化，针对触控设备补充提示和交互反馈，形成一个轻量但有记忆点的互动作品。', role: '视觉交互 · Canvas 开发', timeline: '2026 · 4 天', outcome: '完成鼠标与触控双模式互动', challenge: '角色跟随需要自然又不过度抖动，使用平滑插值处理指针坐标，并为移动端增加明确的触控提示。', highlights: ['指针与触控坐标追踪', '角色朝向平滑插值', '移动端交互提示'], tags: ['Canvas', 'Pointer Events', '动画'], image: 'Lin/cat/frame_front.webp', gallery: ['Lin/cat/frame_front.webp', 'Lin/cat/fish-cursor.png'], link: 'Lin/cat/miao.html' }
  };
  const key = new URLSearchParams(location.search).get('id');
  const project = projects[key] || projects['dino-runner'];
  const projectOrder = ['dino-runner', 'number-2048', 'skill-roadmap', 'minesweeper', 'fun-lab', 'cat-tracker'];
  const projectKey = projects[key] ? key : 'dino-runner';
  project.image = project.image.startsWith('../') ? project.image : `../${project.image}`;
  project.link = project.link.startsWith('../') ? project.link : `../${project.link}`;
  document.title = `${project.title} · 项目案例`;
  document.getElementById('caseTitle').textContent = project.title;
  document.getElementById('caseBreadcrumb').textContent = project.title;
  document.getElementById('caseCategory').textContent = project.category;
  document.getElementById('caseLead').textContent = project.lead;
  document.getElementById('caseOverview').textContent = project.overview;
  document.getElementById('caseRole').textContent = project.role;
  document.getElementById('caseTimeline').textContent = project.timeline;
  document.getElementById('caseOutcome').textContent = project.outcome;
  document.getElementById('caseChallenge').textContent = project.challenge;
  document.getElementById('caseImage').src = project.image;
  document.getElementById('caseImage').alt = `${project.title}项目预览`;
  document.getElementById('caseLink').href = project.link;
  const shareButton = document.getElementById('caseShare');
  const prevButton = document.getElementById('casePrev');
  const nextButton = document.getElementById('caseNext');
  function setNeighbor(button, neighborKey, direction) {
    if (!button) return;
    const neighbor = projects[neighborKey];
    button.href = `project-detail.html?id=${neighborKey}`;
    button.querySelector('strong').textContent = neighbor.title;
    button.setAttribute('aria-label', `${direction}${neighbor.title}`);
  }
  const projectIndex = projectOrder.indexOf(projectKey);
  setNeighbor(prevButton, projectOrder[(projectIndex - 1 + projectOrder.length) % projectOrder.length], '上一个案例：');
  setNeighbor(nextButton, projectOrder[(projectIndex + 1) % projectOrder.length], '下一个案例：');
  const notify = (message) => {
    if (typeof window.showToast === 'function') {
      window.showToast(message);
      return;
    }
    let region = document.querySelector('.toast-region');
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2600);
  };
  shareButton?.addEventListener('click', async () => {
    const shareData = { title: `${project.title} · 小林的个人网站`, text: project.lead, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const input = document.createElement('textarea');
        input.value = window.location.href;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Copy is unavailable');
      }
      notify('案例链接已复制。');
      shareButton.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> 链接已复制';
      window.setTimeout(() => { shareButton.innerHTML = '<i class="bi bi-share" aria-hidden="true"></i> 分享案例'; }, 2200);
    } catch (error) {
      if (error?.name !== 'AbortError') notify('暂时无法分享，请复制地址栏链接。');
    }
  });
  const gallery = (project.gallery || [project.image]).map((image) => image.startsWith('../') ? image : '../' + image);
  const galleryWrap = document.getElementById('caseGallery');
  const galleryThumbs = document.getElementById('caseGalleryThumbs');
  let galleryIndex = 0;
  const showGalleryImage = (index) => {
    galleryIndex = (index + gallery.length) % gallery.length;
    document.getElementById('caseImage').src = gallery[galleryIndex];
    galleryThumbs?.querySelectorAll('button').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === galleryIndex);
      button.setAttribute('aria-selected', String(buttonIndex === galleryIndex));
    });
  };
  if (galleryWrap && galleryThumbs && gallery.length > 1) {
    galleryWrap.hidden = false;
    galleryThumbs.replaceChildren(...gallery.map((image, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'case-gallery__thumb';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-label', '查看第 ' + (index + 1) + ' 张截图');
      button.addEventListener('click', () => showGalleryImage(index));
      const thumbnail = document.createElement('img');
      thumbnail.src = image;
      thumbnail.alt = '';
      thumbnail.width = 96;
      thumbnail.height = 60;
      button.append(thumbnail);
      return button;
    }));
    document.getElementById('caseGalleryPrev')?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
    document.getElementById('caseGalleryNext')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
    showGalleryImage(0);
  }
  document.getElementById('caseHighlights').replaceChildren(...project.highlights.map((item) => { const li = document.createElement('li'); li.textContent = item; return li; }));
  document.getElementById('caseTags').replaceChildren(...project.tags.map((item) => { const span = document.createElement('span'); span.textContent = item; return span; }));
  const description = `${project.title}：${project.lead}`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${project.title} · 项目案例`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', `${project.title} · 项目案例`);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  const structuredData = document.querySelector('script[type="application/ld+json"]');
  if (structuredData) {
    try {
      const data = JSON.parse(structuredData.textContent);
      data.headline = `${project.title} · 项目案例`;
      data.description = description;
      data.image = project.image;
      structuredData.textContent = JSON.stringify(data);
    } catch (error) {
      // 保留页面静态结构化数据作为降级内容。
    }
  }
})();
