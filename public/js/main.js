document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('navbarAgroFamilia');
  const toggler = document.querySelector('.navbar-toggler');
  const btnSidebarToggle = document.getElementById('btn-sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (menu && toggler && window.bootstrap) {
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
  }

  if (btnSidebarToggle && sidebar) {
    btnSidebarToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      sidebar.classList.toggle('aberta');
    });

    sidebar.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        sidebar.classList.remove('aberta');
      }
    });

    document.addEventListener('click', (event) => {
      if (!sidebar.contains(event.target) && !btnSidebarToggle.contains(event.target)) {
        sidebar.classList.remove('aberta');
      }
    });
  }
});
