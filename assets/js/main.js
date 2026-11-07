document.addEventListener('DOMContentLoaded', () => {

  /* ---- footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('is-open');
    });
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navList.classList.remove('is-open'));
    });
  }

  /* ---- scroll spy on nav links ---- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(sec => spy.observe(sec));

  /* ---- reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- animate skill meters when in view ---- */
  const meters = document.querySelectorAll('.meter__fill');
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const value = el.getAttribute('data-value') || 0;
        requestAnimationFrame(() => {
          el.style.transition = 'width 1s cubic-bezier(.4,0,.2,1)';
          el.style.width = value + '%';
        });
        meterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  meters.forEach(m => meterObserver.observe(m));

  /* ---- hero role swap ---- */
  const roleSwap = document.getElementById('roleSwap');
  const roles = ['Cybersecurity Graduate Student', 'Computer Engineer'];
  let roleIndex = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (roleSwap && !prefersReducedMotion) {
    setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleSwap.style.opacity = 0;
      setTimeout(() => {
        roleSwap.textContent = roles[roleIndex];
        roleSwap.style.opacity = 1;
      }, 250);
    }, 2800);
    roleSwap.style.transition = 'opacity .25s ease';
  }

  /* ---- contact form submit ---- */
  const form = document.getElementById('contactForm');
  const msg = document.getElementById('formMsg');
  const scriptURL = 'https://script.google.com/macros/s/AKfycby9zXa9mP0xqRNdV3hoYhbLnh7rtPsVaKbnUAOOHsbfjswXM7kU_QxZKYC1zfxu3uk8/exec';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (msg) msg.textContent = 'Sending…';
      // Apps Script does not return CORS headers, so the browser cannot read
      // its response. Keep this as a simple URL-encoded cross-origin request.
      const formData = new FormData(form);
      // URL-encoded fields are exposed by Apps Script as e.parameter values.
      fetch(scriptURL, { method: 'POST', body: new URLSearchParams(formData), mode: 'no-cors' })
        .then(() => {
          if (msg) msg.textContent = 'Message submitted — thank you.';
          form.reset();
          setTimeout(() => { if (msg) msg.textContent = ''; }, 5000);
        })
        .catch((err) => {
          console.error('Contact form error:', err);
          if (msg) msg.textContent = "Something went wrong — please email me directly.";
        });
    });
  }
});
