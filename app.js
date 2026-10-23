const menuToggle = document.querySelector('.menu-toggle');
const topNav = document.querySelector('.topnav');

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
  const image = new Image();
  image.alt = slot.dataset.label || '';
  image.loading = slot.classList.contains('hero-image') ? 'eager' : 'lazy';
  image.onload = () => slot.classList.add('loaded');
  image.src = `assets/images/${slot.dataset.image}`;
  slot.append(image);
});
