const collections = {
  characters: { title: '指针跟随角色实验室', description: '切换小猫和小龙，比较角色朝向、精灵动画与指针跟随反馈。', items: [
    ['cat-tracker', '小猫模式', '../../../personal/cat/miao.html'], ['dragon-tracker', '小龙模式', '../../../personal/dragon/index.html']
  ] },
  security: { title: '安全工具箱', description: '把密钥生成与密码强度检查放进一个轻量的本地安全工具台。', items: [
    ['password-lab', '密钥生成器', '../passwordlab/index.html'], ['strength-lab', '密钥强度', '../strengthlab/index.html']
  ] },
  engineering: { title: '安全与工程实验室', description: '把安全原理、数据分析和工程可视化放在同一张本地工作台上。', items: [
    ['security-logs', '网络安全日志分析台', '../securitylogs/index.html'], ['security-headers', 'HTTP 安全检测器', '../securityheaders/index.html'], ['jwt-inspector', 'JWT / Base64 解码器', '../jwtinspector/index.html'], ['sm-lab', '国密算法实验室', '../sm-lab/index.html'], ['web-defense', 'Web 攻防演示台', '../web-defense/index.html'], ['network-topology', '网络拓扑与攻击路径图', '../topology/index.html'], ['frontend-performance', '前端性能监控台', '../performance/index.html']
  ] },
  workspace: { title: '个人工作台', description: '用便签、任务、排序和拖放整理一天的想法与行动。', items: [
    ['notes-lab', '便签空间', '../noteslab/index.html'], ['task-lab', '轻量任务板', '../tasklab/index.html'], ['sort-lab', '顺序整理器', '../sortlab/index.html'], ['drag-lab', '拖放排序', '../draglab/index.html']
  ] },
  discovery: { title: '筛选与资料浏览实验室', description: '集中体验搜索、筛选、资料卡和图鉴式列表浏览。', items: [
    ['github-profile-lab', '个人资料卡', '../githublab/index.html'], ['filter-lab', '实时用户筛选', '../filterlab/index.html'], ['portfolio-grid-lab', '作品网格', '../portfoliogridlab/index.html'], ['pokedex-lab', '小型图鉴', '../pokedexlab/index.html']
  ] },
  flow: { title: '内容加载与滚动实验室', description: '观察内容如何在加载、滚动和连续阅读中逐步进入视野。', items: [
    ['blur-load-lab', '模糊加载', '../blurloadlab/index.html'], ['scroll-lab', '滚动出现', '../scrolllab/index.html'], ['infinite-scroll-lab', '无限文章流', '../infinitescrolllab/index.html']
  ] },
  audio: { title: '声音控制台', description: '从即时音效、专注播放到语音朗读，体验浏览器声音交互与控制反馈。', items: [
    ['focus-player', '专注播放台', '../focusplayer/index.html'], ['soundboard-lab', '节奏音板', '../soundboardlab/index.html'], ['speech-lab', '文字朗读台', '../speechlab/index.html']
  ] },
  random: { title: '随机生成实验室', description: '用随机结果生成选择、笑话和视觉灵感，结束一次犹豫。', items: [
    ['pick-lab', '随机选择器', '../picklab/index.html'], ['dad-joke-lab', '冷笑话抽签', '../dadjokelab/index.html'], ['imagegen-lab', '色彩图像生成器', '../imagegenlab/index.html']
  ] },
  visual: { title: '视觉动效实验室', description: '把流体、粒子、图像扰动、碎裂、立体字和 SVG 动画集中展示。', items: [
    ['fluid-light-lab', '流体光绘', '../fluidlab/index.html'], ['particle-lab', '粒子实验室', '../particlelab/index.html'], ['image-distortion-lab', '图像扰动', '../hoverlab/index.html'], ['disintegrate-lab', '元素碎裂', '../disintegratelab/index.html'], ['ztext-lab', '立体字实验室', '../ztextlab/index.html'], ['animated-svg-lab', 'SVG 动画台', '../animatedsvglab/index.html']
  ] },
  games: { title: '浏览器小游戏合集', description: '把轻量规则游戏整理成一组可快速体验的小游戏模式。', items: [
    ['quiz-lab', '灵感小测', '../quizlab/index.html'], ['insect-lab', '捕光小游戏', '../insectlab/index.html'], ['memory-lab', '记忆翻牌', '../memorylab/index.html'], ['guess-lab', '数字猜谜', '../guesslab/index.html'], ['hangman-lab', '单词猜谜', '../hangmanlab/index.html']
  ] },
  life: { title: '生活与专注工具台', description: '集中展示记录、提醒、换算、倒计时和专注练习等日常工具。', items: [
    ['currency-lab', '汇率换算台', '../currencylab/index.html'], ['expense-lab', '开销记账板', '../expenselab/index.html'], ['water-lab', '喝水提醒', '../waterlab/index.html'], ['health-lab', '状态面板', '../healthlab/index.html'], ['relax-lab', '呼吸节奏', '../relaxlab/index.html'], ['countdown-lab', '专注倒计时', '../countdownlab/index.html'], ['clock-lab', '主题时钟', '../clocklab/index.html'], ['new-year-lab', '新年倒计时', '../newyearlab/index.html']
  ] },
  controls: { title: '参数控制与数据反馈', description: '观察滑杆、参数和数据状态如何驱动界面反馈。', items: [
    ['slider-lab', '触感滑台', '../sliderlab/index.html'], ['vertical-slider-lab', '双向滑台', '../verticalsliderlab/index.html'], ['range-lab', '参数刻度台', '../rangelab/index.html'], ['range-special-lab', '刻度范围', '../rangespeciallab/index.html'], ['good-cheap-fast-lab', '选择平衡器', '../goodcheapfastlab/index.html'], ['glass-dashboard-lab', '玻璃仪表盘', '../glassdashboardlab/index.html'], ['container-query-lab', '容器响应台', '../containerquerylab/index.html'], ['array-method-lab', '数组方法台', '../arraymethodlab/index.html']
  ] },
  navigation: { title: '导航与页面状态', description: '把命令导航、页面筛选、弹窗和状态变化放进同一个交互专题。', items: [
    ['nav-lab', '旋转导航', '../navlab/index.html'], ['anim-nav-lab', '动画导航', '../animnavlab/index.html'], ['sticky-lab', '吸附导航', '../stickylab/index.html'], ['netflix-lab', '移动导航', '../netflixlab/index.html'], ['tab-lab', '移动标签栏', '../tablab/index.html'], ['menu-modal-lab', '菜单弹窗', '../menumodallab/index.html'], ['split-lab', '双面入口', '../splitlab/index.html'], ['search-lab', '隐藏搜索', '../searchlab/index.html'], ['terminal-desk', '作品终端', '../terminaldesk/index.html']
  ] },
  forms: { title: '表单与反馈组件', description: '从输入、校验到提示状态，集中体验常见界面反馈模式。', items: [
    ['wave-lab', '波形表单', '../wavelab/index.html'], ['feedback-lab', '反馈收集器', '../feedbacklab/index.html'], ['verify-lab', '验证码输入', '../verifylab/index.html'], ['form-validator-lab', '表单验证', '../formvalidatorlab/index.html'], ['auth-switch-lab', '登录注册切换', '../authswitchlab/index.html'], ['login-lab', '沉浸式登录页', '../login/denglu.html'], ['coming-soon-lab', '即将到来', '../comingsoonlab/index.html'], ['promo-lab', '优惠码校验', '../promolab/index.html'], ['toast-lab', '提示消息实验室', '../toastlab/index.html'], ['loader-lab', '加载器工坊', '../loaderlab/index.html'], ['tooltip-lab', '提示气泡', '../tooltiplab/index.html']
  ] },
  media: { title: '图片、画廊与媒体交互', description: '整理图片聚焦、画廊、颜色和本地媒体控制等视觉交互。', items: [
    ['carousel-lab', '横向轮播', '../carousellab/index.html'], ['fullscreen-lab', '全屏画廊', '../fullscreenlab/index.html'], ['lightbox-lab', '图片灯箱', '../lightboxlab/index.html'], ['hoverboard-lab', '悬浮色板', '../hoverboardlab/index.html'], ['one-color-lab', '单色界面', '../onecolorlab/index.html'], ['video-background-lab', '视频背景状态', '../videobackgroundlab/index.html'], ['video-player-lab', '本地视频控制台', '../videoplayerlab/index.html']
  ] },
  parallax: { title: '视差与动画', description: '用一个专题入口比较 SVG、首页和长页面中的视差表达。', items: [
    ['parallax-svg-lab', '视差层', '../parallaxsvglab/index.html'], ['parallax-landing-lab', '视差首页', '../parallaxlandinglab/index.html'], ['parallax-web-lab', '长页视差', '../parallaxweblab/index.html']
  ] },
  content: { title: '内容、影视与音乐', description: '集中展示片单、流媒体、歌词和内容卡片浏览体验。', items: [
    ['movie-lab', '电影片单', '../movielab/index.html'], ['stream-lab', '音乐流媒体', '../streamlab/index.html'], ['hulu-lab', '流媒体首页', '../hululab/index.html'], ['lyrics-lab', '歌词滚动', '../lyricslab/index.html'], ['testimonial-lab', '评价切换', '../testimoniallab/index.html'], ['meal-finder-lab', '今日菜单', '../mealfinderlab/index.html']
  ] },
  product: { title: '产品界面与后台控制台', description: '把产品选择、3D 空间、后台指标和品牌界面整理为一组界面模式。', items: [
    ['sneaker-lab', '鞋款选择器', '../sneakerlab/index.html'], ['headphones-lab', '耳机产品卡', '../headphoneslab/index.html'], ['product-3d-lab', '产品旋转卡', '../product3dlab/index.html'], ['laptop-ui-lab', '笔记本界面', '../laptopuilab/index.html'], ['cloud-hosting-lab', '云服务面板', '../cloudhostinglab/index.html'], ['agency-lab', '创意机构入口', '../agencylab/index.html'], ['creative-portfolio-lab', '创意作品页', '../creativeportfoliolab/index.html'], ['boxes-lab', '立体盒子', '../boxeslab/index.html']
  ] }
};

