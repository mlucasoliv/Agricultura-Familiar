document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('navbarAgroFamilia');
  const toggler = document.querySelector('.navbar-toggler');

  if (!menu || !toggler || !window.bootstrap) {
    return;
  }

  const collapse = window.bootstrap.Collapse.getOrCreateInstance(menu, {
    toggle: false,
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.getComputedStyle(toggler).display !== 'none') {
        collapse.hide();
      }
    });
  });

  menu.addEventListener('shown.bs.collapse', () => {
    document.body.classList.add('menu-open');
  });

  menu.addEventListener('hidden.bs.collapse', () => {
    document.body.classList.remove('menu-open');
  });
});
