(function () {
  const buttons = document.querySelectorAll('[data-lang]');
  const translatable = document.querySelectorAll('[data-en][data-id]');

  function setLanguage(language) {
    const lang = language === 'id' ? 'id' : 'en';
    document.documentElement.lang = lang;
    translatable.forEach((element) => {
      element.textContent = element.dataset[lang];
    });
    buttons.forEach((button) => {
      button.classList.toggle('active', button.dataset.lang === lang);
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    });
    try { localStorage.setItem('faritno-language', lang); } catch (_) {}
  }

  buttons.forEach((button) => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  document.getElementById('year').textContent = String(new Date().getFullYear());

  let initial = 'en';
  try { initial = localStorage.getItem('faritno-language') || 'en'; } catch (_) {}
  setLanguage(initial);
})();
