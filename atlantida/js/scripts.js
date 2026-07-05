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
  const key = `form-${form.name}`;

  // Restaurar datos
  const saved = sessionStorage.getItem(key);
  if (saved) {
    const data = JSON.parse(saved);

    Object.entries(data).forEach(([name, value]) => {
      const field = form.elements[name];
      if (field && field.type !== "hidden") {
        field.value = value;
      }
    });
  }

  // Guardar datos mientras el usuario escribe
  form.addEventListener("input", () => {
    const data = {};

    Array.from(form.elements).forEach(field => {
      if (
        field.name &&
        field.type !== "hidden" &&
        field.type !== "submit" &&
        field.type !== "button"
      ) {
        data[field.name] = field.value;
      }
    });

    sessionStorage.setItem(key, JSON.stringify(data));
  });

  // Si el formulario se envía correctamente, limpiar los datos guardados
  form.addEventListener("submit", () => {
    sessionStorage.removeItem(key);
  });


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

  showMessage(msg, 'Solicitud validada correctamente. Enviando información...', 'ok');
});

});
});
