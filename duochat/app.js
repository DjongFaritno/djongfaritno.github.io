(() => {
  const preview = document.getElementById('preview');
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  let theme = 'light';
  function renderTheme() {
    preview.dataset.theme = theme === 'auto' ? (colorScheme.matches ? 'dark' : 'light') : theme;
    themeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)));
  }
  themeButtons.forEach(button => button.addEventListener('click', () => {
    theme = button.dataset.themeChoice;
    renderTheme();
  }));
  colorScheme.addEventListener('change', renderTheme);
  const tabs = Array.from(document.querySelectorAll('[data-guide]'));
  function selectGuide(name, moveFocus = false) {
    tabs.forEach(tab => {
      const selected = tab.dataset.guide === name;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById('guide-' + tab.dataset.guide).hidden = !selected;
      if (selected && moveFocus) tab.focus();
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectGuide(tab.dataset.guide));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectGuide(tabs[next].dataset.guide, true);
      }
    });
  });
  document.querySelectorAll('[data-guide-link]').forEach(link => {
    link.addEventListener('click', () => selectGuide(link.dataset.guideLink));
  });
})();
