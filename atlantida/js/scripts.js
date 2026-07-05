document.addEventListener('DOMContentLoaded', () => {

/* =========================
   MENÚ HAMBURGUESA
========================= */
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');
const topBtn = document.querySelector('.top-btn');
const mobileQuery = window.matchMedia('(max-width: 820px)');

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
    menu.hidden = mobileQuery.matches;
    if (returnFocus) hamburger.focus();
  };

  const syncMenuState = () => {
    if (mobileQuery.matches) {
      menu.hidden = hamburger.getAttribute('aria-expanded') !== 'true';
    } else {
      menu.hidden = false;
      menu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  };

  syncMenuState();

  mobileQuery.addEventListener?.('change', syncMenuState);

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu(true);
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileQuery.matches) closeMenu();
    });
  });
}

/* =========================
   BOTÓN ARRIBA
========================= */
if (topBtn) {
  const toggleTop = () =>
    topBtn.classList.toggle('show', window.scrollY > 350);

  toggleTop();
  window.addEventListener('scroll', toggleTop);

  topBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* =========================
   BUSCADOR
========================= */
const searchInput = document.querySelector('#buscador');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();

    document.querySelectorAll('.document-card').forEach(card => {
      card.style.display =
        card.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });
}

/* =========================
   MENSAJES
========================= */
const showMessage = (el, text, type) => {
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
};

const clearMessage = (el) => {
  if (!el) return;
  el.textContent = '';
  el.className = 'message';
};

const isValidEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/* =========================
   AUTOGUARDADO FORMULARIOS
========================= */
document.addEventListener("input", (e) => {
  const form = e.target.closest("form[data-form]");
  if (!form) return;

  const key = "form-" + form.name;

  const data = {};

  form.querySelectorAll("input, textarea, select").forEach(el => {
    if (
      el.name &&
      !["hidden", "submit", "button"].includes(el.type)
    ) {
      data[el.name] = el.value;
    }
  });

  sessionStorage.setItem(key, JSON.stringify(data));
});

/* =========================
   RESTAURAR FORMULARIOS
========================= */
function restoreForms() {
  document.querySelectorAll("form[data-form]").forEach(form => {
    const key = "form-" + form.name;
    const saved = sessionStorage.getItem(key);

    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      Object.entries(data).forEach(([name, value]) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) field.value = value;
      });

    } catch (e) {
      console.warn("Error restaurando form", e);
    }
  });
}

window.addEventListener("pageshow", restoreForms);

/* =========================
   FORMULARIOS NETLIFY
========================= */
document.querySelectorAll('form[data-form]').forEach(form => {

  const msg = form.querySelector('.message');
  const clearBtn = form.querySelector('[data-clear]');

  /* limpiar manual */
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('¿Deseas limpiar el formulario?')) {
        form.reset();
        clearMessage(msg);
        sessionStorage.removeItem("form-" + form.name);
      }
    });
  }

  /* validación */
  form.addEventListener('submit', (event) => {
    const name = form.querySelector('[name="nombre"]');
    const email = form.querySelector('[name="correo"]');
    const text = form.querySelector('textarea');
    const service = form.querySelector('[name="servicio"]');

    const isQuotation = form.dataset.form === 'cotizacion';
    const minLen = isQuotation ? 40 : 30;

    const ok =
      name?.value.trim() &&
      email?.value.trim() &&
      isValidEmail(email.value) &&
      text?.value.trim() &&
      text.value.trim().length >= minLen &&
      service?.value;

    if (!ok) {
      event.preventDefault();

      showMessage(
        msg,
        `Revisa los campos. El correo debe ser válido y el mensaje tener mínimo ${minLen} caracteres.`,
        'error'
      );

      return;
    }

    showMessage(msg, 'Enviando...', 'ok');
  });

  /* limpiar SOLO si envía OK */
  form.addEventListener('submit', () => {
    sessionStorage.removeItem("form-" + form.name);
  });

});

});