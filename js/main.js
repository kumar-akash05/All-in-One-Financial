/* FinBiz Solutions - Main JavaScript (restored) */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initCounters();
  initTestimonials();
  initBackToTop();
  initPremiumCardGlow();
  initActiveNavLink();
  initContactHub();
});

/* Preloader */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('hidden'), 400);
  });
}

/* Dark / Light Theme */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const icon = toggle?.querySelector('i');
  const saved = localStorage.getItem('finbiz-theme') || 'light';

  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(icon, saved);

  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('finbiz-theme', next);
    updateThemeIcon(icon, next);
  });
}

function updateThemeIcon(icon, theme) {
  if (!icon) return;
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

/* Sticky Navbar */
function initNavbar() {
  const header = document.getElementById('header');
  window.addEventListener(
    'scroll',
    () => {
      header?.classList.toggle('scrolled', window.scrollY > 50);
    },
    { passive: true }
  );
}

/* Mobile Menu */
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const links = menu?.querySelectorAll('.nav__link');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('show');
    const icon = toggle.querySelector('i');
    if (icon) icon.className = menu?.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
  });

  links?.forEach((link) => {
    link.addEventListener('click', () => {
      menu?.classList.remove('show');
      const icon = toggle?.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu || !toggle) return;
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove('show');
      const icon = toggle.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }
  });
}

/* Scroll Animations (AOS-like) */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0', 10);
          setTimeout(() => entry.target.classList.add('aos-animate'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
}

/* Animated Counters */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const animate = (el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = 'true';
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const duration = 1800;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => observer.observe(c));
}

/* Testimonials Slider */
function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  const prev = document.getElementById('testimonial-prev');
  const next = document.getElementById('testimonial-next');
  if (!track) return;

  let index = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  const getVisible = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const apply = () => {
    const card = cards[0];
    const gap = 24;
    const offset = index * (card.offsetWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  };

  const slide = (direction) => {
    const visible = getVisible();
    const max = Math.max(0, cards.length - visible);
    index = direction === 'next' ? Math.min(index + 1, max) : Math.max(index - 1, 0);
    apply();
  };

  prev?.addEventListener('click', () => slide('prev'));
  next?.addEventListener('click', () => slide('next'));

  let auto = setInterval(() => {
    const visible = getVisible();
    const max = Math.max(0, cards.length - visible);
    index = index >= max ? 0 : index + 1;
    apply();
  }, 5000);

  track.closest('.testimonials__slider')?.addEventListener('mouseenter', () => clearInterval(auto));
  track.closest('.testimonials__slider')?.addEventListener('mouseleave', () => {
    auto = setInterval(() => {
      const visible = getVisible();
      const max = Math.max(0, cards.length - visible);
      index = index >= max ? 0 : index + 1;
      apply();
    }, 5000);
  });

  window.addEventListener('resize', () => {
    index = 0;
    track.style.transform = 'translateX(0)';
  });
}

/* Back to Top */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('visible', window.scrollY > 400),
    { passive: true }
  );
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Premium card mouse glow */
function initPremiumCardGlow() {
  const cards = document.querySelectorAll('[data-glow]');
  cards.forEach((card) => {
    const glow = card.querySelector('.premium-card__glow');
    if (!glow) return;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    });
    card.addEventListener('mouseenter', () => (glow.style.opacity = '1'));
    card.addEventListener('mouseleave', () => (glow.style.opacity = '0'));
  });
}

/* Active Nav Link on Scroll — order mirrors nav; #faq sits inside #contact */
function initActiveNavLink() {
  const links = [...document.querySelectorAll('.nav__link')];
  const ORDER = ['home', 'services', 'about', 'why-us', 'testimonials', 'contact', 'faq'];
  const offset = 120;

  window.addEventListener(
    'scroll',
    () => {
      let current = ORDER[0];
      for (let i = ORDER.length - 1; i >= 0; i -= 1) {
        const id = ORDER[i];
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY + offset >= top) {
          current = id;
          break;
        }
      }
      links.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
      });
    },
    { passive: true }
  );
}

