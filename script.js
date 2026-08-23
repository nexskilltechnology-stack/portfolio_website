/* ============================
   PAGE TRANSITION OVERLAY
   Runs immediately (not inside DOMContentLoaded) so it can cover
   the page before first paint, then fades out once content is ready.
   Also intercepts same-origin link clicks so navigating to another
   page on the site fades out first instead of a hard cut.
   ============================ */
(() => {
  const OVERLAY_ID = 'page-transition-overlay';

  const injectOverlayStyles = () => {
    if (document.getElementById('page-transition-style')) return;
    const style = document.createElement('style');
    style.id = 'page-transition-style';
    style.textContent = `
      #${OVERLAY_ID} {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: var(--bg, #060b16);
        opacity: 1;
        pointer-events: none;
        transition: opacity 0.4s ease;
      }
      #${OVERLAY_ID}.is-hidden {
        opacity: 0;
      }
      #${OVERLAY_ID}.is-leaving {
        opacity: 1;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
  };

  const createOverlay = () => {
    let overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = OVERLAY_ID;
      document.documentElement.appendChild(overlay);
    }
    return overlay;
  };

  injectOverlayStyles();
  const overlay = createOverlay();

  const revealPage = () => {
    overlay.classList.add('is-hidden');
  };

  if (document.readyState === 'complete') {
    requestAnimationFrame(revealPage);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(revealPage));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    let targetUrl;
    try {
      targetUrl = new URL(href, window.location.href);
    } catch (err) {
      return;
    }
    if (targetUrl.origin !== window.location.origin) return;
    if (targetUrl.pathname === window.location.pathname && targetUrl.hash) return;

    event.preventDefault();
    overlay.classList.remove('is-hidden');
    overlay.classList.add('is-leaving');
    setTimeout(() => {
      window.location.href = targetUrl.href;
    }, 320);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const year = document.getElementById('year');
  const modal = document.getElementById('service-modal');
  const serviceTitle = document.getElementById('service-modal-title');
  const serviceDescription = document.getElementById('service-modal-description');
  const serviceFeatures = document.getElementById('service-modal-features');
  const modalIcon = document.getElementById('modal-icon');
  const closeModalBtn = document.querySelector('.modal-close');
  const serviceBookingButton = document.querySelector('.modal-book-service');
  const selectedServiceField = document.getElementById('selected-service');
  const contactSection = document.getElementById('contact');

  /* ============================
     SERVICE DETAIL MODAL
     The visible "Learn more" button has been removed from the service
     cards, but the modal itself stays wired up (triggered by clicking
     anywhere on a card) so the booking flow keeps working.
     ============================ */
  const serviceContent = {
    'web-development': {
      title: 'Web Development',
      icon: '🌐',
      description: 'We build polished, high-converting websites that combine strong UX, performance, and business strategy to help your brand stand out and convert visitors into customers.',
      features: ['Custom responsive websites', 'Conversion-focused landing pages', 'Fast performance optimization', 'SEO-friendly structure']
    },
    'mobile-app-development': {
      title: 'Mobile App Development',
      icon: '📱',
      description: 'From idea to launch, we design and build mobile experiences that are intuitive, scalable, and built for long-term user retention and engagement.',
      features: ['iOS and Android application design', 'User onboarding flows', 'App analytics and optimization', 'Maintenance and scaling support']
    },
    'lead-generation': {
      title: 'Lead Generation',
      icon: '🎯',
      description: 'We create outreach systems, funnel pages, and appointment flows that attract better leads and help your sales team focus on the right opportunities.',
      features: ['Targeted campaign funnels', 'Landing page optimization', 'CRM-ready lead capture', 'Sales pipeline nurturing']
    },
    'digital-marketing': {
      title: 'Digital Marketing',
      icon: '📈',
      description: 'Our digital marketing strategies are built to improve visibility, generate demand, and drive measurable return through ads, content, and search performance.',
      features: ['SEO and content strategy', 'PPC and paid social campaigns', 'Brand awareness growth', 'Analytics and ROI reporting']
    },
    'ai-automation': {
      title: 'AI Automation',
      icon: '🤖',
      description: 'We automate repetitive tasks and business workflows using AI tools so your team can save time, reduce manual work, and scale effectively.',
      features: ['Workflow automation setup', 'AI-powered customer support', 'Lead qualification systems', 'Smart data handling and reporting']
    }
  };

  let currentServiceKey = null;

  const openServiceModal = (serviceKey) => {
    const content = serviceContent[serviceKey];
    if (!content || !modal) return;

    currentServiceKey = serviceKey;
    serviceTitle.textContent = content.title;
    serviceDescription.textContent = content.description;
    modalIcon.textContent = content.icon;
    serviceFeatures.innerHTML = content.features.map((feature) => `<li>${feature}</li>`).join('');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeServiceModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  const handleBookService = () => {
    if (!currentServiceKey || !serviceContent[currentServiceKey]) return;

    if (selectedServiceField) {
      selectedServiceField.value = currentServiceKey;
      selectedServiceField.dispatchEvent(new Event('change', { bubbles: true }));
      selectedServiceField.classList.add('is-preselected');
      setTimeout(() => selectedServiceField.classList.remove('is-preselected'), 900);
    }

    closeServiceModal();

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Service cards are intentionally NOT wired to any click handler.
  // Clicking a card must do nothing — no modal, no blur, no overlay,
  // no transition. The functions and content object above are kept in
  // case a future flow (outside the card itself) needs to open the
  // modal, but nothing currently calls openServiceModal().

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeServiceModal);
  if (serviceBookingButton) serviceBookingButton.addEventListener('click', handleBookService);

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target.matches('[data-close-modal="true"]')) closeServiceModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) closeServiceModal();
    });
  }

  /* ============================
     DARK / LIGHT THEME TOGGLE
     The inline script in <head> already set data-theme before paint
     to avoid a flash; this wires up the toggle button, keeps the
     icon and aria-label in sync, and persists the choice.
     ============================ */
  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    root.setAttribute('data-theme', theme);
    if (themeIcon) themeIcon.textContent = isLight ? '🌙' : '☀️';
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
  };

  // Sync the icon/label with whatever theme the blocking inline script
  // already applied to <html data-theme="...">.
  applyTheme(root.getAttribute('data-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';

      const swap = () => {
        localStorage.setItem('nexskill-theme', nextTheme);
        applyTheme(nextTheme);
      };

      if (document.startViewTransition) {
        document.startViewTransition(swap);
      } else {
        swap();
      }
    });
  }

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
    if (!localStorage.getItem('nexskill-theme')) {
      applyTheme(event.matches ? 'light' : 'dark');
    }
  });

  /* ============================
     MOBILE NAV
     ============================ */
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================
     TEAM CARD 3D FLIP (touch devices)
     Desktop flips the card purely via CSS :hover (see style.css) —
     no JS and no click required. Touch devices have no hover, so a
     tap toggles the same rotateY(180deg) flip via the "is-flipped"
     class, and tapping another card (or elsewhere) closes it again.
     Taps on the LinkedIn/Email links inside are left alone so they
     navigate instead of just flipping the card.
     ============================ */
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (isTouchDevice) {
    const teamCards = document.querySelectorAll('.team-card');

    teamCards.forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('.team-link')) return;

        const alreadyFlipped = card.classList.contains('is-flipped');
        teamCards.forEach((other) => other.classList.remove('is-flipped'));
        if (!alreadyFlipped) card.classList.add('is-flipped');
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.team-card')) {
        teamCards.forEach((card) => card.classList.remove('is-flipped'));
      }
    });
  }

  /* ============================
     REPLAYABLE SCROLL-REVEAL SYSTEM
     Toggles .is-visible ON as an element enters the viewport AND
     removes it as the element leaves — in both scroll directions —
     so every animation replays every time, with no reload needed.
     A single efficient IntersectionObserver handles all elements.
     ============================ */
  const revealTargets = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ============================
     COUNT-UP NUMBERS
     Re-runs the count animation every time the number's container
     re-enters the viewport (works with the reveal system above).
     ============================ */
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        el.dataset.raf = requestAnimationFrame(tick);
      }
    };

    if (el.dataset.raf) cancelAnimationFrame(Number(el.dataset.raf));
    el.dataset.raf = requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
        } else {
          entry.target.textContent = '0';
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll('.count-up').forEach((el) => counterObserver.observe(el));

  /* ============================
     BUTTON CLICK RIPPLE FEEDBACK
     Adds a short-lived expanding ripple centered on the click point
     for every primary interactive control.
     ============================ */
  const rippleSelectors = '.cta-button, .secondary-button, .modal-close';

  document.addEventListener('click', (event) => {
    const target = event.target.closest(rippleSelectors);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    const computedPosition = getComputedStyle(target).position;
    if (computedPosition === 'static') target.style.position = 'relative';

    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  /* ============================
     SERVICE CARD 3D TILT
     Subtle pointer-following tilt for a premium, tactile feel.
     Skipped automatically on touch devices via the pointer check.
     ============================ */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================
     FOOTER YEAR
     ============================ */
  if (year) year.textContent = new Date().getFullYear();

  /* ============================
     CONTACT FORM SUBMISSION
     ============================ */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const button = contactForm.querySelector('button');
      const buttonLabel = button.querySelector('span');
      const originalText = buttonLabel ? buttonLabel.textContent : button.textContent;
      const setLabel = (text) => {
        if (buttonLabel) buttonLabel.textContent = text;
        else button.textContent = text;
      };

      setLabel('Sending...');
      button.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          setLabel('Inquiry Sent!');
          contactForm.reset();

          setTimeout(() => {
            setLabel(originalText);
            button.disabled = false;
          }, 2200);
        } else {
          alert('Error sending inquiry. Please try again.');
          setLabel(originalText);
          button.disabled = false;
        }
      } catch (error) {
        alert('Error sending inquiry. Please try again.');
        setLabel(originalText);
        button.disabled = false;
      }
    });
  }
});
