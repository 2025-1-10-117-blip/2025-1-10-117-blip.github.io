/* ========== MZ Media Digital — Main Script ========== */

(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealAnimations();
      }, 2200);
    });

    // Fallback in case load event already fired
    if (document.readyState === 'complete') {
      setTimeout(function () {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealAnimations();
      }, 2200);
    }
  }

  /* ---------- Custom Cursor ---------- */
  function initCursor() {
    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursor-follower');
    if (!cursor || !follower) return;

    // Only for devices with fine pointer
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var mouseX = 0;
    var mouseY = 0;
    var followerX = 0;
    var followerY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    var hoverTargets = document.querySelectorAll('a, button, .service-card, .work-image');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
  }

  /* ---------- Particles ---------- */
  function initParticles() {
    var container = document.getElementById('particles');
    if (!container) return;

    var count = 30;
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
      particle.style.animationDelay = (Math.random() * 5) + 's';
      particle.style.width = (Math.random() * 3 + 1) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = String(Math.random() * 0.5 + 0.1);
      container.appendChild(particle);
    }
  }

  /* ---------- Smooth Scroll ---------- */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        var navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
        ) || 80;

        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        var navLinks = document.getElementById('nav-links');
        var navToggle = document.getElementById('nav-toggle');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---------- Navigation ---------- */
  function initNavigation() {
    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');

    // Scroll effect
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });

    // Mobile toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');

        if (navLinks.classList.contains('open')) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
      });
    }

    // Active section tracking
    var sections = document.querySelectorAll('section[id]');
    var navLinkElements = document.querySelectorAll('.nav-link[data-section]');

    function updateActiveLink() {
      var scrollPosition = window.pageYOffset + 200;

      sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;
        var sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinkElements.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
  }

  /* ---------- Reveal Animations ---------- */
  function initRevealAnimations() {
    var elements = document.querySelectorAll('.reveal-up');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var delay = entry.target.getAttribute('data-delay') || 0;
              setTimeout(function () {
                entry.target.classList.add('revealed');
              }, parseInt(delay));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback for older browsers
      elements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }

  /* ---------- Counter Animation ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-count]');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (counter) {
        observer.observe(counter);
      });
    }
  }

  function animateCounter(element) {
    var target = parseInt(element.getAttribute('data-count'));
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(easedProgress * target);

      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  /* ---------- Testimonials Slider ---------- */
  function initTestimonials() {
    var track = document.getElementById('testimonial-track');
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    var dotsContainer = document.getElementById('testimonial-dots');

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    var cards = track.querySelectorAll('.testimonial-card');
    var dots = dotsContainer.querySelectorAll('.dot');
    var currentIndex = 0;
    var totalSlides = cards.length;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;

      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', function () {
      goToSlide(currentIndex - 1);
    });

    nextBtn.addEventListener('click', function () {
      goToSlide(currentIndex + 1);
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
    });

    // Auto-play
    var autoPlayInterval = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, 5000);

    // Pause on hover
    track.addEventListener('mouseenter', function () {
      clearInterval(autoPlayInterval);
    });

    track.addEventListener('mouseleave', function () {
      autoPlayInterval = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5000);
    });

    // Touch/swipe support
    var startX = 0;
    var isDragging = false;

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoPlayInterval);
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      var endX = e.changedTouches[0].clientX;
      var diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }

      isDragging = false;
      autoPlayInterval = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 5000);
    }, { passive: true });
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Sending...</span>';
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(function () {
        submitBtn.innerHTML = '<span>Message Sent! ✓</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #43e97b, #38f9d7)';

        setTimeout(function () {
          form.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 3000);
      }, 1500);
    });
  }

  /* ---------- Parallax Effect ---------- */
  function initParallax() {
    var heroContent = document.querySelector('.hero-content');
    var heroGradient = document.querySelector('.hero-gradient');

    window.addEventListener('scroll', function () {
      var scrollY = window.pageYOffset;
      var windowHeight = window.innerHeight;

      if (scrollY < windowHeight) {
        var ratio = scrollY / windowHeight;

        if (heroContent) {
          heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
          heroContent.style.opacity = String(1 - ratio * 0.8);
        }

        if (heroGradient) {
          heroGradient.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
        }
      }
    });
  }

  /* ---------- Initialize Everything ---------- */
  function init() {
    document.body.style.overflow = 'hidden';
    initPreloader();
    initCursor();
    initParticles();
    initSmoothScroll();
    initNavigation();
    initCounters();
    initTestimonials();
    initContactForm();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