/* ----- Premium Contact / Resource Hub (multi-step + email delivery) ----- */
const SERVICE_TYPE_LABELS = {
  'website-development': 'Website Development',
  'app-development': 'App Development',
  'financial-services': 'Financial Services',
  'insurance-services': 'Insurance Services',
  'hr-services': 'HR Services',
  'event-management': 'Event Management',
  'digital-marketing': 'Digital Marketing',
  'custom-project': 'Custom Project'
};

const BUDGET_LABELS = {
  'under-50k': 'Under ₹50,000',
  '50k-2lakh': '₹50,000 – ₹2,00,000',
  '2lakh-10lakh': '₹2,00,000 – ₹10,00,000',
  '10lakh-plus': '₹10,00,000+',
  discuss: 'Prefer to discuss'
};

function safeCfg() {
  const c =
    typeof window.CONTACT_HUB_CONFIG === 'object' && window.CONTACT_HUB_CONFIG
      ? window.CONTACT_HUB_CONFIG
      : {};
  return {
    delivery: c.delivery || 'api',
    ownerEmail: c.ownerEmail || 'kumarakash030528@gmail.com',
    apiURL: typeof c.apiURL === 'string' ? c.apiURL.trim() : '',
    apiBase: typeof c.apiBase === 'string' ? c.apiBase.trim() : 'http://localhost:3001'
  };
}

function resolveApiUrl(cfg) {
  if (cfg.apiURL) return cfg.apiURL;
  const apiBase = (cfg.apiBase || 'http://localhost:3001').replace(/\/$/, '');
  const { protocol, hostname, port } = window.location;
  const onApiServer =
    port === '3001' || (protocol !== 'file:' && !port && hostname === 'localhost');
  if (protocol === 'file:' || !onApiServer) {
    return `${apiBase}/api/contact`;
  }
  return `${window.location.origin}/api/contact`;
}

function showHubToast(message, type = 'error') {
  let toast = document.getElementById('hub-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hub-toast';
    toast.className = 'hub-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `hub-toast hub-toast--${type} is-visible`;
  clearTimeout(showHubToast._timer);
  showHubToast._timer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, type === 'error' ? 8000 : 5000);
}

