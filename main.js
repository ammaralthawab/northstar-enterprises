/* ==========================================
   NorthStar Enterprises — Main JavaScript
   ========================================== */

(function () {
  'use strict';

  // ---------- State ----------
  let currentLang = 'en';

  // ---------- DOM Elements ----------
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navHamburger = document.getElementById('navHamburger');
  const langToggle = document.getElementById('langToggle');
  const contactForm = document.getElementById('contactForm');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  // ---------- Navigation scroll effect ----------
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ---------- Active nav link on scroll ----------
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ---------- Mobile nav toggle ----------
  function toggleMobileNav() {
    navLinks.classList.toggle('open');
    navHamburger.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  }

  function closeMobileNav() {
    navLinks.classList.remove('open');
    navHamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ---------- Language toggle ----------
  function switchLanguage() {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const lang = currentLang === 'ar' ? 'ar' : 'en';

    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);

    // Update all translatable elements
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
      const text = el.getAttribute('data-' + currentLang);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Smooth transition
    document.body.style.transition = 'none';
    requestAnimationFrame(() => {
      document.body.style.transition = '';
    });
  }

  // ---------- Intersection Observer for reveal animations ----------
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px 0px 200px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // ---------- Smooth scroll for nav links ----------
  function handleNavClick(e) {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        closeMobileNav();
      }
    }
  }

  // ---------- Contact form handler ----------
  function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const business = document.getElementById('businessName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const budget = document.getElementById('budget').value;
    const desc = document.getElementById('projectDesc').value.trim();

    if (!name || !business || !phone || !budget || !desc) return;

    // Create mailto link
    const subject = encodeURIComponent('New Project Inquiry — ' + business);
    const body = encodeURIComponent(
      'Full Name: ' + name + '\n' +
      'Business: ' + business + '\n' +
      'Phone: ' + phone + '\n' +
      'Budget: ' + budget + '\n\n' +
      'Project Description:\n' + desc
    );

    window.location.href = 'mailto:ammar.sadeq.2009@gmail.com?subject=' + subject + '&body=' + body;

    // Show success
    const successMsg = currentLang === 'ar'
      ? 'شكراً لتواصلك! سنرد عليك قريباً.'
      : 'Thank you! Redirecting to your email client.';

    contactForm.innerHTML = '<div class="form-success">' + successMsg + '</div>';
  }


  // ---------- Event Listeners ----------
  function init() {
    // Scroll handlers (throttled)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleNavScroll();
          updateActiveLink();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Mobile nav
    navHamburger.addEventListener('click', toggleMobileNav);

    // Nav links
    allNavLinks.forEach(link => link.addEventListener('click', handleNavClick));

    // All anchor links with hash
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            closeMobileNav();
          }
        }
      });
    });

    // Language toggle
    langToggle.addEventListener('click', switchLanguage);

    // Contact form
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Init animations
    initRevealAnimations();

    // Initial states
    handleNavScroll();
    updateActiveLink();
  }

  // ---------- Start ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
