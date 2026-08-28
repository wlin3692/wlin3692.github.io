const SAMPLE_LOGS = `2026-08-28T09:12:04Z 10.0.0.8 GET /login 200
2026-08-28T09:12:11Z 10.0.0.8 POST /login 401
2026-08-28T09:12:18Z 10.0.0.9 GET /admin 403
2026-08-28T09:13:02Z 10.0.0.8 GET /dashboard 200
2026-08-28T09:13:22Z 203.0.113.7 GET /search?q=%27%20OR%201%3D1 500`;

const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const output = (html) => { const node = $('#toolOutput'); if (node) node.innerHTML = html; };
const tool = document.body.dataset.tool;

function exportAnalysisResult() {
  const sections = [`安全与工程实验室分析结果`, `工具：${tool || 'unknown'}`, `导出时间：${new Date().toLocaleString()}`];
  const result = $('#toolOutput');
  const metrics = $('#metrics');
  const resources = $('#resources');
  if (result) sections.push(`\n分析结果\n${result.textContent.trim() || '暂无结果'}`);
  if (metrics) sections.push(`\n关键指标\n${metrics.innerText.trim() || '暂无指标'}`);
  if (resources) sections.push(`\n资源明细\n${resources.innerText.trim() || '暂无资源明细'}`);

  const blob = new Blob([sections.join('\n') + '\n\n说明：所有数据均在当前浏览器本地处理，未上传服务器。'], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  const filename = `security-lab-${(tool || 'result').replace(/[^a-z0-9_-]+/gi, '-')}.txt`;
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function layout(title, lead, content) {
  document.querySelector('main')?.remove();
  const main = document.createElement('main');
  main.className = 'tool-main';
  main.innerHTML = `<div class="tool-head"><div><p class="engineering-kicker">SECURITY / LOCAL TOOL</p><h1>${title}</h1></div><div class="tool-head-side"><p>${lead}</p><div class="tool-head-actions"><button class="tool-button secondary" id="exportResult" type="button">导出分析结果</button></div></div></div>${content}`;
  document.body.insertBefore(main, document.querySelector('footer'));
  $('#exportResult').onclick = exportAnalysisResult;
}

function pageShell(title, lead, left, right = '<p class="tool-muted">输入只在当前浏览器处理，不会上传。</p>') {
  layout(title, lead, `<div class="tool-grid"><section class="tool-card">${left}</section><aside class="tool-card">${right}</aside></div>`);
}

function initLogs() {
  pageShell('网络安全日志<br><em>分析台。</em>', '把访问日志转换成可以快速判断的 IP、状态码和异常趋势。', `<h2>粘贴本地日志</h2><label>日志内容<textarea id="logInput"></textarea></label><div class="tool-row" style="margin-top:12px"><button class="tool-button" id="analyze">开始分析</button><button class="tool-button secondary" id="loadLogSample">填入示例</button><button class="tool-button secondary" id="clear">清空</button></div><div id="toolOutput" class="tool-output" aria-live="polite">等待分析</div>`, '<h2>分析口径</h2><p class="tool-muted">支持常见的“时间 IP 方法 路径 状态码”格式。重点关注 4xx、5xx、登录失败和高频来源。</p><div id="metrics" class="metric-grid"></div>');
  $('#analyze').onclick = () => {
    const lines = $('#logInput').value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const rows = lines.map((line) => { const m = line.match(/^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\d{3})/); return m ? {time:m[1],ip:m[2],method:m[3],path:m[4],status:Number(m[5])} : null; }).filter(Boolean);
    const counts = rows.reduce((map, row) => { map[row.status] = (map[row.status] || 0) + 1; return map; }, {});
    const ips = rows.reduce((map, row) => { map[row.ip] = (map[row.ip] || 0) + 1; return map; }, {});
    const suspicious = rows.filter((row) => row.status >= 400 || /login|admin|1=1|or%20/i.test(row.path));
    $('#metrics').innerHTML = `<div class="metric"><b>${rows.length}</b><span>有效记录</span></div><div class="metric"><b>${Object.keys(ips).length}</b><span>来源 IP</span></div><div class="metric"><b>${suspicious.length}</b><span>待关注记录</span></div>`;
    output(`<strong>状态码分布：</strong> ${Object.entries(counts).map(([key,value]) => `${key} × ${value}`).join(' · ') || '无'}\n<strong>高频来源：</strong> ${Object.entries(ips).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([key,value]) => `${key} × ${value}`).join(' · ') || '无'}\n<strong>建议关注：</strong> ${suspicious.length ? suspicious.map((row) => `${row.ip} ${row.status} ${row.path}`).join('\n') : '暂未发现明显异常'}`);
  };
  $('#loadLogSample').onclick = () => { $('#logInput').value = SAMPLE_LOGS; $('#analyze').click(); };
  $('#clear').onclick = () => { $('#logInput').value = ''; output('等待分析'); $('#metrics').innerHTML = ''; };
  $('#loadLogSample').click();
}

function initHeaders() {
  const sample = `HTTP/1.1 200 OK\ncontent-type: text/html; charset=utf-8\nstrict-transport-security: max-age=31536000\ncontent-security-policy: default-src 'self'\nx-content-type-options: nosniff\nx-frame-options: SAMEORIGIN\nreferrer-policy: strict-origin-when-cross-origin`;
  pageShell('HTTP 安全<br><em>检测器。</em>', '粘贴授权目标的响应头，快速检查常见浏览器安全基线。静态页面不会代替真实扫描。', `<h2>响应头检查</h2><label>目标备注<input id="target" placeholder="例如：本地测试站 / staging"></label><label style="margin-top:12px">原始响应头<textarea id="headers">${sample}</textarea></label><div class="tool-row" style="margin-top:12px"><button class="tool-button" id="scan">检查基线</button><button class="tool-button secondary" id="sample">填入示例</button></div><div id="toolOutput" class="tool-output" aria-live="polite">等待检查</div>`, '<h2>检查项目</h2><p class="tool-muted">CSP · HSTS · X-Content-Type-Options · X-Frame-Options · Referrer-Policy</p><p class="tool-muted">提示：浏览器跨域限制会阻止静态页面直接读取任意网站响应头，因此采用本地粘贴方式。</p>');
  $('#scan').onclick = () => { const text = $('#headers').value.toLowerCase(); const checks = [['content-security-policy','CSP'],['strict-transport-security','HSTS'],['x-content-type-options','防 MIME 嗅探'],['x-frame-options','防点击劫持'],['referrer-policy','Referrer Policy']]; const items = checks.map(([key,label]) => `<div class="status-${text.includes(key) ? 'good' : 'warn'}">${text.includes(key) ? '✓' : '△'} ${label}：${text.includes(key) ? '已发现' : '未发现'}</div>`).join(''); output(`<strong>${esc($('#target').value || '当前输入')}</strong>\n${items}`); };
  $('#sample').onclick = () => { $('#headers').value = sample; $('#scan').click(); };
}

function decodeBase64(value) { const normalized = value.replace(/-/g,'+').replace(/_/g,'/') + '='.repeat((4 - value.length % 4) % 4); const bytes = Uint8Array.from(atob(normalized), (c) => c.charCodeAt(0)); return new TextDecoder().decode(bytes); }
function initJwt() {
  pageShell('JWT / Base64<br><em>解码器。</em>', '在浏览器本地拆解 Token 的 Header、Payload 与时间字段，不验证签名，也不发送网络请求。', `<h2>输入 Token</h2><label>JWT 或 Base64 文本<textarea id="tokenInput" placeholder="eyJhbGciOi..."></textarea></label><div class="tool-row" style="margin-top:12px"><button class="tool-button" id="decode">本地解码</button><button class="tool-button secondary" id="jwtSample">填入示例</button></div><div id="toolOutput" class="tool-output" aria-live="polite">等待解码</div>`, '<h2>安全提示</h2><p class="tool-muted">解码不等于验证。请勿把生产环境的真实 Token 粘贴到公共电脑或第三方网站。</p>');
  $('#decode').onclick = () => { try { const parts = $('#tokenInput').value.trim().split('.'); if (parts.length === 3) { const header = JSON.parse(decodeBase64(parts[0])); const payload = JSON.parse(decodeBase64(parts[1])); const exp = payload.exp ? new Date(payload.exp * 1000).toLocaleString() : '未提供'; output(`<strong>Header</strong>\n${esc(JSON.stringify(header,null,2))}\n\n<strong>Payload</strong>\n${esc(JSON.stringify(payload,null,2))}\n\n<strong>过期时间：</strong>${esc(exp)}\n<strong>签名：</strong>已读取，未验证`); } else { output(`<strong>Base64 解码结果</strong>\n${esc(decodeBase64($('#tokenInput').value.trim()))}`); } } catch (error) { output(`<span class="status-warn">无法解码：${esc(error.message)}</span>`); } };
  $('#jwtSample').onclick = () => { $('#tokenInput').value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsaW4iLCJyb2xlIjoidmlld2VyIiwiZXhwIjo0MTAyNDQ0ODAwfQ.demo-signature'; $('#decode').click(); };
}

function rotr(x,n){return (x>>>n)|(x<<(32-n));}
function sm3(input){ const bytes = new TextEncoder().encode(input); const bitLen=bytes.length*8; const padded=[...bytes,128]; while((padded.length%64)!==56)padded.push(0); for(let i=7;i>=0;i--)padded.push((bitLen/2**(i*8))&255); let v=[0x7380166f,0x4914b2b9,0x172442d7,0xda8a0600,0xa96f30bc,0x163138aa,0xe38dee4d,0xb0fb0e4e]; const t=(j)=>j<16?0x79cc4519:0x7a879d8a; for(let o=0;o<padded.length;o+=64){let w=new Array(68),w1=new Array(64);for(let j=0;j<16;j++)w[j]=((padded[o+j*4]<<24)|(padded[o+j*4+1]<<16)|(padded[o+j*4+2]<<8)|padded[o+j*4+3])>>>0;for(let j=16;j<68;j++){const x=(w[j-16]^w[j-9]^rotr(w[j-3],15))>>>0;w[j]=(x^rotr(x,15)^rotr(x,23)^w[j-13]^rotr(w[j-6],7))>>>0;}for(let j=0;j<64;j++)w1[j]=(w[j]^w[j+4])>>>0;let [a,b,c,d,e,f,g,h]=v;for(let j=0;j<64;j++){const ss1=rotr(((rotr(a,12)+e+rotr(t(j),j%32))>>>0),7),ss2=(ss1^rotr(a,12))>>>0;const ff=j<16?(a^b^c):((a&b)|(a&c)|(b&c));const gg=j<16?(e^f^g):((e&f)|((~e)&g));const tt=(ff+d+ss2+w1[j])>>>0;const uu=(gg+h+ss1+w[j])>>>0;d=c;c=rotr(b,9);b=a;a=tt;h=g;g=rotr(f,19);f=e;e=(uu^rotr(uu,9)^rotr(uu,17))>>>0;}v=v.map((x,i)=>x^ [a,b,c,d,e,f,g,h][i]);}return v.map(x=>x.toString(16).padStart(8,'0')).join(''); }
function initSm() { pageShell('国密算法<br><em>实验室。</em>', '用一个可复现的 SM3 摘要实验理解国密哈希的输入、填充与摘要输出。', `<h2>SM3 摘要</h2><label>输入文本<textarea id="smInput">abc</textarea></label><div class="tool-row" style="margin-top:12px"><button class="tool-button" id="hash">计算 SM3</button><button class="tool-button secondary" id="smSample">填入示例</button></div><div id="toolOutput" class="tool-output" aria-live="polite">等待计算</div>`, '<h2>算法笔记</h2><p class="tool-muted">SM3 输出 256 bit 摘要。这里使用浏览器内的教学实现，适合理解流程与做输入对照，不替代生产密码库。</p><p class="tool-muted">SM2、SM4 可作为后续扩展：前者用于公钥密码，后者用于对称加密。</p>'); $('#hash').onclick=()=>output(`<strong>SM3 摘要</strong>\n${sm3($('#smInput').value)}\n\n输入长度：${new TextEncoder().encode($('#smInput').value).length} bytes`); $('#smSample').onclick=()=>{$('#smInput').value='小林安全实验室';$('#hash').click()}; $('#hash').click(); }

function initDefense() { pageShell('Web 攻防<br><em>演示台。</em>', '用无害的模拟输入观察 XSS、SQL 注入和 CSRF 的风险信号与基本防御思路。', `<div class="tool-tabs"><button class="tool-tab active" data-defense="xss">XSS</button><button class="tool-tab" data-defense="sql">SQLi</button><button class="tool-tab" data-defense="csrf">CSRF</button></div><div id="defenseDemo"></div><div id="toolOutput" class="tool-output" aria-live="polite">等待检测</div>`, '<h2>实验边界</h2><p class="tool-muted">页面只在本地展示模拟结果，不执行输入中的脚本，不连接数据库，也不发送请求。</p>'); const render=(mode)=>{const d=$('#defenseDemo'); if(mode==='xss')d.innerHTML='<label>模拟评论<input id="attackInput" value="&lt;img src=x onerror=alert(1)&gt;"></label><button class="tool-button" id="runDefense" style="margin-top:12px">检查输出</button>'; if(mode==='sql')d.innerHTML='<label>模拟查询参数<input id="attackInput" value="\' OR 1=1 --"></label><button class="tool-button" id="runDefense" style="margin-top:12px">检查输入</button>'; if(mode==='csrf')d.innerHTML='<label>请求来源<input id="attackInput" value="https://unknown.example"></label><button class="tool-button" id="runDefense" style="margin-top:12px">检查请求</button>'; $('#runDefense').onclick=()=>{const v=$('#attackInput').value;const risk=mode==='xss'?/[<>]|onerror|javascript:/i.test(v):mode==='sql'?/(union\s+select|or\s+1\s*=\s*1|--|;)/i.test(v):!v.startsWith(location.origin);output(`<strong>${mode.toUpperCase()} 模拟结果</strong>\n风险信号：${risk?'已发现':'未发现'}\n防御建议：${mode==='xss'?'使用 textContent 输出并启用 CSP。':mode==='sql'?'使用参数化查询和服务端输入校验。':'使用 CSRF Token、SameSite Cookie 和 Origin 校验。'}\n安全渲染预览：${esc(v)}`)} }; document.querySelectorAll('[data-defense]').forEach((b)=>b.onclick=()=>{document.querySelectorAll('[data-defense]').forEach((x)=>x.classList.toggle('active',x===b));render(b.dataset.defense)}); render('xss'); }

function initTopology() { pageShell('网络拓扑与<br><em>攻击路径图。</em>', '拖动式拓扑的轻量版本：添加资产、建立连线，再观察一条示例攻击路径。', `<h2>资产关系</h2><div class="network-map" id="networkMap"><svg id="networkSvg" aria-hidden="true"></svg></div><div class="tool-row" style="margin-top:12px"><button class="tool-button" id="addNode">添加资产</button><button class="tool-button secondary" id="resetMap">重置</button></div><ol id="pathList" class="path-list"></ol>`, '<h2>拓扑说明</h2><p class="tool-muted">示例资产：公网入口、Web 服务、数据库。真实项目中可以继续加入端口、漏洞等级和访问控制。</p>'); let nodes=[{name:'公网入口',meta:'203.0.113.7',x:9,y:37},{name:'Web 服务',meta:'443 / 8080',x:43,y:20},{name:'数据库',meta:'3306',x:74,y:58}]; const draw=()=>{const map=$('#networkMap'),svg=$('#networkSvg'); map.querySelectorAll('.network-node').forEach(x=>x.remove()); svg.innerHTML=''; nodes.forEach((n,i)=>{const el=document.createElement('button');el.className='network-node';el.style.left=`${n.x}%`;el.style.top=`${n.y}%`;el.textContent=n.name;const s=document.createElement('small');s.textContent=n.meta;el.append(s);el.onclick=()=>output(`<strong>资产详情</strong>\n${n.name}\n${n.meta}\n建议：确认暴露面、访问控制与日志记录。`);map.append(el); if(i<nodes.length-1){const next=nodes[i+1];const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',`${n.x+8}%`);line.setAttribute('y1',`${n.y+8}%`);line.setAttribute('x2',`${next.x}%`);line.setAttribute('y2',`${next.y+8}%`);line.setAttribute('stroke','#62e3c5');line.setAttribute('stroke-dasharray','5 5');svg.append(line);}});$('#pathList').innerHTML=nodes.map((n,i)=>`<li>${i+1}. ${esc(n.name)} <span class="tool-muted">${esc(n.meta)}</span></li>`).join('');}; $('#addNode').onclick=()=>{const i=nodes.length+1;nodes.push({name:`资产 ${i}`,meta:'待配置端口',x:18+(i%3)*27,y:12+(i%4)*18});draw()};$('#resetMap').onclick=()=>{nodes=nodes.slice(0,3);draw()};draw(); }

function initPerformance() { pageShell('前端性能<br><em>监控台。</em>', '读取当前页面的 Navigation Timing 与资源条目，快速了解页面启动成本。', `<h2>当前页面指标</h2><div id="metrics" class="metric-grid"></div><div id="toolOutput" class="tool-output" aria-live="polite">正在读取性能数据…</div><h3>资源明细</h3><div id="resources"></div>`, '<h2>指标说明</h2><p class="tool-muted">数据来自浏览器 Performance API。不同浏览器、缓存状态和本地文件打开方式都会影响结果。</p>'); const nav=performance.getEntriesByType('navigation')[0]; const resources=performance.getEntriesByType('resource'); const load=Math.round(nav?.loadEventEnd||0); const dom=Math.round(nav?.domContentLoadedEventEnd||0); $('#metrics').innerHTML=`<div class="metric"><b>${load || '--'}<small> ms</small></b><span>页面加载</span></div><div class="metric"><b>${dom || '--'}<small> ms</small></b><span>DOM 完成</span></div><div class="metric"><b>${resources.length}</b><span>资源数量</span></div>`; output(`<strong>当前页面：</strong>${esc(location.pathname)}\n<strong>建议：</strong>优先压缩大图片、延迟非关键脚本，并避免首屏加载不需要的媒体。`); $('#resources').innerHTML=`<table class="data-table"><thead><tr><th>资源</th><th>类型</th><th>耗时</th></tr></thead><tbody>${resources.slice(0,12).map((r)=>`<tr><td>${esc(new URL(r.name).pathname.split('/').pop()||'/')}</td><td>${esc(r.initiatorType)}</td><td>${Math.round(r.duration)} ms</td></tr>`).join('')}</tbody></table>`; }

const initializers={logs:initLogs,headers:initHeaders,jwt:initJwt,sm:initSm,defense:initDefense,topology:initTopology,performance:initPerformance};
if(initializers[tool]) initializers[tool]();
