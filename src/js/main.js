const nav = document.querySelector('.navbar');
const navList = document.querySelector('.navlist');
const toggle = document.querySelector('.nav-toggle');

function resizeNav() {
  if (window.scrollY > 12) nav.classList.add('shrink');
  else nav.classList.remove('shrink');
}
resizeNav();
window.addEventListener('scroll', resizeNav);

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  navList.classList.toggle('open');
});

document.querySelectorAll('[data-nav]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document
      .querySelector(a.getAttribute('href'))
      ?.scrollIntoView({ behavior: 'smooth' });
    navList.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

const links = Array.from(document.querySelectorAll('.navlist a[data-nav]'));
const bar = document.querySelector('.position-indicator .bar');
const sections = links
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function setActive(i) {
  links.forEach((l, k) => l.classList.toggle('active', k === i));
}
function updateBar() {
  const p = Math.max(
    0,
    Math.min(
      1,
      window.scrollY / (document.documentElement.scrollHeight - innerHeight)
    )
  );
  if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
}
const navH = document.querySelector('.navbar').offsetHeight;

function onScroll() {
  updateBar();
  const y = window.scrollY + navH + 1;
  let active = 0;
  for (let i = 0; i < sections.length; i++) {
    const top = sections[i].getBoundingClientRect().top + window.scrollY;
    const nextTop =
      i < sections.length - 1
        ? sections[i + 1].getBoundingClientRect().top + window.scrollY
        : Infinity;
    if (y >= top && y < nextTop) {
      active = i;
      break;
    }
  }
  if (innerHeight + window.scrollY >= document.body.offsetHeight - 1)
    active = sections.length - 1;
  setActive(active);
}
onScroll();
addEventListener('scroll', onScroll);
addEventListener('resize', onScroll);

const track = document.querySelector('.carousel .track');
const slides = Array.from(document.querySelectorAll('.carousel .slide'));
const prev = document.querySelector('.carousel .prev');
const next = document.querySelector('.carousel .next');
let idx = 0;
function go(i) {
  idx = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${idx * 100}%)`;
  slides.forEach((s, k) => s.classList.toggle('current', k === idx));
}
prev?.addEventListener('click', () => go(idx - 1));
next?.addEventListener('click', () => go(idx + 1));
track?.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') go(idx - 1);
  if (e.key === 'ArrowRight') go(idx + 1);
});
let startX = null;
track?.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX));
track?.addEventListener('touchend', (e) => {
  if (startX == null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (dx > 40) go(idx - 1);
  if (dx < -40) go(idx + 1);
  startX = null;
});

const openBtns = document.querySelectorAll('[data-open]');
const closeEls = document.querySelectorAll('[data-close]');
let prevFocus = null;

function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  prevFocus = document.activeElement;
  m.setAttribute('aria-hidden', 'false');
  m.querySelector(
    'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
  )?.focus();
  document.body.style.overflow = 'hidden';
}
function closeModal(el) {
  const m = el.closest('.modal');
  m?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  prevFocus?.focus();
}
openBtns.forEach((b) =>
  b.addEventListener('click', () => openModal(b.dataset.open))
);
closeEls.forEach((el) => el.addEventListener('click', () => closeModal(el)));
addEventListener('keydown', (e) => {
  if (e.key === 'Escape')
    document.querySelectorAll('.modal[aria-hidden="false"]').forEach((m) => {
      m.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      prevFocus?.focus();
    });
});

const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.2 }
);
document.querySelectorAll('.section .container').forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});
document.getElementById('year').textContent = new Date().getFullYear();
