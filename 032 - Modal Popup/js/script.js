document.addEventListener('DOMContentLoaded', function () {
  var modalMap = {
    info: document.getElementById('infoModal'),
    confirm: document.getElementById('confirmModal'),
    success: document.getElementById('successModal'),
    form: document.getElementById('formModal')
  };

  var cards = document.querySelectorAll('.card[data-modal]');
  var feedbackForm = document.getElementById('feedbackForm');

  function openModal(id) {
    var modal = modalMap[id];
    if (modal) modal.classList.add('active');
  }

  function closeModal(overlay) {
    overlay.classList.remove('active');
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card.dataset.modal);
    });
  });

  Object.keys(modalMap).forEach(function (key) {
    var overlay = modalMap[key];

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal(overlay);
    });

    var closeBtns = overlay.querySelectorAll('[data-close]');
    closeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(overlay);
      });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      Object.keys(modalMap).forEach(function (key) {
        closeModal(modalMap[key]);
      });
    }
  });

  feedbackForm.addEventListener('submit', function (e) {
    e.preventDefault();
    closeModal(modalMap.form);
    feedbackForm.reset();
    setTimeout(function () {
      openModal('success');
    }, 400);
  });
});
