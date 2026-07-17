// Ejecuta el código cuando todo el HTML ya está cargado.
document.addEventListener('DOMContentLoaded', () => {
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const topBtn = document.querySelector('.top-btn');
const mobileQuery = window.matchMedia('(max-width: 820px)');

// Menú responsive accesible: visible en escritorio, ocultable en móvil, con foco y Escape.
if (hamburger && menu) {
const menuLinks = menu.querySelectorAll('a');
const firstMenuLink = menu.querySelector('a');

const openMenu = () => {
menu.hidden = false;
menu.classList.add('open');
hamburger.setAttribute('aria-expanded', 'true');
hamburger.setAttribute('aria-label', 'Cerrar menú');
if (firstMenuLink) firstMenuLink.focus();
};

const closeMenu = (returnFocus = false) => {
menu.classList.remove('open');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.setAttribute('aria-label', 'Abrir menú');
if (mobileQuery.matches) menu.hidden = true;
else menu.hidden = false;
if (returnFocus) hamburger.focus();
};

const syncMenuState = () => {
if (mobileQuery.matches) {
menu.hidden = hamburger.getAttribute('aria-expanded') !== 'true';
} else {
menu.hidden = false;
menu.classList.remove('open');
hamburger.setAttribute('aria-expanded', 'false');
hamburger.setAttribute('aria-label', 'Abrir menú');
}
};

syncMenuState();

if (typeof mobileQuery.addEventListener === 'function') {
mobileQuery.addEventListener('change', syncMenuState);
} else if (typeof mobileQuery.addListener === 'function') {
mobileQuery.addListener(syncMenuState);
}

hamburger.addEventListener('click', () => {
const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
if (isOpen) closeMenu();
else openMenu();
});

document.addEventListener('keydown', event => {
if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') closeMenu(true);
});

menuLinks.forEach(link => {
link.addEventListener('click', () => {
if (mobileQuery.matches) closeMenu();
});
});
}

if (topBtn) {
const toggleTopButton = () => topBtn.classList.toggle('show', window.scrollY > 350);
toggleTopButton();
window.addEventListener('scroll', toggleTopButton);
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const searchInput = document.querySelector('#buscador');
if (searchInput) {
searchInput.addEventListener('input', () => {
const term = searchInput.value.trim().toLowerCase();
document.querySelectorAll('.document-card').forEach(card => {
const cardText = card.textContent.toLowerCase();
card.style.display = cardText.includes(term) ? '' : 'none';
});
});
}

const showMessage = (element, text, type) => {
if (!element) return;
element.textContent = text;
element.className = `message ${type}`;
};

const clearMessage = element => {
if (!element) return;
element.textContent = '';
element.className = 'message';
};

const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

document.querySelectorAll('form[data-form]').forEach(form => {
const msg = form.querySelector('.message');
const clear = form.querySelector('[data-clear]');

if (clear) {
clear.addEventListener('click', () => {
if (confirm('¿Deseas limpiar el formulario?')) {
form.reset();
clearMessage(msg);
}
});
}

form.addEventListener('submit', event => {
  const name = form.querySelector('[name="nombre"]');
  const email = form.querySelector('[name="correo"]');
  const text = form.querySelector('textarea');
  const service = form.querySelector('[name="servicio"]');
  const isQuotationForm = form.dataset.form === 'cotizacion';
  const minTextLength = isQuotationForm ? 40 : 30;

  const nameValue = name ? name.value.trim() : '';
  const emailValue = email ? email.value.trim() : '';
  const textValue = text ? text.value.trim() : '';
  const serviceValue = service ? service.value.trim() : 'ok';

  if (!nameValue || !emailValue || !isValidEmail(emailValue) || !textValue || textValue.length < minTextLength || !serviceValue) {
    event.preventDefault();

    const textLabel = isQuotationForm
      ? 'la descripción debe tener al menos 40 caracteres'
      : 'el mensaje debe tener al menos 30 caracteres';

    showMessage(msg, `Revisa los campos obligatorios. El correo debe ser válido y ${textLabel}.`, 'error');
    return;
  }

  showMessage(msg, 'Enviando información...', 'ok');
});

});
const esImpresionOFotocopia = tipo => tipo === 'fotocopiabn' || tipo === 'impresionbn';
const calcularCotizacionBase = (tipo, paginas) => {
  if (tipo === 'fotocopiabn') {
    if (paginas >= 2 && paginas <= 49) return paginas * 50;
    if (paginas >= 50 && paginas <= 199) return paginas * 45;
    if (paginas >= 200) return paginas * 40;
  }
  if (tipo === 'impresionbn') {
    if (paginas >= 2 && paginas <= 199) return paginas * 45;
    if (paginas >= 200 && paginas <= 499) return paginas * 40;
    if (paginas >= 500) return paginas * 35;
  }
  if (tipo === 'digitalizacionnor') {
    if (paginas >= 1 && paginas <= 99) return paginas * 100;
    if (paginas >= 100) return paginas * 70;
  }
  if (tipo === 'digitalizacionesp') {
    if (paginas >= 1 && paginas <= 99) return paginas * 120;
    if (paginas >= 100) return paginas * 100;
  }
  return null;
};
const calcularAnillado = (paginas, ladoHoja) => {
  if (ladoHoja === 'unlado') {
    if (paginas >= 1 && paginas <= 70) return 1200;
    if (paginas >= 71 && paginas <= 150) return 1600;
    if (paginas >= 151 && paginas <= 300) return 2000;
    if (paginas >= 301 && paginas <= 450) return 2600;
    if (paginas >= 451) return 'Requiere mas de un anillado';
  }
  if (ladoHoja === 'amboslados') {
    if (paginas >= 2 && paginas <= 140) return 1200;
    if (paginas >= 141 && paginas <= 300) return 1600;
    if (paginas >= 301 && paginas <= 600) return 2000;
    if (paginas >= 601 && paginas <= 900) return 2600;
    if (paginas >= 901) return 'Requiere mas de un anillado';
  }
  return null;
};
const actualizarOpcionesExtra = () => {
  const tipo = document.querySelector('#tipo-servicio');
  const labelLado = document.querySelector('#label-lado-hoja');
  const labelAnillado = document.querySelector('#label-anillado');
  const mostrar = tipo && esImpresionOFotocopia(tipo.value);
  if (labelLado) labelLado.hidden = !mostrar;
  if (labelAnillado) labelAnillado.hidden = !mostrar;
  if (!mostrar) {
    const anillado = document.querySelector('#tipo-anillado');
    if (anillado) anillado.value = 'sin';
  }
};

const calcularBtn = document.querySelector('#calcular-cotizacion');
  const tipoServicio = document.querySelector('#tipo-servicio');
  actualizarOpcionesExtra();
  if (tipoServicio) tipoServicio.addEventListener('change', actualizarOpcionesExtra);

    const cantidadPaginas = document.querySelector('#cantidad-paginas');
  if (cantidadPaginas) {
    cantidadPaginas.addEventListener('input', () => {
      cantidadPaginas.value = cantidadPaginas.value.replace(/\D/g, '');
    });
  }
  if (cantidadPaginas) cantidadPaginas.addEventListener('keydown', event => {
    if (['e', 'E', '+', '-', '.', ','].includes(event.key)) event.preventDefault();
  });


if (calcularBtn) {
  calcularBtn.addEventListener('click', () => {
    const tipo = document.querySelector('#tipo-servicio');
    const paginasInput = document.querySelector('#cantidad-paginas');
    const ladoHoja = document.querySelector('#lado-hoja');
    const tipoAnillado = document.querySelector('#tipo-anillado');
    const resultado = document.querySelector('#resultado-cotizacion');
    const paginas = paginasInput.value.trim() === '' ? NaN : Number(paginasInput.value);
    if (!tipo.value || !Number.isInteger(paginas) || paginas < 1 || String(paginas) !== paginasInput.value.trim()) {
      showMessage(resultado, 'Selecciona un servicio e ingresa un número entero de páginas.', 'error');
      return;
    }

       let total = esImpresionOFotocopia(tipo.value) && ladoHoja.value === 'unlado' ? paginas * 50 : calcularCotizacionBase(tipo.value, paginas);
    
    if (total === null) {
      showMessage(resultado, 'La cantidad ingresada no tiene tarifa disponible para este servicio.', 'error');
      return;
    }
       if (esImpresionOFotocopia(tipo.value) && tipoAnillado.value === 'con') {
      const valorAnillado = calcularAnillado(paginas, ladoHoja.value);
      if (typeof valorAnillado === 'string') {
        showMessage(resultado, valorAnillado, 'error');
        return;
      }
      total += valorAnillado;
    }

    if (total === null) {
      showMessage(resultado, 'La cantidad ingresada no tiene tarifa disponible para este servicio.', 'error');
      return;
    }
    showMessage(resultado, `Total estimado: $${total.toLocaleString('es-CL')}`, 'ok');
  });
}

});