const key = new URLSearchParams(location.search).get('group') || 'games';
const collection = collections[key] || collections.games;
document.body.classList.add('immersive-collection');
document.body.classList.toggle('character-collection', key === 'characters');
const title = document.getElementById('collectionTitle');
const description = document.getElementById('collectionDescription');
const list = document.getElementById('modeList');
const frame = document.getElementById('previewFrame');
const previewTitle = document.getElementById('previewTitle');
const previewLink = document.getElementById('previewLink');
const modeToggle = document.getElementById('modeToggle');
title.textContent = collection.title;
description.textContent = collection.description;

function setModeMenu(open) {
  if (!modeToggle) return;
  document.querySelector('.mode-list')?.classList.toggle('is-open', open);
  modeToggle.setAttribute('aria-expanded', String(open));
  const icon = modeToggle.querySelector('.mode-toggle__icon');
  if (icon) icon.textContent = open ? '−' : '+';
}

modeToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  setModeMenu(modeToggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.mode-list')) setModeMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setModeMenu(false);
});

function selectMode(item, button) {
  const [id, itemTitle, url] = item;
  list.querySelectorAll('button').forEach((entry) => entry.classList.toggle('active', entry === button));
  previewTitle.textContent = itemTitle;
  previewLink.href = url;
  frame.title = `${itemTitle}预览`;
  frame.src = url;
  history.replaceState(null, '', `?group=${encodeURIComponent(key)}&mode=${encodeURIComponent(id)}`);
  setModeMenu(false);
}
collection.items.forEach((item) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = `<span>${String(collection.items.indexOf(item) + 1).padStart(2, '0')}</span>${item[1]}`;
  button.addEventListener('click', () => selectMode(item, button));
  list.append(button);
});
const initialId = new URLSearchParams(location.search).get('mode');
const initialIndex = Math.max(0, collection.items.findIndex((item) => item[0] === initialId));
selectMode(collection.items[initialIndex], list.children[initialIndex]);
