const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
if (menuButton && navigation) {
  function setMenu(open) {
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }
  menuButton.addEventListener('click', () => setMenu(!navigation.classList.contains('open')));
  navigation.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      setMenu(false);
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
}
