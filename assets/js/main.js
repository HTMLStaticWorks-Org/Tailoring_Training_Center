/**
 * Velora — Main Interactive Script (Vanilla ES6+ JavaScript)
 * Features:
 * 1. Sticky Header Scroll State
 * 2. Right-Aligned Mobile Hamburger Navigation Drawer
 * 3. Scroll Reveal Animations (IntersectionObserver)
 * 4. Student Testimonial Carousel
 * 5. Gallery Category Filtering & Vanilla JS Lightbox Modal
 * 6. Enrollment & Contact Form Validation (Accessible, Ready for Backend/WhatsApp)
 * 7. URL Query Course Pre-selection on Contact Page
 * 8. Back-to-Top Smooth Scroll Button
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndRtlToggles();
  initStickyHeader();
  initMobileNavigation();
  initScrollReveal();
  initTestimonialSlider();
  initGalleryAndLightbox();
  initEnrollmentForm();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   0. THEME (DARK/LIGHT) & RTL/LTR TOGGLES
   -------------------------------------------------------------------------- */
function initThemeAndRtlToggles() {
  const htmlEl = document.documentElement;
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');

  // Restore saved preferences
  const savedTheme = localStorage.getItem('ttc_theme') || 'light';
  const savedDir = localStorage.getItem('ttc_dir') || 'ltr';

  const applyTheme = (theme) => {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('ttc_theme', theme);
    const isDark = theme === 'dark';

    themeBtns.forEach((btn) => {
      btn.classList.toggle('active', isDark);
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
      }
      const label = btn.querySelector('.utility-btn-label');
      if (label) {
        label.textContent = isDark ? 'Light' : 'Theme';
      }
    });
  };

  const applyDirection = (dir) => {
    htmlEl.setAttribute('dir', dir);
    localStorage.setItem('ttc_dir', dir);
    const isRtl = dir === 'rtl';

    rtlBtns.forEach((btn) => {
      btn.classList.toggle('active', isRtl);
      btn.setAttribute('aria-pressed', isRtl ? 'true' : 'false');
      const label = btn.querySelector('.utility-btn-label');
      if (label) {
        label.textContent = isRtl ? 'LTR' : 'RTL';
      }
    });
  };

  applyTheme(savedTheme);
  applyDirection(savedDir);

  themeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  });

  rtlBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextDir = htmlEl.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(nextDir);
    });
  });
}

/* --------------------------------------------------------------------------
   1. STICKY HEADER
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const closeBtn = document.querySelector('.mobile-drawer-close');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openMenu = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. STUDENT TESTIMONIAL SLIDER
   -------------------------------------------------------------------------- */
function initTestimonialSlider() {
  const sliderWrap = document.querySelector('.testimonial-slider-wrap');
  if (!sliderWrap) return;

  const slides = Array.from(sliderWrap.querySelectorAll('.testimonial-slide'));
  const dots = Array.from(sliderWrap.querySelectorAll('.testimonial-dot'));
  const prevBtn = sliderWrap.querySelector('[data-testimonial-prev]');
  const nextBtn = sliderWrap.querySelector('[data-testimonial-next]');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoTimer = null;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
    });
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 6500);
  };

  const stopAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      startAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      startAuto();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAuto();
    });
  });

  sliderWrap.addEventListener('mouseenter', stopAuto);
  sliderWrap.addEventListener('mouseleave', startAuto);

  showSlide(0);
  startAuto();
}

/* --------------------------------------------------------------------------
   5. GALLERY CATEGORY FILTERING & LIGHTBOX PREVIEW
   -------------------------------------------------------------------------- */
function initGalleryAndLightbox() {
  const filterBtns = Array.from(document.querySelectorAll('.gallery-filter-btn'));
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const countEl = document.getElementById('galleryCountDisplay');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter') || 'all';

        filterBtns.forEach((b) => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });

        let visibleCount = 0;
        galleryItems.forEach((item) => {
          const itemCat = item.getAttribute('data-category') || '';
          const match = filterValue === 'all' || itemCat.split(' ').includes(filterValue);
          item.classList.toggle('hidden-item', !match);
          if (match) visibleCount++;
        });

        if (countEl) {
          countEl.textContent = `Showing ${visibleCount} Tailoring Showcase ${visibleCount === 1 ? 'Work' : 'Works'}`;
        }
      });
    });
  }

  // Lightbox Modal
  const lightbox = document.getElementById('ttcLightbox');
  if (!lightbox || !galleryItems.length) return;

  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const closeBtns = lightbox.querySelectorAll('[data-lightbox-close]');
  const prevBtn = lightbox.querySelector('[data-lightbox-prev]');
  const nextBtn = lightbox.querySelector('[data-lightbox-next]');

  let activeItems = [];
  let currentGalleryIdx = 0;

  const getVisibleItems = () =>
    galleryItems.filter((item) => !item.classList.contains('hidden-item'));

  const updateLightboxContent = (index) => {
    activeItems = getVisibleItems();
    if (!activeItems.length) return;

    currentGalleryIdx = (index + activeItems.length) % activeItems.length;
    const item = activeItems[currentGalleryIdx];
    const imgEl = item.querySelector('img');
    const titleText = item.getAttribute('data-title') || (imgEl ? imgEl.alt : 'Student Creation');
    const catText = item.getAttribute('data-category-label') || 'Tailoring Showcase';
    const descText = item.getAttribute('data-description') || '';

    if (lightboxImg && imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt;
    }
    if (lightboxTitle) lightboxTitle.textContent = titleText;
    if (lightboxCategory) lightboxCategory.textContent = catText;
    if (lightboxDesc) lightboxDesc.textContent = descText;
  };

  const openLightbox = (clickedItem) => {
    activeItems = getVisibleItems();
    const index = activeItems.indexOf(clickedItem);
    updateLightboxContent(index >= 0 ? index : 0);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item) => {
    const card = item.querySelector('.gallery-card');
    if (card) {
      card.addEventListener('click', () => openLightbox(item));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    }
  });

  closeBtns.forEach((btn) => btn.addEventListener('click', closeLightbox));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateLightboxContent(currentGalleryIdx - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateLightboxContent(currentGalleryIdx + 1));
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') updateLightboxContent(currentGalleryIdx - 1);
    if (e.key === 'ArrowRight') updateLightboxContent(currentGalleryIdx + 1);
  });
}

