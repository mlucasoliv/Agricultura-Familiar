document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('navbarAgroFamilia');
  const toggler = document.querySelector('.navbar-toggler');

  function fecharNavbarMobile() {
    if (!menu || !toggler || !window.bootstrap) return;

    if (window.getComputedStyle(toggler).display !== 'none') {
      window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    }
  }

  if (menu && toggler && window.bootstrap) {
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', fecharNavbarMobile);
    });

    menu.addEventListener('shown.bs.collapse', () => {
      document.body.classList.add('menu-open');
    });

    menu.addEventListener('hidden.bs.collapse', () => {
      document.body.classList.remove('menu-open');
    });
  }
});
