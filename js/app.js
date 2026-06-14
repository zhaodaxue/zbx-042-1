var App = (function () {
  var lastMinute = -1;
  var lastSecond = -1;

  function renderClock() {
    var el = document.getElementById('clock');
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    var s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = h + ':' + m + ':' + s;
  }

  function renderTimeline() {
    var container = document.getElementById('timeline');
    container.innerHTML = '';
    var allSlots = TimeSlot.getAllUniqueSlots();
    var activeKey = ListFilter.getActiveSlotKey();

    for (var i = 0; i < allSlots.length; i++) {
      var slot = allSlots[i];
      var key = TimeSlot.getSlotKey(slot);
      var isCurrent = TimeSlot.isCurrentSlot(slot);
      var isActive = activeKey === key;

      var block = document.createElement('div');
      block.className = 'tl-block';
      if (isCurrent) block.className += ' tl-current';
      if (isActive) block.className += ' tl-active';

      var label = document.createElement('span');
      label.className = 'tl-label';
      label.textContent = slot.start + '–' + slot.end;
      block.appendChild(label);

      if (isCurrent) {
        var dot = document.createElement('span');
        dot.className = 'tl-dot';
        block.appendChild(dot);
      }

      (function (k) {
        block.onclick = function () {
          ListFilter.setActiveSlot(k);
          renderTimeline();
          renderTable();
        };
      })(key);

      container.appendChild(block);
    }
  }

  function renderViewSwitch() {
    var container = document.getElementById('view-switch');
    container.innerHTML = '';
    var currentMode = ListFilter.getViewMode();

    var btnCar = document.createElement('button');
    btnCar.className = 'vs-btn' + (currentMode === 'car' ? ' vs-active' : '');
    btnCar.setAttribute('data-mode', 'car');
    btnCar.textContent = '按展车';
    btnCar.onclick = function () {
      ListFilter.setViewMode('car');
      renderViewSwitch();
      renderTable();
    };
    container.appendChild(btnCar);

    var btnPresenter = document.createElement('button');
    btnPresenter.className = 'vs-btn' + (currentMode === 'presenter' ? ' vs-active' : '');
    btnPresenter.setAttribute('data-mode', 'presenter');
    btnPresenter.textContent = '按讲解员';
    btnPresenter.onclick = function () {
      ListFilter.setViewMode('presenter');
      renderViewSwitch();
      renderTable();
    };
    container.appendChild(btnPresenter);
  }

  function buildModelCell(r) {
    var td = document.createElement('td');
    var modelLink = document.createElement('a');
    modelLink.className = 'model-link';
    modelLink.href = 'javascript:void(0)';
    modelLink.textContent = r.model;
    (function (cid, cname) {
      modelLink.onclick = function () {
        SellingPoint.show(cid, cname);
      };
    })(r.carId, r.model);
    td.appendChild(modelLink);
    return td;
  }

  function buildStatusCell(r) {
    var td = document.createElement('td');
    td.className = 'status-cell';
    if (r.isConflict) {
      var badge1 = document.createElement('span');
      badge1.className = 'badge-conflict';
      badge1.textContent = '冲突';
      td.appendChild(badge1);
    }
    if (r.isCurrent) {
      var badge2 = document.createElement('span');
      badge2.className = 'badge-current';
      badge2.textContent = '讲解中';
      td.appendChild(badge2);
    } else if (r.isUpcoming && r.minutesUntil >= 0) {
      var badge3 = document.createElement('span');
      badge3.className = 'badge-upcoming';
      badge3.textContent = (r.minutesUntil === 0 ? '即将' : r.minutesUntil + '分钟后');
      td.appendChild(badge3);
    }
    if (!td.children.length) {
      td.textContent = '—';
    }
    return td;
  }

  function buildRow(r) {
    var tr = document.createElement('tr');
    var classes = [];
    if (r.isConflict) classes.push('row-conflict');
    if (r.isCurrent) classes.push('row-current');
    if (classes.length) tr.className = classes.join(' ');

    tr.appendChild(buildModelCell(r));

    var tdBooth = document.createElement('td');
    tdBooth.textContent = r.booth;
    tr.appendChild(tdBooth);

    var tdTime = document.createElement('td');
    tdTime.textContent = r.start + '–' + r.end;
    tr.appendChild(tdTime);

    var tdPresenter = document.createElement('td');
    tdPresenter.textContent = r.presenter;
    tr.appendChild(tdPresenter);

    tr.appendChild(buildStatusCell(r));
    return tr;
  }

  function buildGroupRow(g) {
    var tr = document.createElement('tr');
    tr.className = 'group-row';
    var td = document.createElement('td');
    td.colSpan = 5;

    var header = document.createElement('div');
    header.className = 'group-header';
    if (g.hasConflict) header.className += ' conflict';
    var hasCurrent = g.rows.some(function (x) { return x.isCurrent; });
    if (hasCurrent) header.className += ' current';

    var left = document.createElement('div');
    left.className = 'group-left';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'group-name';
    nameSpan.textContent = g.presenter;
    left.appendChild(nameSpan);

    var countSpan = document.createElement('span');
    countSpan.className = 'group-count';
    if (g.hasConflict) countSpan.className += ' conflict-badge';
    countSpan.textContent = g.hasConflict
      ? '共 ' + g.totalCount + ' 场 · 含冲突'
      : '共 ' + g.totalCount + ' 场';
    left.appendChild(countSpan);

    var right = document.createElement('div');
    right.className = 'group-right';

    if (g.upcomingMinutes !== null && g.upcomingMinutes >= 0 && !hasCurrent) {
      var up = document.createElement('span');
      up.className = 'upcoming-hint';
      up.textContent = (g.upcomingMinutes === 0 ? '即刻开讲' : g.upcomingMinutes + ' 分钟后开讲');
      right.appendChild(up);
    }
    if (hasCurrent) {
      var cur = document.createElement('span');
      cur.className = 'group-current-tag';
      cur.textContent = '正在讲解';
      right.appendChild(cur);
    }

    header.appendChild(left);
    header.appendChild(right);
    td.appendChild(header);
    tr.appendChild(td);
    return tr;
  }

  function renderCarView(tbody) {
    var rows = ListFilter.buildRows();
    for (var i = 0; i < rows.length; i++) {
      tbody.appendChild(buildRow(rows[i]));
    }
    return rows.length;
  }

  function renderPresenterView(tbody) {
    var groups = ListFilter.buildPresenterGroups();
    var totalRows = 0;
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      tbody.appendChild(buildGroupRow(g));
      for (var j = 0; j < g.rows.length; j++) {
        tbody.appendChild(buildRow(g.rows[j]));
        totalRows++;
      }
    }
    return totalRows;
  }

  function renderTable() {
    var tbody = document.getElementById('car-tbody');
    tbody.innerHTML = '';
    var mode = ListFilter.getViewMode();
    var count = 0;
    if (mode === 'presenter') {
      count = renderPresenterView(tbody);
    } else {
      count = renderCarView(tbody);
    }
    var empty = document.getElementById('empty-hint');
    empty.style.display = count === 0 ? 'block' : 'none';
  }

  function tickClock() {
    renderClock();
  }

  function tickSlot() {
    var now = new Date();
    var minute = now.getHours() * 60 + now.getMinutes();
    if (minute !== lastMinute) {
      lastMinute = minute;
      renderTimeline();
      renderTable();
    }
  }

  function tickUpcoming() {
    var now = new Date();
    var second = now.getSeconds();
    if (second === lastSecond) return;
    lastSecond = second;
    if (second === 0) {
      renderTable();
    }
  }

  function init() {
    renderClock();
    renderTimeline();
    renderViewSwitch();
    renderTable();
    lastMinute = new Date().getHours() * 60 + new Date().getMinutes();
    setInterval(tickClock, 1000);
    setInterval(tickSlot, 1000);
    setInterval(tickUpcoming, 1000);
  }

  return { init: init };
})();

document.addEventListener('DOMContentLoaded', function () {
  App.init();
});