/* --------------------------------------------------------------------------
   6. ENROLLMENT & CONTACT FORM VALIDATION
   -------------------------------------------------------------------------- */
function initEnrollmentForm() {
  const form = document.getElementById('ttcEnrollmentForm');
  if (!form) return;

  // Pre-populate Preferred Course or Batch from URL query parameters if present
  const params = new URLSearchParams(window.location.search);
  const courseParam = params.get('course');
  const batchParam = params.get('batch');

  const courseSelect = document.getElementById('preferredCourse');
  const batchSelect = document.getElementById('preferredBatch');

  if (courseParam && courseSelect) {
    Array.from(courseSelect.options).forEach((opt) => {
      if (opt.value.toLowerCase().includes(courseParam.toLowerCase())) {
        courseSelect.value = opt.value;
      }
    });
  }

  if (batchParam && batchSelect) {
    Array.from(batchSelect.options).forEach((opt) => {
      if (opt.value.toLowerCase().includes(batchParam.toLowerCase())) {
        batchSelect.value = opt.value;
      }
    });
  }

  const fullName = document.getElementById('fullName');
  const mobileNumber = document.getElementById('mobileNumber');
  const emailAddress = document.getElementById('emailAddress');
  const experienceLevel = document.getElementById('tailoringExperience');
  const feedbackBanner = document.getElementById('formFeedbackBanner');

  const setFieldError = (inputEl, errorId, hasError) => {
    const errEl = document.getElementById(errorId);
    if (!inputEl) return;
    inputEl.classList.toggle('is-invalid', hasError);
    inputEl.setAttribute('aria-invalid', hasError ? 'true' : 'false');
    if (errEl) {
      errEl.classList.toggle('visible', hasError);
    }
  };

  const validateMobile = (val) => {
    const cleaned = val.replace(/[\s\-()]/g, '');
    return /^(\+?\d{10,15})$/.test(cleaned);
  };

  const validateEmail = (val) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 1. Full Name
    const nameInvalid = !fullName || fullName.value.trim().length < 2;
    setFieldError(fullName, 'fullNameError', nameInvalid);
    if (nameInvalid) isValid = false;

    // 2. Mobile Number
    const mobileInvalid = !mobileNumber || !validateMobile(mobileNumber.value);
    setFieldError(mobileNumber, 'mobileNumberError', mobileInvalid);
    if (mobileInvalid) isValid = false;

    // 3. Email Address
    const emailInvalid = !emailAddress || !validateEmail(emailAddress.value);
    setFieldError(emailAddress, 'emailAddressError', emailInvalid);
    if (emailInvalid) isValid = false;

    // 4. Preferred Course
    const courseInvalid = !courseSelect || !courseSelect.value;
    setFieldError(courseSelect, 'preferredCourseError', courseInvalid);
    if (courseInvalid) isValid = false;

    // 5. Preferred Batch Timing
    const batchInvalid = !batchSelect || !batchSelect.value;
    setFieldError(batchSelect, 'preferredBatchError', batchInvalid);
    if (batchInvalid) isValid = false;

    // 6. Previous Tailoring Experience
    const expInvalid = !experienceLevel || !experienceLevel.value;
    setFieldError(experienceLevel, 'tailoringExperienceError', expInvalid);
    if (expInvalid) isValid = false;

    if (!feedbackBanner) return;

    if (!isValid) {
      feedbackBanner.className = 'form-feedback-banner error';
      feedbackBanner.innerHTML =
        '<i class="bi bi-exclamation-triangle-fill me-2"></i>Please review the highlighted fields and provide valid contact and course preferences.';
      return;
    }

    // Validated local confirmation ready for future backend or WhatsApp integration
    const studentName = fullName.value.trim();
    const chosenCourse = courseSelect.value;
    const chosenBatch = batchSelect.value;

    feedbackBanner.className = 'form-feedback-banner success';
    feedbackBanner.innerHTML = `
      <div class="d-flex align-items-start gap-3">
        <i class="bi bi-check-circle-fill fs-4 mt-1"></i>
        <div>
          <strong class="d-block mb-1">Enrollment Inquiry Recorded Locally for ${studentName}</strong>
          <span>Your preference for <strong>${chosenCourse}</strong> (${chosenBatch}) has been validated. This static form is ready for future backend or WhatsApp integration—please contact our admissions desk directly via phone or visit our training center to confirm seat availability.</span>
        </div>
      </div>
    `;

    form.reset();
  });
}

/* --------------------------------------------------------------------------
   7. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 380) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
