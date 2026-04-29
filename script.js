// Dynamic footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ================================
// Smooth scroll for nav links
// ================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile menu if open
    mobileMenu.classList.remove('open');
  });
});

// ================================
// Navbar scroll tint
// ================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(8,8,16,0.95)'
    : 'rgba(8,8,16,0.7)';
});

// ================================
// Hamburger mobile menu
// ================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// ================================
// Scroll reveal
// ================================
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// ================================
// Skill bar animations (fire when in view)
// ================================
const skillBars = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.style.width = el.style.width; // trigger reflow
      skillObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
  const targetWidth = bar.style.width;
  bar.style.width = '0';
  // Use timeout to allow CSS transition
  setTimeout(() => {
    skillObserver.observe(bar);
    bar.style.width = targetWidth;
  }, 200);
});

// ================================
// Stat counter animation
// ================================
function animateCounter(el, target, suffix = '') {
  const isDecimal = target.toString().includes('.');
  let start = 0;
  const duration = 1500;
  const step = duration / 60;
  const increment = parseFloat(target) / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= parseFloat(target)) {
      current = parseFloat(target);
      clearInterval(timer);
    }
    el.textContent = isDecimal
      ? current.toFixed(1) + suffix
      : Math.floor(current) + suffix;
  }, step);
}

// Only animate numeric stats — skip .stat-tech (text-only like "TS · Py · Node")
const statNums = document.querySelectorAll('.stat-num:not(.stat-tech)');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9.]/g, '');
      const suffix = el.textContent.replace(/[0-9.]/g, '');
      if (!raw || isNaN(parseFloat(raw))) return; // extra safety guard
      animateCounter(el, raw, suffix);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

// ================================
// Contact form AJAX submit
// ================================
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        form.reset();
        successMsg.classList.add('show');
        submitBtn.textContent = '¡Enviado!';
      } else {
        submitBtn.textContent = 'Error. Intenta por email.';
      }
    } catch {
      submitBtn.textContent = 'Error. Intenta por email.';
    }
  });
}
