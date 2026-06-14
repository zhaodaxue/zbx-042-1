var ListFilter = (function () {
  var activeSlotKey = null;
  var viewMode = 'car';

  function setActiveSlot(key) {
    if (activeSlotKey === key) {
      activeSlotKey = null;
    } else {
      activeSlotKey = key;
    }
    return activeSlotKey;
  }

  function getActiveSlotKey() {
    return activeSlotKey;
  }

  function clearFilter() {
    activeSlotKey = null;
  }

  function setViewMode(mode) {
    viewMode = mode === 'presenter' ? 'presenter' : 'car';
  }

  function getViewMode() {
    return viewMode;
  }

  function collectAllRows() {
    var rows = [];
    for (var i = 0; i < CAR_DATA.length; i++) {
      var car = CAR_DATA[i];
      for (var j = 0; j < car.slots.length; j++) {
        var slot = car.slots[j];
        var key = TimeSlot.getSlotKey(slot);
        if (activeSlotKey !== null && activeSlotKey !== key) {
          continue;
        }
        rows.push({
          carId: car.id,
          model: car.model,
          booth: car.booth,
          start: slot.start,
          end: slot.end,
          presenter: slot.presenter,
          isCurrent: TimeSlot.isCurrentSlot(slot),
          isUpcoming: TimeSlot.isUpcoming(slot, 10) && !TimeSlot.isCurrentSlot(slot),
          minutesUntil: TimeSlot.minutesUntilStart(slot),
          isConflict: false,
          sortKey: TimeSlot.timeToMinutes(slot.start)
        });
      }
    }
    return rows;
  }

  function detectConflicts(rows) {
    var byPresenter = {};
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!byPresenter[r.presenter]) byPresenter[r.presenter] = [];
      byPresenter[r.presenter].push(r);
    }
    for (var p in byPresenter) {
      var list = byPresenter[p];
      for (var a = 0; a < list.length; a++) {
        for (var b = a + 1; b < list.length; b++) {
          if (TimeSlot.slotsOverlap(
            { start: list[a].start, end: list[a].end },
            { start: list[b].start, end: list[b].end }
          )) {
            list[a].isConflict = true;
            list[b].isConflict = true;
          }
        }
      }
    }
    return rows;
  }

  function buildRows() {
    var rows = collectAllRows();
    rows = detectConflicts(rows);
    rows.sort(function (a, b) {
      if (a.isConflict !== b.isConflict) return a.isConflict ? -1 : 1;
      if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
      if (a.isUpcoming !== b.isUpcoming) return a.isUpcoming ? -1 : 1;
      return a.sortKey - b.sortKey;
    });
    return rows;
  }

  function buildPresenterGroups() {
    var rows = collectAllRows();
    rows = detectConflicts(rows);
    var groupsMap = {};
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!groupsMap[r.presenter]) {
        groupsMap[r.presenter] = {
          presenter: r.presenter,
          totalCount: 0,
          hasConflict: false,
          rows: [],
          upcomingMinutes: null
        };
      }
      groupsMap[r.presenter].totalCount++;
      groupsMap[r.presenter].rows.push(r);
      if (r.isConflict) groupsMap[r.presenter].hasConflict = true;
    }
    var groups = [];
    for (var p in groupsMap) {
      var g = groupsMap[p];
      g.rows.sort(function (a, b) {
        if (a.isConflict !== b.isConflict) return a.isConflict ? -1 : 1;
        if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
        if (a.isUpcoming !== b.isUpcoming) return a.isUpcoming ? -1 : 1;
        return a.sortKey - b.sortKey;
      });
      for (var i = 0; i < g.rows.length; i++) {
        if (g.rows[i].isCurrent) break;
        if (g.rows[i].isUpcoming && !g.rows[i].isCurrent) {
          g.upcomingMinutes = g.rows[i].minutesUntil;
          break;
        }
      }
      groups.push(g);
    }
    groups.sort(function (a, b) {
      var au = a.upcomingMinutes;
      var bu = b.upcomingMinutes;
      if (au !== null && bu !== null) return au - bu;
      if (au !== null) return -1;
      if (bu !== null) return 1;
      var ac = a.rows.some(function (x) { return x.isCurrent; });
      var bc = b.rows.some(function (x) { return x.isCurrent; });
      if (ac !== bc) return ac ? -1 : 1;
      if (a.hasConflict !== b.hasConflict) return a.hasConflict ? -1 : 1;
      return a.totalCount - b.totalCount;
    });
    return groups;
  }

  return {
    setActiveSlot: setActiveSlot,
    getActiveSlotKey: getActiveSlotKey,
    clearFilter: clearFilter,
    setViewMode: setViewMode,
    getViewMode: getViewMode,
    buildRows: buildRows,
    buildPresenterGroups: buildPresenterGroups
  };
})();
