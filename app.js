(() => {
  const data = window.TRIP_DATA;
  const views = [...document.querySelectorAll('.view')];
  const navButtons = [...document.querySelectorAll('.nav-button')];
  const pageTitle = document.getElementById('pageTitle');
  const titleMap = { nowView: '今天要做什麼', daysView: '每天行程', checkView: 'Checklist' };
  let selectedDate = clampToTrip(localDateKey(new Date()));
  let deferredPrompt = null;

  function localDateKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseDateKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  }

  function addDays(key, delta) {
    const d = parseDateKey(key);
    d.setDate(d.getDate() + delta);
    return localDateKey(d);
  }

  function clampToTrip(key) {
    if (key < data.startDate) return data.startDate;
    if (key > data.endDate) return data.endDate;
    return key;
  }

  function dateLabel(key, withWeekday = true) {
    const d = parseDateKey(key);
    return new Intl.DateTimeFormat('zh-TW', {
      month: 'numeric', day: 'numeric', ...(withWeekday ? { weekday: 'short' } : {})
    }).format(d);
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  }

  function minutes(t) {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function nowMinutes() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function eventTimeText(e) {
    if (!e.start) return '彈性';
    return e.end ? `${e.start}\n${e.end}` : e.start;
  }

  function mapsUrl(q) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  }

  function eventCard(e) {
    const classes = ['event-card'];
    if (e.important) classes.push('important');
    if (e.danger) classes.push('danger');
    const tags = (e.tags || []).map(t => `<span class="tag ${/確認|重要|現金/.test(t) ? 'warning' : ''}">${escapeHtml(t)}</span>`).join('');
    return `
      <article class="${classes.join(' ')}">
        <div class="event-top">
          <div class="event-time">${escapeHtml(eventTimeText(e)).replace('\n','<br>')}</div>
          <div class="event-content">
            <div class="event-title">${escapeHtml(e.title)}</div>
            ${e.route ? `<div class="event-route">${escapeHtml(e.route)}</div>` : ''}
            ${e.detail ? `<div class="event-detail">${escapeHtml(e.detail)}</div>` : ''}
            ${tags ? `<div class="tag-row">${tags}</div>` : ''}
            ${e.map ? `<a class="map-link" target="_blank" rel="noopener" href="${mapsUrl(e.map)}">開啟地圖</a>` : ''}
          </div>
        </div>
      </article>`;
  }

  function dayData(key) {
    return data.days[key] || { title: '今天沒有行程資料', subtitle: '請查看紙本／領隊資料', events: [] };
  }

  function renderNow() {
    const key = localDateKey(new Date());
    const current = dayData(key);
    const todaySummary = document.getElementById('todaySummary');
    const nowCards = document.getElementById('nowCards');
    const nextCard = document.getElementById('nextCard');
    const todayMustDo = document.getElementById('todayMustDo');

    if (key < data.startDate) {
      const diff = Math.ceil((parseDateKey(data.startDate) - parseDateKey(key)) / 86400000);
      todaySummary.innerHTML = `<div class="hero-card"><div class="hero-date">${dateLabel(key)}</div><div class="hero-title">距離出發 ${diff} 天</div><div class="hero-sub">先到 Checklist 把行前確認完成。</div></div>`;
      nowCards.innerHTML = '<div class="empty-card"><strong>旅程尚未開始</strong>出發日是 8/25。</div>';
      nextCard.innerHTML = '';
      todayMustDo.innerHTML = '';
      return;
    }

    if (key > data.endDate) {
      todaySummary.innerHTML = `<div class="hero-card"><div class="hero-date">${dateLabel(key)}</div><div class="hero-title">旅程已結束</div><div class="hero-sub">行程仍可在「每天」頁查看。</div></div>`;
      nowCards.innerHTML = '';
      nextCard.innerHTML = '';
      todayMustDo.innerHTML = '';
      return;
    }

    todaySummary.innerHTML = `<div class="hero-card"><div class="hero-date">${dateLabel(key)}・今天</div><div class="hero-title">${escapeHtml(current.title)}</div><div class="hero-sub">${escapeHtml(current.subtitle || '')}</div></div>`;

    const cur = nowMinutes();
    const timed = (current.events || []).filter(e => e.start);
    const nearby = timed.filter(e => {
      const s = minutes(e.start);
      const end = minutes(e.end) ?? s;
      return end >= cur - 60 && s <= cur + 120;
    });
    nowCards.innerHTML = nearby.length ? nearby.map(eventCard).join('') : '<div class="empty-card"><strong>這 3 小時沒有排定事項</strong>可以休息，下一件事會顯示在下面。</div>';

    const next = timed.find(e => minutes(e.start) > cur + 120);
    nextCard.innerHTML = next ? `<div class="next-event-card"><div class="next-label">下一個排定事項</div><div class="next-title">${escapeHtml(next.start)}　${escapeHtml(next.title)}</div>${next.route ? `<div>${escapeHtml(next.route)}</div>` : ''}</div>` : '';

    const must = current.must || [];
    todayMustDo.innerHTML = must.length ? `<div class="must-card"><h2>今天一定要記得</h2>${must.map(x => `<div class="must-item"><span class="must-symbol">!</span><span>${escapeHtml(x)}</span></div>`).join('')}</div>` : '';
  }

  function renderDay() {
    const d = dayData(selectedDate);
    document.getElementById('dayHeader').innerHTML = `
      <div class="day-header">
        <div class="day-header-date">${dateLabel(selectedDate)}${selectedDate === localDateKey(new Date()) ? '・今天' : ''}</div>
        <div class="day-header-title">${escapeHtml(d.title)}</div>
        <div class="day-header-sub">${escapeHtml(d.subtitle || '')}</div>
      </div>
      ${d.stay ? `<div class="stay-card"><div class="stay-label">今晚住宿</div><div class="stay-name">${escapeHtml(d.stay)}</div></div>` : ''}`;
    document.getElementById('dayTimeline').innerHTML = (d.events || []).length
      ? `<div class="timeline">${d.events.map(eventCard).join('')}</div>`
      : '<div class="empty-card"><strong>沒有逐時資料</strong>請看領隊通知或紙本行程。</div>';
    document.getElementById('prevDay').disabled = selectedDate <= data.startDate;
    document.getElementById('nextDay').disabled = selectedDate >= data.endDate;
  }

  function checklistState() {
    try { return JSON.parse(localStorage.getItem('tripChecklistV1') || '{}'); }
    catch { return {}; }
  }

  function saveChecklistState(state) {
    localStorage.setItem('tripChecklistV1', JSON.stringify(state));
  }

  function renderChecklist() {
    const state = checklistState();
    document.getElementById('checklist').innerHTML = data.checklistSections.map(section => `
      <section class="check-section">
        <h2>${escapeHtml(section.title)}</h2>
        ${section.items.map(item => `
          <div class="check-row ${state[item.id] ? 'checked' : ''} ${item.alert ? 'alert' : ''}" data-check-row="${escapeHtml(item.id)}">
            <input id="${escapeHtml(item.id)}" type="checkbox" ${state[item.id] ? 'checked' : ''} />
            <label for="${escapeHtml(item.id)}">${escapeHtml(item.text)}${item.note ? `<span class="check-note">${escapeHtml(item.note)}</span>` : ''}</label>
          </div>`).join('')}
      </section>`).join('');

    document.querySelectorAll('#checklist input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        const s = checklistState();
        s[input.id] = input.checked;
        saveChecklistState(s);
        const row = input.closest('.check-row');
        row.classList.toggle('checked', input.checked);
      });
    });
  }

  function switchView(id) {
    views.forEach(v => v.classList.toggle('active', v.id === id));
    navButtons.forEach(b => b.classList.toggle('active', b.dataset.view === id));
    pageTitle.textContent = titleMap[id];
    if (id === 'nowView') renderNow();
    if (id === 'daysView') renderDay();
    if (id === 'checkView') renderChecklist();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  navButtons.forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
  document.getElementById('prevDay').addEventListener('click', () => { selectedDate = clampToTrip(addDays(selectedDate, -1)); renderDay(); });
  document.getElementById('nextDay').addEventListener('click', () => { selectedDate = clampToTrip(addDays(selectedDate, 1)); renderDay(); });
  document.getElementById('todayDay').addEventListener('click', () => { selectedDate = clampToTrip(localDateKey(new Date())); renderDay(); });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installButton').classList.remove('hidden');
  });
  document.getElementById('installButton').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    document.getElementById('installButton').classList.add('hidden');
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }

  renderNow();
  renderDay();
  renderChecklist();
  setInterval(renderNow, 60000);
})();
