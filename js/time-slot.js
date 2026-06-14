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

  return {
    timeToMinutes: timeToMinutes,
    getCurrentSlot: getCurrentSlot,
    getAllUniqueSlots: getAllUniqueSlots,
    isCurrentSlot: isCurrentSlot,
    getSlotKey: getSlotKey
  };
})();
