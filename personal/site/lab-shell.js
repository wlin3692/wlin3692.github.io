(function initLabShell() {
  document.body.classList.add('lab-shell');
  const labPath = window.location.pathname.split('/portfolio/labs/')[1] || '';
  const depth = Math.max(0, labPath.split('/').length - 2);
  const rootHref = '../'.repeat(3 + depth) + 'index.html';
  const portfolioHref = `${rootHref}#portfolio`;
  const escapeHtml = (value) => String(value).replace(/[&<>\"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[character]));
  const currentTitle = document.querySelector('h1')?.textContent.trim()
    || document.title.split(/[|·]/)[0].trim()
    || '当前实验';
  const breadcrumb = document.createElement('nav');
  breadcrumb.className = 'lab-breadcrumb';
  breadcrumb.setAttribute('aria-label', '当前位置');
  breadcrumb.innerHTML = `<a href="${rootHref}">首页</a><span aria-hidden="true">/</span><a href="${portfolioHref}">作品集</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(currentTitle)}</span>`;
  const main = document.querySelector('main');
  if (main) main.parentNode.insertBefore(breadcrumb, main);

  const backLinks = [...document.querySelectorAll('a[href]')].filter((link) => {
    const href = link.getAttribute('href') || '';
    return href.includes('index.html#portfolio') || /(?:\.\.\/){2,}index\.html(?:$|#)/.test(href);
  });
  backLinks.forEach((link) => {
    link.classList.add('lab-shell-back');
    link.setAttribute('aria-label', link.getAttribute('aria-label') || '返回作品集');
  });
  if (backLinks.length) return;
  const homeHref = portfolioHref;
  const utility = document.createElement('div');
  utility.className = 'lab-shell-utility';
  utility.innerHTML = `<span>LOCAL LAB</span><a href="${homeHref}">返回作品集</a>`;
  document.body.appendChild(utility);
})();
