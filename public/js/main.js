document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('navbarAgroFamilia');
  const toggler = document.querySelector('.navbar-toggler');
  const imagemArquivo = document.getElementById('produto-imagem-arquivo');
  const imagemUrl = document.getElementById('produto-imagem-url');
  const imagemPreview = document.getElementById('produto-imagem-preview');
  let previewObjectUrl = null;

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

  function renderizarPreview(src, texto = 'Preview da imagem') {
    if (!imagemPreview) return;

    const imagem = document.createElement('img');
    imagem.src = src || imagemPreview.dataset.defaultSrc || '/img/produto-default.svg';
    imagem.alt = texto;

    imagemPreview.classList.toggle('is-empty', !src);
    imagemPreview.replaceChildren(imagem);

    if (!src) {
      const dica = document.createElement('small');
      dica.textContent = 'Preview da imagem';
      imagemPreview.appendChild(dica);
    }

    imagem.addEventListener('error', () => {
      const fallback = document.createElement('img');
      fallback.src = imagemPreview.dataset.defaultSrc || '/img/produto-default.svg';
      fallback.alt = 'Imagem padrao do produto';

      const aviso = document.createElement('small');
      aviso.textContent = 'Nao foi possivel carregar a imagem';

      imagemPreview.classList.add('is-empty');
      imagemPreview.replaceChildren(fallback, aviso);
    }, { once: true });
  }

  if (imagemPreview && (imagemArquivo || imagemUrl)) {
    if (imagemArquivo) {
      imagemArquivo.addEventListener('change', () => {
        if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);

        const arquivo = imagemArquivo.files && imagemArquivo.files[0];
        if (!arquivo) {
          renderizarPreview(imagemUrl && imagemUrl.value.trim(), 'Preview da imagem informada');
          return;
        }

        previewObjectUrl = URL.createObjectURL(arquivo);
        renderizarPreview(previewObjectUrl, `Preview de ${arquivo.name}`);
      });
    }

    if (imagemUrl) {
      imagemUrl.addEventListener('input', () => {
        if (imagemArquivo && imagemArquivo.files && imagemArquivo.files.length > 0) return;
        renderizarPreview(imagemUrl.value.trim(), 'Preview da imagem informada');
      });
    }
  }
});
