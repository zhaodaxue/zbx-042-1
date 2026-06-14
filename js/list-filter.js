var ListFilter = (function () {
  var activeSlotKey = null;

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

  function buildRows() {
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
          sortKey: TimeSlot.timeToMinutes(slot.start)
        });
      }
    }
    rows.sort(function (a, b) {
      if (a.isCurrent !== b.isCurrent) {
        return a.isCurrent ? -1 : 1;
      }
      return a.sortKey - b.sortKey;
    });
    return rows;
  }

  return {
    setActiveSlot: setActiveSlot,
    getActiveSlotKey: getActiveSlotKey,
    clearFilter: clearFilter,
    buildRows: buildRows
  };
})();
