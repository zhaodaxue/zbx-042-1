var SellingPoint = (function () {
  function show(carId, modelName) {
    var points = SELLING_POINTS[carId];
    if (!points) return;

    var overlay = document.createElement('div');
    overlay.className = 'sp-overlay';

    var modal = document.createElement('div');
    modal.className = 'sp-modal';

    var title = document.createElement('div');
    title.className = 'sp-title';
    title.textContent = modelName + ' · 核心卖点';
    modal.appendChild(title);

    var list = document.createElement('ul');
    list.className = 'sp-list';
    for (var i = 0; i < points.length; i++) {
      var li = document.createElement('li');
      li.textContent = points[i];
      list.appendChild(li);
    }
    modal.appendChild(list);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'sp-close';
    closeBtn.textContent = '关闭';
    closeBtn.onclick = function () {
      document.body.removeChild(overlay);
    };
    modal.appendChild(closeBtn);

    overlay.appendChild(modal);
    overlay.onclick = function (e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    };
    document.body.appendChild(overlay);
  }

  return {
    show: show
  };
})();
