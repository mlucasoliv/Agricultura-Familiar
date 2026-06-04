document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('navbarAgroFamilia');
  const toggler = document.querySelector('.navbar-toggler');
  const btnSidebarToggle = document.getElementById('btn-sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  function fecharNavbarMobile() {
    if (!menu || !toggler || !window.bootstrap) return;

    if (window.getComputedStyle(toggler).display !== 'none') {
      window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    }
  }

  function abrirSidebar() {
    if (!sidebar || !overlay) return;

    sidebar.classList.add('aberta');
    overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
    if (btnSidebarToggle) btnSidebarToggle.setAttribute('aria-expanded', 'true');
  }

  function fecharSidebar() {
    if (!sidebar || !overlay) return;

    sidebar.classList.remove('aberta');
    overlay.classList.remove('ativo');
    document.body.style.overflow = '';
    if (btnSidebarToggle) btnSidebarToggle.setAttribute('aria-expanded', 'false');
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

  if (btnSidebarToggle && sidebar && overlay) {
    btnSidebarToggle.addEventListener('click', () => {
      sidebar.classList.contains('aberta') ? fecharSidebar() : abrirSidebar();
    });

    overlay.addEventListener('click', fecharSidebar);

    document.querySelectorAll('.sidebar-link').forEach((link) => {
      link.addEventListener('click', fecharSidebar);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) fecharSidebar();
    });
  }
});
