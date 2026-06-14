var App = (function () {
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

  function renderTable() {
    var tbody = document.getElementById('car-tbody');
    tbody.innerHTML = '';
    var rows = ListFilter.buildRows();

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var tr = document.createElement('tr');
      if (r.isCurrent) tr.className = 'row-current';

      var tdModel = document.createElement('td');
      var modelLink = document.createElement('a');
      modelLink.className = 'model-link';
      modelLink.href = 'javascript:void(0)';
      modelLink.textContent = r.model;
      (function (cid, cname) {
        modelLink.onclick = function () {
          SellingPoint.show(cid, cname);
        };
      })(r.carId, r.model);
      tdModel.appendChild(modelLink);
      tr.appendChild(tdModel);

      var tdBooth = document.createElement('td');
      tdBooth.textContent = r.booth;
      tr.appendChild(tdBooth);

      var tdTime = document.createElement('td');
      tdTime.textContent = r.start + '–' + r.end;
      tr.appendChild(tdTime);

      var tdPresenter = document.createElement('td');
      tdPresenter.textContent = r.presenter;
      tr.appendChild(tdPresenter);

      var tdStatus = document.createElement('td');
      if (r.isCurrent) {
        var badge = document.createElement('span');
        badge.className = 'badge-current';
        badge.textContent = '讲解中';
        tdStatus.appendChild(badge);
      } else {
        tdStatus.textContent = '—';
      }
      tr.appendChild(tdStatus);

      tbody.appendChild(tr);
    }

    var empty = document.getElementById('empty-hint');
    empty.style.display = rows.length === 0 ? 'block' : 'none';
  }

  function tick() {
    renderClock();
    renderTimeline();
    renderTable();
  }

  function init() {
    tick();
    setInterval(tick, 10000);
  }

  return { init: init };
})();

document.addEventListener('DOMContentLoaded', function () {
  App.init();
});
