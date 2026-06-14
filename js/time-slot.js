var TimeSlot = (function () {
  function timeToMinutes(str) {
    var parts = str.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function getCurrentSlot(slots) {
    var now = new Date();
    var current = now.getHours() * 60 + now.getMinutes();
    for (var i = 0; i < slots.length; i++) {
      var s = timeToMinutes(slots[i].start);
      var e = timeToMinutes(slots[i].end);
      if (current >= s && current < e) {
        return slots[i];
      }
    }
    return null;
  }

  function getAllUniqueSlots() {
    var seen = {};
    var result = [];
    for (var i = 0; i < CAR_DATA.length; i++) {
      var slots = CAR_DATA[i].slots;
      for (var j = 0; j < slots.length; j++) {
        var key = slots[j].start + '-' + slots[j].end;
        if (!seen[key]) {
          seen[key] = true;
          result.push(slots[j]);
        }
      }
    }
    result.sort(function (a, b) {
      return timeToMinutes(a.start) - timeToMinutes(b.start);
    });
    return result;
  }

  function isCurrentSlot(slot) {
    var now = new Date();
    var current = now.getHours() * 60 + now.getMinutes();
    var s = timeToMinutes(slot.start);
    var e = timeToMinutes(slot.end);
    return current >= s && current < e;
  }

  function getSlotKey(slot) {
    return slot.start + '-' + slot.end;
  }

  function minutesUntilStart(slot) {
    var now = new Date();
    var current = now.getHours() * 60 + now.getMinutes();
    var s = timeToMinutes(slot.start);
    return s - current;
  }

  function slotsOverlap(a, b) {
    var aStart = timeToMinutes(a.start);
    var aEnd = timeToMinutes(a.end);
    var bStart = timeToMinutes(b.start);
    var bEnd = timeToMinutes(b.end);
    return aStart < bEnd && bStart < aEnd;
  }

  function isUpcoming(slot, windowMinutes) {
    var diff = minutesUntilStart(slot);
    return diff >= 0 && diff <= windowMinutes;
  }

  function findConflicts(allRows) {
    var byPresenter = {};
    for (var i = 0; i < allRows.length; i++) {
      var row = allRows[i];
      if (!byPresenter[row.presenter]) {
        byPresenter[row.presenter] = [];
      }
      byPresenter[row.presenter].push(row);
    }
    var conflictSet = {};
    for (var p in byPresenter) {
      if (!byPresenter.hasOwnProperty(p)) continue;
      var list = byPresenter[p];
      list.sort(function (a, b) {
        return timeToMinutes(a.start) - timeToMinutes(b.start);
      });
      for (var j = 0; j < list.length; j++) {
        for (var k = j + 1; k < list.length; k++) {
          var a = list[j];
          var b = list[k];
          var aEnd = timeToMinutes(a.end);
          var bStart = timeToMinutes(b.start);
          if (bStart < aEnd) {
            conflictSet[a.rowKey] = true;
            conflictSet[b.rowKey] = true;
          }
        }
      }
    }
    return conflictSet;
  }

  return {
    timeToMinutes: timeToMinutes,
    getCurrentSlot: getCurrentSlot,
    getAllUniqueSlots: getAllUniqueSlots,
    isCurrentSlot: isCurrentSlot,
    getSlotKey: getSlotKey,
    minutesUntilStart: minutesUntilStart,
    slotsOverlap: slotsOverlap,
    isUpcoming: isUpcoming,
    findConflicts: findConflicts
  };
})();
