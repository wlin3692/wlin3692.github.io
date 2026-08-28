document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'xiaolin-skill-map-v3';
  const STORAGE_VERSION = 3;
  const MAX_NODES = 20;
  const NODE_HEIGHT = 106;
  const HORIZONTAL_GAP = 28;
  const VERTICAL_GAP = 98;

  const definitions = {
    profile: {
      kind: 'root', mark: 'LIN', title: '小林 · 网络安全实践', short: '个人能力与项目脉络',
      description: '以网络攻防为主线，把安全原理、工具实践与 Python 开发落到可验证的项目中。',
      direction: '网络空间安全', status: '持续构建', level: 84,
      color: '#df514b', soft: '#fae9e7'
    },
    security: {
      kind: 'skill', mark: 'SEC', title: '网络攻防基础', short: '攻击原理 · 防御思路',
      description: '系统学习网络攻击与防护、入侵检测、Linux 系统安全等内容，理解常见风险的原理与防御方法。',
      direction: '安全基础', status: '持续深化', level: 86,
      color: '#3578c6', soft: '#e7eff9'
    },
    pentest: {
      kind: 'skill', mark: 'PEN', title: '渗透测试', short: 'Kali · Nmap · Burp Suite',
      description: '使用 Kali、Nmap、Wireshark、Burp Suite 等工具完成靶场和黑盒测试，练习漏洞发现与验证。',
      direction: '攻防实践', status: '实战中', level: 82,
      color: '#3578c6', soft: '#e7eff9'
    },
    python: {
      kind: 'skill', mark: 'PY', title: 'Python 安全开发', short: '脚本 · 自动化 · 分析',
      description: '使用 Python 编写安全脚本，完成数据处理、漏洞分析、算法实现和项目自动化。',
      direction: '安全开发', status: '持续实践', level: 82,
      color: '#3578c6', soft: '#e7eff9'
    },
    frontend: {
      kind: 'skill', mark: 'FE', title: '前端工程', short: 'HTML · CSS · JavaScript',
      description: '围绕语义化结构、响应式布局、无障碍和性能优化构建可直接体验的静态网站与网页应用。',
      direction: '网页开发', status: '持续实践', level: 84,
      color: '#3578c6', soft: '#e7eff9'
    },
    interaction: {
      kind: 'skill', mark: 'UI', title: '交互与动效', short: 'Canvas · SVG · Web Audio',
      description: '使用 Canvas、SVG、CSS 动画和 Web Audio 设计有反馈、有节奏的浏览器互动体验。',
      direction: '交互开发', status: '项目验证', level: 80,
      color: '#3578c6', soft: '#e7eff9'
    },
    embedded: {
      kind: 'skill', mark: 'MCU', title: '嵌入式开发', short: 'STM32 · 传感器 · PID',
      description: '理解 STM32 外设、串口通信、传感器采集和控制算法，把软硬件协同落到可运行设备上。',
      direction: '工程实践', status: '项目实践', level: 76,
      color: '#3578c6', soft: '#e7eff9'
    },
    crypto: {
      kind: 'skill', mark: 'SM3', title: '密码学与安全分析', short: 'SM3 · HMAC · 文件校验',
      description: '理解现代密码学基础，并使用 Python 实现 SM3、HMAC-SM3 与文件完整性校验。',
      direction: '密码技术', status: '项目验证', level: 78,
      color: '#3578c6', soft: '#e7eff9'
    },
    appleSort: {
      kind: 'project', mark: 'AI', title: 'YOLO 苹果分拣系统', short: 'YOLO11 · OpenCV · MQTT',
      description: '训练 YOLO11 图像识别模型，通过 MQTT、多线程与 FIFO 队列联动传感器和推杆，实现实时分拣控制。',
      direction: '智能应用', status: '项目实践', level: 88,
      color: '#1f8a70', soft: '#e1f2ec', link: '../../../index.html#portfolio'
    },
    smartCar: {
      kind: 'project', mark: 'MCU', title: 'STM32 智能小车', short: 'STM32F407 · UART · PID',
      description: '基于 STM32F407 实现蓝牙遥控、红外循迹、多传感器融合与增量式 PID 控制，完成软硬件协同。',
      direction: '嵌入式实践', status: '项目实践', level: 84,
      color: '#1f8a70', soft: '#e1f2ec', link: '../../../index.html#portfolio'
    },
    sm3: {
      kind: 'project', mark: 'HASH', title: 'SM3 文件校验工具', short: 'Python · HMAC-SM3',
      description: '从零实现 SM3 哈希、消息填充、压缩函数和 HMAC-SM3，并扩展文件校验与 .sm3 校验文件生成。',
      direction: '密码实践', status: '已完成', level: 96,
      color: '#1f8a70', soft: '#e1f2ec', link: '../../../index.html#portfolio'
    },
    cms: {
      kind: 'project', mark: 'CMS', title: 'CMS 黑盒渗透测试', short: 'XSS · SQL 注入 · 文件上传',
      description: '针对 CMS 网站进行黑盒安全测试，发现并验证跨站脚本、SQL 注入和文件上传等安全问题。',
      direction: '漏洞验证', status: '项目实践', level: 80,
      color: '#1f8a70', soft: '#e1f2ec', link: '../../../index.html#portfolio'
    },
    portfolioSite: {
      kind: 'project', mark: 'WEB', title: '个人网站与作品集', short: '静态部署 · SEO · 性能优化',
      description: '维护包含 109 个作品的静态个人网站，整理项目目录、构建流程、SEO 元数据、响应式体验和性能检查。',
      direction: '网页工程', status: '持续迭代', level: 90,
      color: '#1f8a70', soft: '#e1f2ec', link: '../../../index.html#portfolio'
    },
    interactiveWorks: {
      kind: 'project', mark: 'LAB', title: '互动实验作品集', short: 'Canvas · SVG · 触控交互',
      description: '将小猫、小龙、技能路线图和多种浏览器实验整理为可直接操作的网页作品，持续打磨移动端交互。',
      direction: '互动开发', status: '持续迭代', level: 86,
      color: '#1f8a70', soft: '#e1f2ec', link: '../../../index.html#portfolio'
    },
    audit: {
      kind: 'goal', mark: 'LOG', title: '日志分析与安全审计', short: 'ELK · 监控 · 威胁发现',
      description: '继续掌握 ELK Stack，通过日志聚合和分析识别异常行为与潜在安全威胁。',
      direction: '下一阶段', status: '重点推进', level: 58,
      color: '#c58b20', soft: '#f7edd9'
    },
    blueTeam: {
      kind: 'goal', mark: 'SOC', title: '安全运营能力', short: '检测 · 响应 · 防护',
      description: '从漏洞验证延伸到安全监测、事件响应与防护策略，建立更完整的蓝队视角。',
      direction: '长期目标', status: '规划中', level: 44,
      color: '#c58b20', soft: '#f7edd9'
    },
    certifications: {
      kind: 'goal', mark: 'CERT', title: '认证与职业准备', short: 'AI · HarmonyOS · 合规',
      description: '持续整理项目成果与相关证书，提升安全实践表达、团队协作和职业准备能力。',
      direction: '个人成长', status: '持续积累', level: 64,
      color: '#c58b20', soft: '#f7edd9'
    },
    career: {
      kind: 'goal', mark: 'NEXT', title: '实习与作品表达', short: '案例 · 简历 · 面试准备',
      description: '把安全、前端和工程项目沉淀为清晰案例，持续完善简历、项目复盘与面试表达。',
      direction: '近期目标', status: '重点推进', level: 62,
      color: '#c58b20', soft: '#f7edd9'
    }
  };

  const defaultNodes = [
    { id: 0, parent: -1, type: 'profile' },
    { id: 1, parent: 0, type: 'security' },
    { id: 2, parent: 0, type: 'pentest' },
    { id: 3, parent: 0, type: 'python' },
    { id: 4, parent: 0, type: 'frontend' },
    { id: 5, parent: 0, type: 'embedded' },
    { id: 6, parent: 1, type: 'crypto' },
    { id: 7, parent: 1, type: 'audit' },
    { id: 8, parent: 2, type: 'cms' },
    { id: 9, parent: 3, type: 'appleSort' },
    { id: 10, parent: 3, type: 'sm3' },
    { id: 11, parent: 4, type: 'interaction' },
    { id: 12, parent: 4, type: 'portfolioSite' },
    { id: 13, parent: 11, type: 'interactiveWorks' },
    { id: 14, parent: 5, type: 'smartCar' },
    { id: 15, parent: 7, type: 'blueTeam' },
    { id: 16, parent: 0, type: 'certifications' },
    { id: 17, parent: 0, type: 'career' }
  ];

  const kindLabels = { root: '个人主线', skill: '技能', project: '项目', goal: '目标' };
  const canvas = document.getElementById('canvas');
  const nodeLibrary = document.getElementById('nodeLibrary');
  const nodeSearch = document.getElementById('nodeSearch');
  const tabs = Array.from(document.querySelectorAll('[data-library-tab]'));
  const libraryPanel = document.getElementById('nodeLibraryPanel');
  const libraryToggle = document.getElementById('libraryToggle');
  const libraryClose = document.getElementById('libraryClose');
  const inspector = document.getElementById('inspector');
  const inspectorLevel = document.getElementById('inspectorLevel');
  const inspectorLink = document.getElementById('inspectorLink');
  const removeBranchButton = document.getElementById('removeBranchButton');
  const nodeCount = document.getElementById('nodeCount');
  const saveState = document.getElementById('saveState');
  const toast = document.getElementById('toast');

  let activeTab = 'skill';
  let selectedNodeId = null;
  let toastTimer = 0;
  let saveTimer = 0;

  flowy(canvas, onGrab, onRelease, onSnap, onRearrange, HORIZONTAL_GAP, VERTICAL_GAP);

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    })[character]);
  }

  function nodeWidth() {
    return window.matchMedia('(max-width: 430px)').matches ? 224 : 244;
  }

  function renderNodeInner(definition, id) {
    return `
      <input type="hidden" name="nodetype" class="nodetype" value="${escapeHtml(definition.key)}">
      <input type="hidden" name="blockid" class="blockid" value="${id}">
      <div class="node-top">
        <span class="node-mark">${escapeHtml(definition.mark)}</span>
        <span class="node-title"><strong>${escapeHtml(definition.title)}</strong><small>${escapeHtml(definition.short)}</small></span>
        <span class="node-state">${escapeHtml(definition.status)}</span>
      </div>
      <div class="node-meter" style="--level:${definition.level}%"><i></i></div>`;
  }

  function definitionFor(type) {
    const definition = definitions[type];
    return definition ? { ...definition, key: type } : null;
  }

  function validateNodes(candidate) {
    if (!candidate || candidate.version !== STORAGE_VERSION || !Array.isArray(candidate.nodes)) return null;
    if (!candidate.nodes.length || candidate.nodes.length > MAX_NODES) return null;

    const clean = [];
    const ids = new Set();
    for (const node of candidate.nodes) {
      const id = Number(node.id);
      const parent = Number(node.parent);
      if (!Number.isInteger(id) || id < 0 || id > 9999 || ids.has(id)) return null;
      if (!Number.isInteger(parent) || !definitions[node.type]) return null;
      ids.add(id);
      clean.push({ id, parent, type: node.type });
    }

    const roots = clean.filter(node => node.parent === -1);
    if (roots.length !== 1) return null;
    if (clean.some(node => node.parent !== -1 && !ids.has(node.parent))) return null;

    const visited = new Set();
    const visiting = new Set();
    function walk(id) {
      if (visiting.has(id)) return false;
      if (visited.has(id)) return true;
      visiting.add(id);
      for (const child of clean.filter(node => node.parent === id)) {
        if (!walk(child.id)) return false;
      }
      visiting.delete(id);
      visited.add(id);
      return true;
    }

    if (!walk(roots[0].id) || visited.size !== clean.length) return null;
    return clean;
  }

  function loadNodes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return validateNodes(parsed) || defaultNodes.map(node => ({ ...node }));
    } catch (error) {
      return defaultNodes.map(node => ({ ...node }));
    }
  }

  function saveNodes(nodes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, nodes }));
      saveState.innerHTML = '<i aria-hidden="true"></i>已保存';
    } catch (error) {
      saveState.textContent = '仅当前会话';
    }
  }

  function getCurrentNodes() {
    const output = flowy.output();
    if (!output || !Array.isArray(output.blocks)) return [];
    return output.blocks.map(block => {
      const typeEntry = block.data.find(entry => entry.name === 'nodetype');
      return { id: Number(block.id), parent: Number(block.parent), type: typeEntry?.value };
    }).filter(node => definitions[node.type]);
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    saveState.innerHTML = '<i aria-hidden="true"></i>编辑中';
    saveTimer = window.setTimeout(() => {
      const nodes = getCurrentNodes();
      const valid = validateNodes({ version: STORAGE_VERSION, nodes });
      if (valid) saveNodes(valid);
      updateNodeCount(nodes.length);
    }, 180);
  }

  function calculateLayout(nodes) {
    const width = nodeWidth();
    const root = nodes.find(node => node.parent === -1);
    const children = new Map(nodes.map(node => [node.id, []]));
    nodes.forEach(node => {
      if (node.parent !== -1) children.get(node.parent)?.push(node);
    });

    const subtreeWidths = new Map();
    function measure(id) {
      const branch = children.get(id) || [];
      if (!branch.length) {
        subtreeWidths.set(id, width);
        return width;
      }
      const branchWidth = branch.reduce((sum, child, index) => sum + measure(child.id) + (index ? HORIZONTAL_GAP : 0), 0);
      const result = Math.max(width, branchWidth);
      subtreeWidths.set(id, result);
      return result;
    }

    const totalWidth = measure(root.id);
    const viewportWidth = Math.max(canvas.clientWidth || 0, 320);
    const contentWidth = Math.max(totalWidth + 120, viewportWidth);
    const start = Math.max(60, (contentWidth - totalWidth) / 2);
    const positions = new Map();
    let maxDepth = 0;

    function place(id, left, depth) {
      maxDepth = Math.max(maxDepth, depth);
      const branchWidth = subtreeWidths.get(id);
      const x = left + branchWidth / 2;
      const top = 64 + depth * (NODE_HEIGHT + VERTICAL_GAP);
      positions.set(id, { x, top, y: top + NODE_HEIGHT / 2 });
      let cursor = left;
      for (const child of children.get(id) || []) {
        place(child.id, cursor, depth + 1);
        cursor += subtreeWidths.get(child.id) + HORIZONTAL_GAP;
      }
    }

    place(root.id, start, 0);
    return {
      root,
      positions,
      subtreeWidths,
      contentWidth,
      contentHeight: 64 + (maxDepth + 1) * (NODE_HEIGHT + VERTICAL_GAP) + 100
    };
  }

  function renderArrow(node, layout) {
    if (node.parent === -1) return '';
    const parent = layout.positions.get(node.parent);
    const child = layout.positions.get(node.id);
    const top = parent.top + NODE_HEIGHT;
    const height = Math.max(30, child.top - top);
    const midpoint = Math.round(height / 2);
    const endY = height - 7;
    return `
      <div class="arrowblock" style="left:0;top:${top}px;width:${layout.contentWidth}px;height:${height}px">
        <input type="hidden" class="arrowid" value="${node.id}">
        <svg viewBox="0 0 ${layout.contentWidth} ${height}" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M${parent.x} 0V${midpoint}H${child.x}V${endY}" stroke="#9aa8a1" stroke-width="2" vector-effect="non-scaling-stroke"/>
          <path d="M${child.x - 5} ${endY - 1}H${child.x + 5}L${child.x} ${height}Z" fill="#9aa8a1"/>
        </svg>
      </div>`;
  }

  function buildImportData(nodes) {
    const layout = calculateLayout(nodes);
    const width = nodeWidth();
    const blockHtml = nodes.map(node => {
      const definition = definitionFor(node.type);
      const position = layout.positions.get(node.id);
      return `<div class="block map-node node--${definition.kind}" data-node-type="${escapeHtml(node.type)}" style="left:${position.x - width / 2}px;top:${position.top}px">${renderNodeInner(definition, node.id)}</div>`;
    }).join('');
    const arrows = nodes.map(node => renderArrow(node, layout)).join('');
    const blockarr = nodes.map(node => {
      const position = layout.positions.get(node.id);
      return {
        childwidth: layout.subtreeWidths.get(node.id), parent: node.parent, id: node.id,
        x: position.x, y: position.y, width, height: NODE_HEIGHT
      };
    });
    return {
      preserveLayout: true,
      html: `<div class="map-spacer" style="width:${layout.contentWidth}px;height:${layout.contentHeight}px"></div>${arrows}${blockHtml}<div class="indicator invisible"></div>`,
      blockarr,
      layout
    };
  }

  function renderFlow(nodes, center = true) {
    const valid = validateNodes({ version: STORAGE_VERSION, nodes }) || defaultNodes.map(node => ({ ...node }));
    const data = buildImportData(valid);
    flowy.deleteBlocks();
    flowy.import(data);
    selectedNodeId = null;
    closeInspector();
    updateNodeCount(valid.length);
    if (center) window.requestAnimationFrame(() => centerMap(false));
  }

  function centerMap(smooth = true) {
    const current = getCurrentNodes();
    const root = current.find(node => node.parent === -1);
    if (!root) return;
    const rootInput = canvas.querySelector(`.blockid[value="${root.id}"]`);
    const rootBlock = rootInput?.closest('.block');
    if (!rootBlock) return;
    const targetLeft = Math.max(0, rootBlock.offsetLeft + rootBlock.offsetWidth / 2 - canvas.clientWidth / 2);
    canvas.scrollTo({ left: targetLeft, top: 0, behavior: smooth ? 'smooth' : 'auto' });
  }

  function updateNodeCount(count) {
    nodeCount.textContent = count + ' 个节点';
  }

  function renderLibrary() {
    const query = nodeSearch.value.trim().toLocaleLowerCase('zh-CN');
    const entries = Object.entries(definitions).filter(([type, definition]) => {
      if (definition.kind !== activeTab) return false;
      const haystack = `${definition.title} ${definition.short} ${definition.description} ${type}`.toLocaleLowerCase('zh-CN');
      return !query || haystack.includes(query);
    });

    if (!entries.length) {
      nodeLibrary.innerHTML = '<div class="library-empty">没有找到匹配节点</div>';
      return;
    }

    nodeLibrary.innerHTML = entries.map(([type, definition]) => `
      <div class="palette-row" style="--node-color:${definition.color};--node-soft:${definition.soft}">
        <div class="palette-item create-flowy" data-node-type="${escapeHtml(type)}">
          <input type="hidden" name="nodetype" class="nodetype" value="${escapeHtml(type)}">
          <span class="palette-mark">${escapeHtml(definition.mark)}</span>
          <span class="palette-copy"><strong>${escapeHtml(definition.title)}</strong><small>${escapeHtml(definition.short)}</small></span>
        </div>
        <button class="quick-add" type="button" data-add-node="${escapeHtml(type)}" aria-label="添加${escapeHtml(definition.title)}" title="添加节点">+</button>
      </div>`).join('');
  }

  function nodeDepth(nodes, id) {
    let depth = 0;
    let current = nodes.find(node => node.id === id);
    const seen = new Set();
    while (current && current.parent !== -1 && !seen.has(current.id)) {
      seen.add(current.id);
      depth += 1;
      current = nodes.find(node => node.id === current.parent);
    }
    return depth;
  }

  function quickAdd(type) {
    const nodes = getCurrentNodes();
    if (nodes.length >= MAX_NODES) {
      showToast('路线图最多保留 ' + MAX_NODES + ' 个节点。');
      return;
    }
    const root = nodes.find(node => node.parent === -1);
    let parent = nodes.find(node => node.id === selectedNodeId) || root;
    if (nodeDepth(nodes, parent.id) >= 3) parent = root;
    const id = Math.max(...nodes.map(node => node.id)) + 1;
    const next = [...nodes, { id, parent: parent.id, type }];
    renderFlow(next, false);
    saveNodes(next);
    window.requestAnimationFrame(() => {
      selectNodeById(id);
      centerSelectedNode(id);
    });
    closeLibraryOnMobile();
    showToast('节点已添加。');
  }

  function centerSelectedNode(id) {
    const block = canvas.querySelector(`.blockid[value="${id}"]`)?.closest('.block');
    if (!block) return;
    canvas.scrollTo({
      left: Math.max(0, block.offsetLeft + block.offsetWidth / 2 - canvas.clientWidth / 2),
      top: Math.max(0, block.offsetTop - 120),
      behavior: 'smooth'
    });
  }

  function onGrab() {
    saveState.innerHTML = '<i aria-hidden="true"></i>编辑中';
  }

  function onRelease() {
    scheduleSave();
  }

  function onSnap(block, first, parent) {
    const current = getCurrentNodes();
    if (current.length >= MAX_NODES) {
      showToast('路线图最多保留 ' + MAX_NODES + ' 个节点。');
      return false;
    }
    const type = block.querySelector('.nodetype')?.value;
    const definition = definitionFor(type);
    const id = Number(block.querySelector('.blockid')?.value);
    if (!definition || !Number.isInteger(id)) return false;
    if (!first && parent) {
      const parentId = Number(parent.querySelector('.blockid')?.value);
      if (nodeDepth(current, parentId) >= 3) {
        showToast('节点层级已达到上限。');
        return false;
      }
    }
    block.className = `block map-node node--${definition.kind}`;
    block.dataset.nodeType = type;
    block.innerHTML = renderNodeInner(definition, id);
    window.setTimeout(scheduleSave, 220);
    return true;
  }

  function onRearrange() {
    window.setTimeout(scheduleSave, 220);
    return true;
  }

  function selectNodeById(id) {
    const block = canvas.querySelector(`.blockid[value="${id}"]`)?.closest('.map-node');
    if (!block) return;
    canvas.querySelectorAll('.map-node.selected').forEach(node => node.classList.remove('selected'));
    block.classList.add('selected');
    selectedNodeId = id;
    openInspector(block.dataset.nodeType, id);
  }

  function openInspector(type, id) {
    const definition = definitionFor(type);
    if (!definition) return;
    document.getElementById('inspectorKind').textContent = kindLabels[definition.kind];
    document.getElementById('inspectorMark').textContent = definition.mark;
    document.getElementById('inspectorTitle').textContent = definition.title;
    document.getElementById('inspectorDescription').textContent = definition.description;
    document.getElementById('inspectorDirection').textContent = definition.direction;
    document.getElementById('inspectorStatus').textContent = definition.status;
    document.getElementById('inspectorLevelValue').textContent = definition.level + '%';
    document.getElementById('inspectorLevelBar').style.width = definition.level + '%';
    inspectorLevel.querySelector('span').textContent = definition.kind === 'goal' ? '推进进度' : definition.kind === 'project' ? '完成度' : '熟练度';
    inspector.style.setProperty('--node-color', definition.color);
    inspector.style.setProperty('--node-soft', definition.soft);
    inspectorLevel.hidden = definition.kind === 'root';
    inspectorLink.hidden = !definition.link;
    if (definition.link) inspectorLink.href = definition.link;
    removeBranchButton.hidden = definition.kind === 'root';
    removeBranchButton.dataset.nodeId = String(id);
    inspector.classList.add('open');
    inspector.setAttribute('aria-hidden', 'false');
  }

  function closeInspector() {
    inspector.classList.remove('open');
    inspector.setAttribute('aria-hidden', 'true');
    canvas.querySelectorAll('.map-node.selected').forEach(node => node.classList.remove('selected'));
    selectedNodeId = null;
  }

  function removeSelectedBranch() {
    const id = Number(removeBranchButton.dataset.nodeId);
    const nodes = getCurrentNodes();
    const target = nodes.find(node => node.id === id);
    if (!target || target.parent === -1) return;
    const removed = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      nodes.forEach(node => {
        if (removed.has(node.parent) && !removed.has(node.id)) {
          removed.add(node.id);
          changed = true;
        }
      });
    }
    const next = nodes.filter(node => !removed.has(node.id));
    renderFlow(next, false);
    saveNodes(next);
    showToast('分支已删除。');
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function openLibrary() {
    libraryPanel.classList.add('open');
    libraryToggle.setAttribute('aria-expanded', 'true');
  }

  function closeLibraryOnMobile() {
    if (!window.matchMedia('(max-width: 820px)').matches) return;
    libraryPanel.classList.remove('open');
    libraryToggle.setAttribute('aria-expanded', 'false');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activeTab = tab.dataset.libraryTab;
      tabs.forEach(item => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      renderLibrary();
    });
  });

  nodeSearch.addEventListener('input', renderLibrary);
  nodeLibrary.addEventListener('click', event => {
    const addButton = event.target.closest('[data-add-node]');
    if (addButton) quickAdd(addButton.dataset.addNode);
  });

  canvas.addEventListener('click', event => {
    const block = event.target.closest('.map-node');
    if (block && !block.classList.contains('dragging')) {
      const id = Number(block.querySelector('.blockid')?.value);
      selectNodeById(id);
    } else if (event.target === canvas) {
      closeInspector();
      closeLibraryOnMobile();
    }
  });

  document.getElementById('inspectorClose').addEventListener('click', closeInspector);
  removeBranchButton.addEventListener('click', removeSelectedBranch);
  document.getElementById('centerButton').addEventListener('click', () => centerMap(true));
  document.getElementById('resetButton').addEventListener('click', () => {
    if (!window.confirm('恢复初始路线图？当前本地修改将被替换。')) return;
    const reset = defaultNodes.map(node => ({ ...node }));
    renderFlow(reset);
    saveNodes(reset);
    showToast('已恢复初始路线图。');
  });
  libraryToggle.addEventListener('click', () => libraryPanel.classList.contains('open') ? closeLibraryOnMobile() : openLibrary());
  libraryClose.addEventListener('click', closeLibraryOnMobile);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeInspector();
      closeLibraryOnMobile();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      scheduleSave();
    }
  });

  window.addEventListener('resize', () => {
    window.clearTimeout(window.skillMapResizeTimer);
    window.skillMapResizeTimer = window.setTimeout(() => {
      const nodes = getCurrentNodes();
      if (nodes.length) renderFlow(nodes, false);
    }, 180);
  });

  renderLibrary();
  const initialNodes = loadNodes();
  renderFlow(initialNodes);
  saveNodes(initialNodes);
});