function initContactHub() {
  const form = document.getElementById('hub-contact-form');
  if (!form) return;

  const panels = [...form.querySelectorAll('.contact-hub__panel')];
  const fills = [document.getElementById('hub-steps-fill'), document.getElementById('hub-steps-fill-2')];
  const dots = [...form.querySelectorAll('.contact-hub__step-dot')];
  const stepsWrap = form.querySelector('.contact-hub__steps');
  const panelsWrap = form.querySelector('.contact-hub__panels');
  const successEl = document.getElementById('hub-success');
  const errEl = document.getElementById('hub-form-error');
  const submitBtn = document.getElementById('hub-submit-btn');
  const summaryMini = document.getElementById('hub-summary-mini');
  const successNoteEl = document.getElementById('hub-success-note');
  const successEmailEl = document.getElementById('hub-success-email');
  const successTitleEl = document.getElementById('hub-success-title');
  const mailWarnEl = document.getElementById('hub-mail-warn');
  const dl = document.getElementById('hub-deadline');

  let currentStep = 1;
  let mailDeliveryReady = false;

  async function checkMailDeliveryStatus() {
    const statusUrl = resolveApiUrl(safeCfg()).replace(/\/contact$/, '/contact/status');
    try {
      const res = await fetch(statusUrl, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        console.warn('[FinBiz] API error', res.status);
        mailDeliveryReady = false;
        showMailWarn('Server needs a restart. In terminal run: <code>cd server</code> then <code>npm start</code>');
        return;
      }
      const json = await res.json();
      mailDeliveryReady = json.mailConfigured === true;
      console.log('[FinBiz] Mail status:', json);
      if (mailWarnEl) {
        mailWarnEl.hidden = mailDeliveryReady;
        if (!mailDeliveryReady) {
          showMailWarn(
            json.message ||
              'Add EMAIL_PASS in server/.env — see <a href="email-setup.html">setup guide</a>'
          );
        }
      }
    } catch (e) {
      console.warn('[FinBiz] Cannot reach API:', e.message);
      mailDeliveryReady = false;
      showMailWarn(
        'Server is not running. Open terminal: <code>cd server</code> → <code>npm start</code> → open <a href="http://localhost:3001">http://localhost:3001</a>'
      );
    }

    function showMailWarn(html) {
      if (!mailWarnEl) return;
      mailWarnEl.hidden = false;
      const p = mailWarnEl.querySelector('p');
      if (p) p.innerHTML = `<strong>Notice:</strong> ${html}`;
    }
  }

  checkMailDeliveryStatus();

  const todayISO = () => new Date().toISOString().split('T')[0];
  if (dl) dl.min = todayISO();

  function syncStepDots() {
    dots.forEach((dot) => {
      const num = parseInt(dot.dataset.stepIndicator, 10);
      dot.classList.toggle('is-active', num === currentStep);
      dot.classList.toggle('is-done', num < currentStep);
    });
    if (fills[0]) fills[0].style.width = currentStep >= 2 ? '100%' : '0';
    if (fills[1]) fills[1].style.width = currentStep >= 3 ? '100%' : '0';
    panels.forEach((panel) => {
      const step = parseInt(panel.dataset.step, 10);
      const active = step === currentStep;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
  }

  function scrollToHub() {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validateStep(step) {
    let ok = true;
    const reportFirst = (id) => {
      const el = document.getElementById(id);
      if (!el.checkValidity()) {
        ok = false;
        el.reportValidity();
        return true;
      }
      return false;
    };
    if (step === 1) {
      for (const id of ['hub-full-name', 'hub-email', 'hub-phone']) {
        if (reportFirst(id)) break;
      }
    }
    if (step === 2) {
      for (const id of ['hub-service', 'hub-budget']) {
        if (reportFirst(id)) break;
      }
      if (!ok) return false;
      const srv = document.getElementById('hub-service').value;
      if (summaryMini) summaryMini.textContent = SERVICE_TYPE_LABELS[srv] || 'Project';
    }
    return ok;
  }

  document.getElementById('hub-next-1')?.addEventListener('click', () => {
    if (!validateStep(1)) return;
    currentStep = 2;
    syncStepDots();
    scrollToHub();
  });
  document.getElementById('hub-back-2')?.addEventListener('click', () => {
    currentStep = 1;
    syncStepDots();
    scrollToHub();
  });
  document.getElementById('hub-next-2')?.addEventListener('click', () => {
    if (!validateStep(2)) return;
    currentStep = 3;
    syncStepDots();
    scrollToHub();
  });
  document.getElementById('hub-back-3')?.addEventListener('click', () => {
    currentStep = 2;
    syncStepDots();
    scrollToHub();
  });

  function buildPayload(cfg) {
    const fullName = document.getElementById('hub-full-name').value.trim();
    const email = document.getElementById('hub-email').value.trim();
    const phone = document.getElementById('hub-phone').value.trim();
    const company = document.getElementById('hub-company').value.trim();
    const serviceKey = document.getElementById('hub-service').value;
    const budgetKey = document.getElementById('hub-budget').value;
    const deadline = document.getElementById('hub-deadline').value.trim();
    const message = document.getElementById('hub-message').value.trim();

    const serviceTypeLabel = SERVICE_TYPE_LABELS[serviceKey] || serviceKey;
    const budgetLabel = BUDGET_LABELS[budgetKey] || budgetKey;

    const messageBlock = `\nService: ${serviceTypeLabel}\nBudget: ${budgetLabel}\nDeadline: ${deadline || 'Not specified'}\n\n${message}`;

    return {
      fullName,
      email,
      phone,
      company,
      serviceType: serviceKey,
      serviceTypeLabel,
      budgetRange: budgetKey,
      budgetLabel,
      deadline: deadline || null,
      message,
      messageBlock,
      receivedAt: new Date().toISOString(),
      toEmail: cfg.ownerEmail
    };
  }

  function setSubmitLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.setAttribute('aria-busy', on ? 'true' : 'false');
  }

  async function submitToBackend(cfg, payload) {
    const apiURL = resolveApiUrl(cfg);

    if (window.location.protocol === 'file:') {
      console.warn('[FinBiz] Open http://localhost:3001 — file:// cannot reach the API.');
    }

    console.log('[FinBiz] POST', apiURL);

    let res;
    try {
      res = await fetch(apiURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (networkErr) {
      console.error('[FinBiz] Network error:', networkErr);
      throw new Error(
        'Cannot reach the server. Run "npm start" in the server folder, then open http://localhost:3001'
      );
    }

    const json = await res.json().catch(() => ({}));
    console.log('[FinBiz] API response', res.status, json);

    if (!res.ok || !json.ok || json.emailed !== true || json.delivery !== 'nodemailer') {
      const hint =
        res.status === 503 || json.delivery === undefined
          ? 'Email is not set up on the server. Add EMAIL_PASS in server/.env, restart the server (npm start), then try again.'
          : null;
      throw new Error(json.message || hint || 'Could not send your request. Please try again.');
    }

    return json;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errEl) errEl.hidden = true;

    const hp = document.getElementById('hub-website-url');
    if (hp && hp.value.trim()) {
      if (errEl) {
        errEl.textContent = 'Spam detected.';
        errEl.hidden = false;
      }
      return;
    }

    if (!validateStep(1)) {
      currentStep = 1;
      syncStepDots();
      return;
    }
    if (!validateStep(2)) {
      currentStep = 2;
      syncStepDots();
      return;
    }

    const msgEl = document.getElementById('hub-message');
    currentStep = 3;
    syncStepDots();
    if (!msgEl.checkValidity()) {
      msgEl.reportValidity();
      return;
    }

    const cfg = safeCfg();
    const payload = buildPayload(cfg);

    if (!mailDeliveryReady) {
      const msg =
        'Email delivery is not configured. Open email-setup.html, add Gmail App Password to server/.env, restart the server, then try again.';
      if (errEl) {
        errEl.textContent = msg;
        errEl.hidden = false;
      }
      showHubToast(msg, 'error');
      return;
    }

    setSubmitLoading(true);
    if (successEl) successEl.classList.remove('is-revealed');

    try {
      const result = await submitToBackend(cfg, payload);

      if (successTitleEl) {
        successTitleEl.textContent = 'Your request was sent successfully!';
      }
      if (successNoteEl) {
        successNoteEl.textContent =
          result?.message ||
          'A confirmation email has been sent to your inbox. Our team will contact you within 24–48 hours.';
      }
      if (successEmailEl && payload.email) {
        successEmailEl.textContent = `Confirmation sent to: ${payload.email}`;
        successEmailEl.hidden = false;
      }
      if (successEl) {
        successEl.hidden = false;
        successEl.classList.add('is-revealed');
        successEl.focus();
      }
      if (panelsWrap) panelsWrap.hidden = true;
      if (stepsWrap) stepsWrap.hidden = true;
      showHubToast('Request sent successfully!', 'success');
    } catch (err) {
      const msg =
        err?.message ||
        'Something went wrong while sending your request. Please try WhatsApp or email.';
      console.error('[FinBiz] Submit failed:', msg);
      if (errEl) {
        errEl.textContent = msg;
        errEl.hidden = false;
      }
      showHubToast(msg, 'error');
      scrollToHub();
    } finally {
      setSubmitLoading(false);
    }
  });

  document.getElementById('hub-send-another')?.addEventListener('click', () => {
    form.reset();
    if (dl) dl.min = todayISO();
    currentStep = 1;
    if (summaryMini) summaryMini.textContent = '';
    if (successEl) {
      successEl.hidden = true;
      successEl.classList.remove('is-revealed');
    }
    if (errEl) errEl.hidden = true;
    if (successEmailEl) successEmailEl.hidden = true;
    if (panelsWrap) panelsWrap.hidden = false;
    if (stepsWrap) stepsWrap.hidden = false;
    syncStepDots();
    scrollToHub();
  });

  syncStepDots();
}
