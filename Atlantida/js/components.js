// Espera a que el documento cargue antes de insertar componentes reutilizables.
document.addEventListener('DOMContentLoaded', () => {
  const headerMount = document.querySelector('#site-header');
  const footerMount = document.querySelector('#site-footer');
  const active = headerMount ? headerMount.dataset.active : '';

  const menuGroups = [
    { key: 'inicio', text: 'Inicio', href: 'index.html' },
    { key: 'servicios', text: 'Servicios', children: [
      { key: 'impresiones', text: 'Impresiones', href: 'impresiones.html' },
      { key: 'fotocopias', text: 'Fotocopias', href: 'fotocopias.html' },
      { key: 'digitalizacion', text: 'Digitalización', href: 'digitalizacion.html' }
    ] },
    { key: 'papeo', text: 'Papeo', href: 'papeo.html' },
    { key: 'libros', text: 'Libros', href: 'libros.html', children: [
      { key: 'cienciaslib', text: 'Ciencias', href: 'cienciaslib.html' },
      { key: 'historialib', text: 'Historia', href: 'historialib.html' },
      { key: 'literaturalib', text: 'Literatura', href: 'literaturalib.html' }
    ] },
    { key: 'resumenes', text: 'Resúmenes', href: 'resumenes.html', children: [
      { key: 'cienciasres', text: 'Ciencias', href: 'cienciasres.html' },
      { key: 'historiares', text: 'Historia', href: 'historiares.html' },
      { key: 'literaturares', text: 'Literatura', href: 'literaturares.html' }
    ] },
    { key: 'cotizaciones', text: 'Cotizaciones', href: 'cotizaciones.html' },
    { key: 'contactanos', text: 'Contáctanos', href: 'contactanos.html' }
  ];

  const createElement = (tag, options = {}) => {
    const element = document.createElement(tag);
    if (options.className) element.className = options.className;
    if (options.text) element.textContent = options.text;
    if (options.attributes) Object.entries(options.attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  };

  const buildMenuItem = item => {
    const li = document.createElement('li');
    const link = createElement('a', { text: item.text, attributes: { href: item.href || '#' } });
    const isActive = item.key === active || (item.children || []).some(child => child.key === active);
    if (isActive) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
    li.appendChild(link);
    if (item.children) {
      li.classList.add('has-submenu');
      const submenu = createElement('ul', { className: 'submenu' });
      item.children.forEach(child => submenu.appendChild(buildMenuItem(child)));
      li.appendChild(submenu);
    }
    return li;
  };

  if (headerMount) {
    headerMount.replaceChildren();
    const header = createElement('header', { className: 'header' });
    const nav = createElement('nav', { className: 'container nav', attributes: { 'aria-label': 'Navegación principal' } });
    const brand = createElement('a', { className: 'brand', attributes: { href: 'index.html' } });
    const logoImg = createElement('img', { className: 'brand-img', attributes: { src: 'images/logo.png', alt: 'Logo de Atlántida', loading: 'lazy' } });
    const logoFallback = createElement('span', { className: 'logo', text: 'A' });
    const hamburger = createElement('button', { className: 'hamburger', text: '☰', attributes: { type: 'button', 'aria-label': 'Abrir menú', 'aria-expanded': 'false', 'aria-controls': 'main-menu' } });
    const menu = createElement('ul', { className: 'menu', attributes: { id: 'main-menu' } });
    logoFallback.style.display = 'none';
    logoImg.addEventListener('error', () => { logoImg.style.display = 'none'; logoFallback.style.display = 'grid'; }, { once: true });
    menuGroups.forEach(item => menu.appendChild(buildMenuItem(item)));
    brand.append(logoImg, logoFallback, document.createTextNode('Atlántida'));
    nav.append(brand, hamburger, menu);
    header.appendChild(nav);
    headerMount.appendChild(header);
  }

  if (footerMount) {
    footerMount.replaceChildren();
    const footer = createElement('footer', { className: 'footer' });
    const grid = createElement('div', { className: 'container grid' });
    ['Atlántida', 'Contacto', 'Enlaces rápidos'].forEach((title, index) => {
      const column = document.createElement('div');
      column.append(createElement('h3', { text: title }), createElement('p', { text: index === 0 ? 'Impresiones, fotocopias, digitalización y material académico digital.' : index === 1 ? 'fotocopia.atlantida@gmail.com' : 'Inicio · Servicios · Papeo · Libros · Resúmenes · Cotizaciones · Contacto' }));
      grid.appendChild(column);
    });
    footer.appendChild(grid);
    footerMount.appendChild(footer);
  }
});
