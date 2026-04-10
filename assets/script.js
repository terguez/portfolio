
// Thème: respecte le système + toggle sauvegardé
(function themeInit(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }
})();
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
});

// Menu mobile
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

// Scroll spy (lien actif)
const links = document.querySelectorAll('.nav a[href^="#"]');
const sections = Array.from(links).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function onScroll(){
  const y = window.scrollY + 120;
  let current = sections[0]?.id;
  sections.forEach(sec => { if (sec.offsetTop <= y) current = sec.id; });
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', onScroll);
onScroll();

// Footer infos
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('lastUpdated').textContent = new Date(document.lastModified).toLocaleDateString('fr-FR');

// ===== Slider Accueil (auto-play 5 s, pause au survol, dots, anti-double-timer) =====
(function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const imgs = slider.querySelectorAll('.slides img');
  const dots = slider.querySelectorAll('.dot');
  if (!imgs.length) return;

  let i = 0;
  const DURATION = 5000; // 5 secondes
  let timer = null;

  function show(n) {
    imgs[i].classList.remove('active');
    dots[i]?.classList.remove('active');
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add('active');
    dots[i]?.classList.add('active');
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop(); // empêche les doublons
    timer = setInterval(() => show(i + 1), DURATION);
  }

  // Init
  imgs[0].classList.add('active');
  dots[0]?.classList.add('active');
  start();

  // Pause au survol
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  // Dots cliquables
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      stop();
      show(idx);
      start();
    });
  });

  // Stop si onglet caché ; reprend à l’affichage
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // Stop / Start selon visibilité à l’écran
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { e.isIntersecting ? start() : stop(); });
    }, { threshold: 0.1 });
    obs.observe(slider);
  }
})();
