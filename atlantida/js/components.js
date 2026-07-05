// Espera a que el documento cargue antes de insertar componentes reutilizables.
document.addEventListener('DOMContentLoaded', function () {
const headerMount = document.querySelector('#site-header');
const footerMount = document.querySelector('#site-footer');
const active = headerMount ? headerMount.dataset.active : '';

// Detecta las rutas según la ubicación de la página actual.
const path = window.location.pathname;
const isInsideAtlantida = path.includes('/atlantida/');
const basePath = isInsideAtlantida ? '' : 'atlantida/';
const homePath = isInsideAtlantida ? '../index.html' : 'index.html';
const pagePath = function (page) { return basePath + page; };
const assetPath = function (asset) { return basePath + asset; };

const menuGroups = [
{ key: 'servicios', text: 'Servicios', children: [
{ key: 'impresiones', text: 'Impresiones', href: pagePath('impresiones.html') },
{ key: 'fotocopias', text: 'Fotocopias', href: pagePath('fotocopias.html') },
{ key: 'digitalizacion', text: 'Digitalización', href: pagePath('digitalizacion.html') }
] },
// { key: 'papeo', text: 'Papeo', href: pagePath('papeo.html') },
// { key: 'libros', text: 'Libros', href: pagePath('libros.html'), children: [
// { key: 'cienciaslib', text: 'Ciencias', href: pagePath('cienciaslib.html') },
// { key: 'historialib', text: 'Historia', href: pagePath('historialib.html') },
// { key: 'literaturalib', text: 'Literatura', href: pagePath('literaturalib.html') }
// ] },
// { key: 'resumenes', text: 'Resúmenes', href: pagePath('resumenes.html'), children: [
// { key: 'cienciasres', text: 'Ciencias', href: pagePath('cienciasres.html') },
// { key: 'historiares', text: 'Historia', href: pagePath('historiares.html') },
// { key: 'literaturares', text: 'Literatura', href: pagePath('literaturares.html') }
// ] },
{ key: 'cotizaciones', text: 'Cotizaciones', href: pagePath('cotizaciones.html') },
{ key: 'contactanos', text: 'Contáctanos', href: pagePath('contactanos.html') }
];

function createElement(tag, options) {
options = options || {};
const element = document.createElement(tag);
if (options.className) element.className = options.className;
if (options.text) element.textContent = options.text;
if (options.attributes) {
Object.entries(options.attributes).forEach(function ([name, value]) {
element.setAttribute(name, value);
});
}
return element;
}

function buildMenuItem(item) {
const li = document.createElement('li');
const link = createElement('a', { text: item.text, attributes: { href: item.href || '#' } });
const isActive = item.key === active || (item.children || []).some(function (child) { return child.key === active; });
if (isActive) {
link.classList.add('active');
link.setAttribute('aria-current', 'page');
}
li.appendChild(link);
if (item.children) {
li.classList.add('has-submenu');
const submenu = createElement('ul', { className: 'submenu' });
item.children.forEach(function (child) {
submenu.appendChild(buildMenuItem(child));
});
li.appendChild(submenu);
}
return li;
}

if (headerMount) {
headerMount.replaceChildren();
const header = createElement('header', { className: 'header' });
const nav = createElement('nav', { className: 'container nav', attributes: { 'aria-label': 'Navegación principal' } });
const brand = createElement('a', { className: 'brand', attributes: { href: homePath } });
const logoImg = createElement('img', { className: 'brand-img', attributes: { src: assetPath('images/logo.png'), alt: 'Logo de Atlántida', loading: 'lazy' } });
const logoFallback = createElement('span', { className: 'logo', text: 'A' });
const hamburger = createElement('button', { className: 'hamburger', text: '☰', attributes: { type: 'button', 'aria-label': 'Abrir menú', 'aria-expanded': 'false', 'aria-controls': 'main-menu' } });
const menu = createElement('ul', { className: 'menu', attributes: { id: 'main-menu' } });
logoFallback.style.display = 'none';
logoImg.addEventListener('error', function () {
logoImg.style.display = 'none';
logoFallback.style.display = 'grid';
}, { once: true });
menuGroups.forEach(function (item) {
menu.appendChild(buildMenuItem(item));
});

const brandBox = createElement('div', { className: 'brand-box' });
const menuBox = createElement('div', { className: 'menu-box' });

brand.append(logoImg, logoFallback);
brandBox.appendChild(brand);
menuBox.appendChild(menu);

nav.append(brandBox, menuBox, hamburger);

header.appendChild(nav);
headerMount.appendChild(header);
}

if (footerMount) {
footerMount.replaceChildren();
const footer = createElement('footer', { className: 'footer' });
const grid = createElement('div', { className: 'container grid' });
['Atlántida', 'Contacto', 'Enlaces rápidos'].forEach(function (title, index) {
const column = document.createElement('div');
const text = index === 0 ? 'Impresiones, fotocopias, digitalización y material académico digital.' : index === 1 ? 'fotocopia.atlantida@gmail.com' : 'Inicio · Servicios · Papeo · Libros · Resúmenes · Cotizaciones · Contacto';
column.append(createElement('h3', { text: title }), createElement('p', { text: text }));
grid.appendChild(column);
});
footer.appendChild(grid);
footerMount.appendChild(footer);
}
});
