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

  let currentServiceKey = null;

  const closeServiceModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  const handleBookService = () => {
    if (!currentServiceKey || !serviceContent[currentServiceKey]) return;

    const selectedService = serviceContent[currentServiceKey].title;
    if (selectedServiceField) {
      selectedServiceField.value = selectedService;
    }

    closeServiceModal();

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.service-detail-btn')) return;
      openServiceModal(card.dataset.service);
    });

    const button = card.querySelector('.service-detail-btn');
    if (button) {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        openServiceModal(card.dataset.service);
      });
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeServiceModal);
  }

  if (serviceBookingButton) {
    serviceBookingButton.addEventListener('click', handleBookService);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target.matches('[data-close-modal="true"]')) {
        closeServiceModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeServiceModal();
      }
    });
  }

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('nexskill-theme');
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    root.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = isLight ? '🌙' : '☀️';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }
  };

  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      localStorage.setItem('nexskill-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

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

  const revealElements = document.querySelectorAll('.service-card, .review-card, .stat-box, .project-card, .team-card, .process-step, .contact-form, .section-heading, .benefit-copy, .hero-copy, .hero-visual');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    revealObserver.observe(element);
  });

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const button = contactForm.querySelector('button');
      const originalText = button.textContent;
      button.textContent = 'Sending...';
      button.disabled = true;

      const formData = new FormData(contactForm);
      
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          button.textContent = 'Inquiry Sent!';
          contactForm.reset();
          
          setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
          }, 2000);
        } else {
          alert('Error sending inquiry. Please try again.');
          button.textContent = originalText;
          button.disabled = false;
        }
      } catch (error) {
        alert('Error sending inquiry. Please try again.');
        button.textContent = originalText;
        button.disabled = false;
      }
    });
  }

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
    if (!localStorage.getItem('nexskill-theme')) {
      applyTheme(event.matches ? 'light' : 'dark');
    }
  });
});
