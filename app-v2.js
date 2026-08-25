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

  function shortDayTitle(key) {
    const title = dayData(key).title || '';
    return title.length > 12 ? `${title.slice(0, 12)}…` : title;
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

  function tagClass(t) {
    if (/放棄|不搭乘/.test(t)) return 'danger';
    if (/已預約|已標 OK|^OK$|已購買|已訂/.test(t)) return 'success';
    if (/需確認|確認|重要|現金|快速/.test(t)) return 'warning';
    return '';
  }

  function isTransferEvent(e) {
    const text = `${e.title || ''} ${(e.tags || []).join(' ')} ${e.detail || ''}`;
    return /轉車|換車|同月台|轉機|走到.*站|Bus Station|轉公車|轉往|快速換|找.*Bus|步行.*轉/.test(text);
  }

  function eventCard(e) {
    const classes = ['event-card'];
    if (e.important) classes.push('important');
    if (e.danger) classes.push('danger');
    if (isTransferEvent(e)) classes.push('transfer-card');
    const tags = (e.tags || []).map(t => `<span class="tag ${tagClass(t)}">${escapeHtml(t)}</span>`).join('');
    return `
      <article class="${classes.join(' ')}">
        ${isTransferEvent(e) ? '<div class="transfer-label">銜接／轉乘</div>' : ''}
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

  function routeStops(day) {
    const stops = [];
    (day.events || []).forEach(e => {
      if (!e.route) return;
      const parts = e.route.split(/\s*[→➜]\s*/).map(x => x.trim()).filter(Boolean);
      if (parts.length < 2) return;
      parts.forEach(part => {
        if (!stops.length || stops[stops.length - 1].toLowerCase() !== part.toLowerCase()) stops.push(part);
      });
    });
    return stops.filter((x, i) => i === 0 || x.toLowerCase() !== stops[i - 1].toLowerCase()).slice(0, 10);
  }

  function renderRoutePreview(day) {
    const container = document.getElementById('routePreview');
    const stops = routeStops(day);
    if (stops.length < 2) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = `
      <section class="route-preview">
        <div class="route-preview-head"><strong>今天怎麼走</strong><span>${stops.length} 個主要節點</span></div>
        <div class="route-track">
          ${stops.map((stop, i) => `<div class="route-stop"><span class="route-number">${i + 1}</span><span>${escapeHtml(stop)}</span></div>${i < stops.length - 1 ? '<span class="route-arrow">→</span>' : ''}`).join('')}
        </div>
      </section>`;
  }

  function renderDayNotes(day) {
    const container = document.getElementById('dayNotes');
    const notes = day.must || [];
    if (!notes.length) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = `
      <details class="trip-notes">
        <summary>今日提醒（${notes.length}）</summary>
        <div class="trip-notes-body">${notes.map(n => `<div class="trip-note-item"><span>!</span><div>${escapeHtml(n)}</div></div>`).join('')}</div>
      </details>`;
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

  function renderDatePicker() {
    const grid = document.getElementById('datePickerGrid');
    let key = data.startDate;
    let currentMonth = '';
    const parts = [];
    while (key <= data.endDate) {
      const d = parseDateKey(key);
      const month = `${d.getMonth() + 1} 月`;
      if (month !== currentMonth) {
        currentMonth = month;
        parts.push(`<div class="date-month-label">${month}</div>`);
      }
      const isSelected = key === selectedDate;
      const isToday = key === localDateKey(new Date());
      parts.push(`<button type="button" class="date-choice ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" data-date="${key}"><span class="date-choice-date">${dateLabel(key)}</span><span class="date-choice-title">${escapeHtml(shortDayTitle(key))}</span></button>`);
      key = addDays(key, 1);
    }
    grid.innerHTML = parts.join('');
    grid.querySelectorAll('[data-date]').forEach(btn => btn.addEventListener('click', () => {
      selectedDate = btn.dataset.date;
      renderDay();
      document.getElementById('datePickerPanel').classList.add('hidden');
      document.getElementById('datePickerToggle').setAttribute('aria-expanded', 'false');
      document.getElementById('daysView').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
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
    renderRoutePreview(d);
    document.getElementById('dayTimeline').innerHTML = (d.events || []).length
      ? `<div class="timeline">${d.events.map(eventCard).join('')}</div>`
      : '<div class="empty-card"><strong>沒有逐時資料</strong>請看領隊通知或紙本行程。</div>';
    renderDayNotes(d);
    document.getElementById('prevDay').disabled = selectedDate <= data.startDate;
    document.getElementById('nextDay').disabled = selectedDate >= data.endDate;
    renderDatePicker();
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
        input.closest('.check-row').classList.toggle('checked', input.checked);
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
  document.getElementById('datePickerToggle').addEventListener('click', () => {
    const panel = document.getElementById('datePickerPanel');
    const open = panel.classList.toggle('hidden') === false;
    document.getElementById('datePickerToggle').setAttribute('aria-expanded', String(open));
    if (open) {
      const selected = panel.querySelector('.date-choice.selected');
      selected?.scrollIntoView({ block: 'nearest' });
    }
  });

  window.addEventListener('beforeinstallprompt', e => {
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
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  renderNow();
  renderDay();
  renderChecklist();
  setInterval(renderNow, 60000);
})();
