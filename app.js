// ── Auth ──────────────────────────────────────────────────
const _kbUser = (()=>{
  try { return JSON.parse(sessionStorage.getItem('kb_user')); } catch(e){ return null; }
})();
if (!_kbUser) { window.location.replace('login.html'); }

let state = {
  isAdmin: _kbUser?.role === 'admin',
  currentCategory: null,
  currentScenario: null,
  activeModule: 'all',
  customData: null
};

function getData() {
  if (state.customData) return state.customData;
  const saved = localStorage.getItem('kb_data');
  if (saved) { try { state.customData = JSON.parse(saved); return state.customData; } catch(e){} }
  return KB_DATA;
}

function saveData(data) {
  state.customData = data;
  localStorage.setItem('kb_data', JSON.stringify(data));
}

// ── Module Filter ─────────────────────────────────────────
function filterModule(moduleId) {
  state.activeModule = moduleId;
  document.querySelectorAll('.mod-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { 'all':'tab-all', 'ai-watching':'tab-ai', 'store-manager':'tab-sm', 'system-devices':'tab-sys', 'training-standards':'tab-tr' };
  document.getElementById(tabMap[moduleId])?.classList.add('active');
  showHome();
}

function getFilteredCategories() {
  const data = getData();
  if (state.activeModule === 'all') {
    return data.modules.flatMap(m => m.categories.map(c => ({...c, module: m.id, moduleName: m.name})));
  }
  const module = data.modules.find(m => m.id === state.activeModule);
  return module ? module.categories.map(c => ({...c, module: module.id, moduleName: module.name})) : [];
}

// ── Nav Tree ──────────────────────────────────────────────
function renderNav(filter) {
  const cats = getFilteredCategories();
  const tree = document.getElementById('nav-tree');
  tree.innerHTML = cats.map(cat => {
    const scenarios = filter
      ? cat.scenarios.filter(s => matchSearch(s, filter))
      : cat.scenarios;
    if (filter && !scenarios.length) return '';
    return `<div class="nav-l1 ${state.currentCategory===cat.id?'open':''}" id="nav-${cat.id}">
      <div class="nav-l1-label" onclick="toggleNav('${cat.id}')">
        <span class="arrow">▶</span>
        <span class="nav-l1-icon">${cat.icon}</span>
        <span>${cat.name}</span>
      </div>
      <div class="nav-l2-list">
        ${scenarios.map(s => `<div class="nav-l2 ${state.currentScenario===s.id?'active':''}" onclick="showScenario('${cat.id}','${s.id}')">${s.title}</div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function toggleNav(catId) {
  const el = document.getElementById('nav-'+catId);
  if (el) el.classList.toggle('open');
}

// ── Home ──────────────────────────────────────────────────
function showHome() {
  state.currentCategory = null;
  state.currentScenario = null;
  document.getElementById('search-results').className = '';
  document.getElementById('scenario-view').style.display = 'none';
  const data = getData();
  const allCats = data.modules.flatMap(m => m.categories);
  const total = allCats.reduce((n,c)=>n+c.scenarios.length,0);
  const high  = allCats.reduce((n,c)=>n+c.scenarios.filter(s=>s.risk==='high').length,0);

  const moduleCards = state.activeModule === 'all'
    ? data.modules.map(mod => {
        const cnt = mod.categories.reduce((n,c)=>n+c.scenarios.length,0);
        const clsMap = {'ai-watching':'mod-ai','store-manager':'mod-sop','system-devices':'mod-exception','training-standards':'mod-ai'};
        return `<div class="module-card ${clsMap[mod.id]||'mod-sop'}" onclick="filterModule('${mod.id}')">
          <div class="mc-icon">${mod.icon}</div>
          <div class="mc-title">${mod.name}</div>
          <div class="mc-desc">${mod.desc}</div>
          <div class="mc-stats">
            <div class="mc-stat"><strong>${mod.categories.length}</strong>分类</div>
            <div class="mc-stat"><strong>${cnt}</strong>场景</div>
          </div>
        </div>`;
      }).join('')
    : '';

  // 高频场景
  const highFreqScens = [];
  if (state.activeModule === 'all') {
    data.modules.forEach(mod => mod.categories.forEach(cat => cat.scenarios.forEach(s => {
      if (HIGH_FREQ_IDS.includes(s.id)) highFreqScens.push({cat, s});
    })));
    highFreqScens.sort((a,b)=>({high:0,mid:1,low:2}[a.s.risk]-{high:0,mid:1,low:2}[b.s.risk]));
  }
  const highFreqHtml = highFreqScens.length ? `
    <div class="page-header" style="margin-top:8px"><h2>⚡ 高频场景</h2><p style="font-size:12px;color:var(--text-secondary)">最常处理的场景，快速直达</p></div>
    <div class="hf-grid">
      ${highFreqScens.map(({cat,s})=>`
        <div class="hf-card risk-border-${s.risk}" onclick="showScenario('${cat.id}','${s.id}')">
          <div class="hf-top">
            <span class="hf-title">${s.title}</span>
            <span class="risk-badge risk-${s.risk}">${{high:'高风险',mid:'中风险',low:'低风险'}[s.risk]}</span>
          </div>
          <div class="hf-cat">${cat.icon} ${cat.name}</div>
          ${s.flow?.length ? `<div class="hf-step">第一步：${s.flow[0].step}</div>` : ''}
        </div>`).join('')}
    </div>` : '';

  const cv = document.getElementById('category-view');
  cv.style.display = 'block';
  cv.innerHTML = `
    <div class="home-stats">
      <div class="stat-card"><div class="stat-num">${allCats.length}</div><div class="stat-label">场景分类</div></div>
      <div class="stat-card"><div class="stat-num">${total}</div><div class="stat-label">处理场景</div></div>
      <div class="stat-card"><div class="stat-num">${high}</div><div class="stat-label">高风险场景</div></div>
      <div class="stat-card"><div class="stat-num">24h</div><div class="stat-label">全天值守</div></div>
    </div>
    ${moduleCards ? `<div class="module-grid">${moduleCards}</div>` : ''}
    ${highFreqHtml}
    <div class="page-header" style="margin-top:8px"><h2>📢 近期流程更新</h2><p style="font-size:12px;color:var(--text-secondary)">管理员发布的最新流程变更</p></div>
    ${renderUpdates()}
    ${state.activeModule !== 'all' ? `
    <div class="page-header" style="margin-top:16px"><h2>${data.modules.find(m=>m.id===state.activeModule)?.name||''}</h2></div>
    <div class="scenario-list">
      ${getFilteredCategories().map(cat=>`
        <div class="scenario-item" onclick="showCategory('${cat.id}')">
          <div class="s-body">
            <div class="s-title">${cat.icon} ${cat.name}</div>
            <div class="s-tags"><span class="s-tag">${cat.scenarios.length} 个场景</span></div>
          </div>
          <span class="s-arrow">›</span>
        </div>`).join('')}
    </div>` : ''}`;
  renderNav();
}

// ── Category ──────────────────────────────────────────────
function showCategory(catId) {
  state.currentCategory = catId;
  state.currentScenario = null;
  document.getElementById('search-results').className = '';
  document.getElementById('scenario-view').style.display = 'none';
  const data = getData();
  let cat = null;
  let moduleName = '';
  for (const mod of data.modules) {
    const found = mod.categories.find(c=>c.id===catId);
    if (found) {
      cat = found;
      moduleName = mod.name;
      break;
    }
  }
  if (!cat) return;
  const cv = document.getElementById('category-view');
  cv.style.display = 'block';
  cv.innerHTML = `
    <div class="breadcrumb-nav">
      <span class="bc-link" onclick="showHome()">首页</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">${cat.name}</span>
    </div>
    <div class="page-header"><h2>${cat.icon} ${cat.name}</h2><p>${cat.desc}</p></div>
    <div class="scenario-list">
      ${cat.scenarios.map(s=>`
        <div class="scenario-item" onclick="showScenario('${catId}','${s.id}')">
          <div class="s-body">
            <div class="s-title">${s.title}</div>
            <div class="s-tags">${s.tags.map(t=>`<span class="s-tag">${t}</span>`).join('')}</div>
          </div>
          <span class="risk-badge risk-${s.risk}">${{high:'高风险',mid:'中风险',low:'低风险'}[s.risk]}</span>
          <span class="s-arrow">›</span>
        </div>`).join('')}
    </div>`;
  renderNav();
  document.getElementById('nav-'+catId)?.classList.add('open');
}

// ── Scenario Detail ────────────────────────────────────────
function showScenario(catId, scenarioId) {
  state.currentCategory = catId;
  state.currentScenario = scenarioId;
  document.getElementById('search-results').className = '';
  document.getElementById('category-view').style.display = 'none';
  const data = getData();
  let cat = null;
  for (const mod of data.modules) {
    const found = mod.categories.find(c=>c.id===catId);
    if (found) {
      cat = found;
      break;
    }
  }
  const s = cat?.scenarios.find(sc=>sc.id===scenarioId);
  if (!s) return;
  const riskLabel = {high:'高风险',mid:'中风险',low:'低风险'}[s.risk];
  const sv = document.getElementById('scenario-view');
  sv.style.display = 'block';
  sv.innerHTML = `
    <div class="breadcrumb-nav">
      <span class="bc-link" onclick="showHome()">首页</span>
      <span class="bc-sep">/</span>
      <span class="bc-link" onclick="showCategory('${catId}')">${cat.name}</span>
      <span class="bc-sep">/</span>
      <span class="bc-cur">${s.title}</span>
    </div>
    <div class="scenario-header">
      <h2>${s.title}</h2>
      <div class="scenario-meta">
        <span class="risk-badge risk-${s.risk}">${riskLabel}</span>
        ${s.needReport?`<span class="risk-badge risk-high">需上报班长</span>`:''}
        ${s.tags.map(t=>`<span class="meta-tag">${t}</span>`).join('')}
      </div>
      ${s.criteria?`<div style="font-size:13px;color:#555;margin-top:8px">触发条件：${s.criteria}</div>`:''}
      ${s.notes?`<div class="warning-box"><strong>注意：</strong>${s.notes}</div>`:""}
    </div>
    ${s.flow?.length?`
    <div class="section-card">
      <h4><span class="section-icon">📋</span>处理流程</h4>
      <div class="flow-steps">
        ${s.flow.map((f,i)=>`
          <div class="flow-step">
            <div class="step-num">${i+1}</div>
            <div class="step-content">${f.step}</div>
          </div>`).join('')}
      </div>
    </div>`:''}
    ${s.scripts?.length?`
    <div class="section-card">
      <h4><span class="section-icon">💬</span>参考话术</h4>
      ${s.scripts.map(sc=>`
        <div class="script-box">
          <div class="script-label">${sc.label}</div>
          <p>${sc.text.replace(/\n/g,'<br>')}</p>
        </div>`).join('')}
    </div>`:''}
    ${s.transferCondition?`
    <div class="section-card">
      <h4><span class="section-icon">🔄</span>转人工条件</h4>
      <div style="font-size:13px;color:var(--text);line-height:1.8">${s.transferCondition}</div>
    </div>`:''}
    ${s.identifyTips?.length?`
    <div class="section-card">
      <h4><span class="section-icon">🔍</span>识别要点</h4>
      <div class="flow-steps">
        ${s.identifyTips.map(t=>`<div class="flow-step"><div class="step-num dot">·</div><div class="step-content">${t}</div></div>`).join('')}
      </div>
    </div>`:''}
    ${state.isAdmin?`<div style="margin-top:12px"><button class="btn btn-default btn-sm" onclick="openEdit('${catId}','${scenarioId}')">✏️ 编辑此场景</button></div>`:''}
  `;
  renderNav();
  document.getElementById('nav-'+catId)?.classList.add('open');
  document.querySelectorAll('.nav-l2').forEach(el=>{
    el.classList.toggle('active', el.textContent===s.title);
  });
  document.getElementById('edit-fab').className = state.isAdmin?'edit-fab show':'edit-fab';
}

// ── Updates ───────────────────────────────────────────────
function renderUpdates() {
  const items = JSON.parse(localStorage.getItem('kb_updates') || '[]');
  if (!items.length) return `<div class="updates-empty">暂无流程更新，管理员可在后台上传</div>`;
  const doubled = [...items, ...items];
  return `<div class="updates-slider"><div class="slide-track">${doubled.map(u=>`
    <div class="slide-item"><img src="${u.img}" alt="${u.title}">
      <div class="slide-caption">${u.title}<div class="slide-time">${u.time}</div></div>
    </div>`).join('')}</div></div>`;
}

// ── Search ────────────────────────────────────────────────
function matchSearch(s, q) {
  q = q.toLowerCase();
  return s.title.toLowerCase().includes(q)
    || s.tags.some(t=>t.includes(q))
    || s.keywords?.some(k=>k.includes(q))
    || s.scripts?.some(sc=>sc.text.includes(q))
    || s.notes?.includes(q);
}

function globalSearch(q) {
  if (!q.trim()) { clearSearch(); return; }
  const data = getData();
  const results = [];
  data.modules.forEach(mod=>{
    mod.categories.forEach(cat=>{
      cat.scenarios.forEach(s=>{
        if (matchSearch(s,q)) results.push({cat,s});
      });
    });
  });
  document.getElementById('category-view').style.display = 'none';
  document.getElementById('scenario-view').style.display = 'none';
  const sr = document.getElementById('search-results');
  sr.className = 'show';
  sr.innerHTML = results.length
    ? `<div class="page-header"><h2>搜索"${q}"</h2><p>找到 ${results.length} 个相关场景</p></div>`
      + results.map(({cat,s})=>`
        <div class="search-result-item" onclick="showScenario('${cat.id}','${s.id}')">
          <div class="sr-breadcrumb">${cat.name}</div>
          <div class="sr-title">${highlight(s.title,q)}</div>
          <div class="sr-snippet">${s.scripts?.[0]?highlight(s.scripts[0].text,q):s.tags.join(' · ')}</div>
        </div>`).join('')
    : `<div class="empty"><div class="empty-icon">🔍</div><p>未找到"${q}"相关场景</p></div>`;
  renderNav(q);
}

function highlight(text, q) {
  return text.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<span class="highlight">${m}</span>`);
}

function clearSearch() {
  document.getElementById('global-search').value = '';
  document.getElementById('search-results').className = '';
  showHome();
}

function sidebarSearch(q) {
  renderNav(q.trim()||null);
  if (q.trim()) {
    document.querySelectorAll('.nav-l1').forEach(el=>el.classList.add('open'));
  }
}

// ── Admin ─────────────────────────────────────────────────
function showAdminLogin() {
  document.getElementById('login-overlay').style.display = 'flex';
  setTimeout(()=>document.getElementById('admin-pwd').focus(),100);
}

function doAdminLogin() {
  const pwd = document.getElementById('admin-pwd').value;
  if (btoa(pwd) === ADMIN_CONFIG.passwordHash) {
    state.isAdmin = true;
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('admin-pwd').value = '';
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('admin-status').textContent = '管理员模式';
    if (state.currentScenario) showScenario(state.currentCategory, state.currentScenario);
    else document.getElementById('edit-fab').className = 'edit-fab show';
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

function closeLogin() {
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('admin-pwd').value = '';
  document.getElementById('login-error').style.display = 'none';
}

function openEditCurrent() {
  if (state.currentScenario) openEdit(state.currentCategory, state.currentScenario);
}

function openEdit(catId, scenarioId) {
  const data = getData();
  let cat = null;
  for (const mod of data.modules) {
    const found = mod.categories.find(c=>c.id===catId);
    if (found) {
      cat = found;
      break;
    }
  }
  const s = cat?.scenarios.find(sc=>sc.id===scenarioId);
  if (!s) return;
  document.getElementById('admin-form-body').innerHTML = `
    <input type="hidden" id="edit-cat-id" value="${catId}">
    <input type="hidden" id="edit-scenario-id" value="${scenarioId}">
    <div class="form-group"><label>场景标题</label><input id="edit-title" value="${s.title}"></div>
    <div class="form-group"><label>风险等级</label>
      <select id="edit-risk">
        <option value="low" ${s.risk==='low'?'selected':''}>低风险</option>
        <option value="mid" ${s.risk==='mid'?'selected':''}>中风险</option>
        <option value="high" ${s.risk==='high'?'selected':''}>高风险</option>
      </select>
    </div>
    <div class="form-group"><label>关键词（逗号分隔）</label><input id="edit-keywords" value="${(s.keywords||[]).join(',')}"></div>
    <div class="form-group"><label>处理流程（每行一步）</label>
      <textarea id="edit-flow">${(s.flow||[]).map(f=>f.step).join('\n')}</textarea>
    </div>
    <div class="form-group"><label>参考话术（格式：标签|话术内容，每行一条）</label>
      <textarea id="edit-scripts">${(s.scripts||[]).map(sc=>sc.label+'|'+sc.text).join('\n')}</textarea>
    </div>
    <div class="form-group"><label>注意事项</label><input id="edit-notes" value="${s.notes||''}"></div>
  `;
  document.getElementById('admin-panel').className = 'show';
}

function saveScenario() {
  const catId = document.getElementById('edit-cat-id').value;
  const scenarioId = document.getElementById('edit-scenario-id').value;
  const data = JSON.parse(JSON.stringify(getData()));
  let cat = null;
  for (const mod of data.modules) {
    const found = mod.categories.find(c=>c.id===catId);
    if (found) {
      cat = found;
      break;
    }
  }
  const s = cat?.scenarios.find(sc=>sc.id===scenarioId);
  if (!s) return;
  s.title = document.getElementById('edit-title').value.trim();
  s.risk = document.getElementById('edit-risk').value;
  s.keywords = document.getElementById('edit-keywords').value.split(',').map(k=>k.trim()).filter(Boolean);
  s.flow = document.getElementById('edit-flow').value.split('\n').map(l=>l.trim()).filter(Boolean).map(step=>({step}));
  s.scripts = document.getElementById('edit-scripts').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{
    const [label,...rest] = l.split('|'); return {label:label.trim(), text:rest.join('|').trim()};
  });
  s.notes = document.getElementById('edit-notes').value.trim();
  saveData(data);
  closeAdminPanel();
  showScenario(catId, scenarioId);
}

function closeAdminPanel() {
  document.getElementById('admin-panel').className = '';
}

function doLogout() {
  sessionStorage.removeItem('kb_user');
  window.location.replace('login.html');
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', ()=>{
  if (_kbUser) {
    document.getElementById('user-name').textContent = _kbUser.name;
    if (_kbUser.role === 'guest') {
      document.getElementById('admin-status').textContent = '访客模式';
    }
    if (_kbUser.role === 'admin') {
      document.getElementById('admin-btn').style.display = '';
      document.getElementById('backend-btn').style.display = '';
      document.getElementById('admin-status').textContent = '管理员模式';
    }
  }
  showHome();
  document.getElementById('admin-pwd').addEventListener('keydown', e=>{
    if (e.key==='Enter') doAdminLogin();
    if (e.key==='Escape') closeLogin();
  });
});
