// Keep the existing menu behavior and expose its current state to assistive technology.
const homeMenu = document.querySelector('.play-home .menu-toggle');
const homeNav = document.querySelector('.play-home .nav');
if (homeMenu && homeNav) {
  const syncMenu = () => {
    const open = homeNav.classList.contains('open');
    homeMenu.setAttribute('aria-expanded', String(open));
    homeMenu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  homeMenu.addEventListener('click', syncMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && homeNav.classList.contains('open')) {
      homeNav.classList.remove('open');
      syncMenu();
      homeMenu.focus();
    }
  });
}
