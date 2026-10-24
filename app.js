const menuToggle = document.querySelector('.menu-toggle');
const topNav = document.querySelector('.topnav');

const whatsappMessage = 'Hola! Buen día. Quisiera solicitar asesoría para realizar el pago de mi planilla como independiente.';
const whatsappHref = `https://wa.me/573118686861?${new URLSearchParams({ text: whatsappMessage })}`;
const whatsappLinks = [
  ...document.querySelectorAll('.topnav > a[href="#independientes"], .topnav > .pay-button, .hero-buttons a, .independent-intro .purple-button, .audience-pyme .service-grid a, .audience-company .service-grid a, .contact-widget__round, .contact-widget__whatsapp, .pila-banner__whatsapp'),
  ...Array.from(document.querySelectorAll('.pila-links a')).filter((link) => {
    const label = link.querySelector('.pila-label')?.textContent.toLowerCase().replace(/[^a-z]/g, '');
    return ['pila', 'consultatupin', 'planillaasistida', 'puntosdepagoasistida'].includes(label);
  }),
];

whatsappLinks.forEach((link) => {
  link.href = whatsappHref;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

menuToggle?.addEventListener('click', () => {
  const isOpen = topNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '×' : '☰';
});

topNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    topNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuToggle) menuToggle.textContent = '☰';
  });
});

document.querySelectorAll('.image-slot[data-image]').forEach((slot) => {
  const image = slot.querySelector('img') || new Image();
  image.alt = slot.dataset.label || '';
  image.loading = slot.classList.contains('hero-image') || slot.classList.contains('pila-banner') ? 'eager' : 'lazy';
  image.onload = () => slot.classList.add('loaded');
  if (!image.getAttribute('src')) {
    image.src = `assets/images/${slot.dataset.image}`;
    slot.append(image);
  } else if (image.complete && image.naturalWidth > 0) {
    slot.classList.add('loaded');
  }
});

const heroBanner = document.querySelector('.hero-image');
if (heroBanner) {
  const bannerImage = heroBanner.querySelector('img');
  const photos = Array.from({ length: 8 }, (_, index) => `B_P${index + 1}.jpg`);
  let currentPhoto = 0;

  const showPhoto = (index) => {
    currentPhoto = (index + photos.length) % photos.length;
    const file = photos[currentPhoto];
    heroBanner.dataset.image = file;
    bannerImage.src = `assets/images/${file}`;
    bannerImage.alt = 'Banner principal Enlace Operativo';
  };

  heroBanner.querySelector('.carousel-arrow--previous').addEventListener('click', () => showPhoto(currentPhoto - 1));
  heroBanner.querySelector('.carousel-arrow--next').addEventListener('click', () => showPhoto(currentPhoto + 1));
}
