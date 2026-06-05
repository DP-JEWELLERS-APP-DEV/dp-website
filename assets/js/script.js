/* ===================================
   DP Jewellers - Main JavaScript
   =================================== */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ===================================
  // Navbar & Navigation
  // ===================================
  const navbar = document.getElementById("navbar");
  const header = document.querySelector(".main-header");
  const navLinks = document.querySelectorAll(".nav-link");
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.getElementById("navLinks");
  const sections = document.querySelectorAll("section[id]");

  // Cached section positions (refreshed on load/resize)
  let sectionMetrics = [];

  function cacheSectionMetrics() {
    sectionMetrics = Array.from(sections).map((section) => ({
      id: section.getAttribute("id"),
      top: section.offsetTop - 100,
      bottom: section.offsetTop - 100 + section.offsetHeight,
    }));
  }

  function updateHeaderOnScroll() {
    const scrolled = window.scrollY > 50;
    if (navbar) navbar.classList.toggle("scrolled", scrolled);
    if (header) {
      header.classList.toggle("is-sticky", scrolled);
      header.classList.toggle("scrolled", scrolled);
    }
  }

  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    let activeId = null;

    for (const metric of sectionMetrics) {
      if (scrollY > metric.top && scrollY <= metric.bottom) {
        activeId = metric.id;
        break;
      }
    }

    if (!activeId) return;

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${activeId}`,
      );
    });
  }

  function onScroll() {
    updateHeaderOnScroll();
    if (sectionMetrics.length > 0) updateActiveLink();
  }

  if (navbar || header || sections.length > 0) {
    cacheSectionMetrics();
    window.addEventListener("resize", cacheSectionMetrics, { passive: true });

    let scrollTicking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!scrollTicking) {
          scrollTicking = true;
          requestAnimationFrame(() => {
            onScroll();
            scrollTicking = false;
          });
        }
      },
      { passive: true },
    );

    onScroll();
  }

  // Mobile Menu Toggle
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navLinksContainer.classList.toggle("active");
    });

    const allLinks = navLinksContainer.querySelectorAll(".nav-link");
    allLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.parentElement.classList.contains("has-dropdown")) {
          e.preventDefault();
          link.parentElement.classList.toggle("active");
          return;
        }
        hamburger.classList.remove("active");
        navLinksContainer.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (
        !hamburger.contains(e.target) &&
        !navLinksContainer.contains(e.target)
      ) {
        hamburger.classList.remove("active");
        navLinksContainer.classList.remove("active");
      }
    });
  }

  // ===================================
  // Hero Slider logic
  // ===================================
  const sliderSection = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  if (sliderSection && slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 3000;

    function nextSlide() {
      slides[currentSlide].classList.remove("active");
      if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

      currentSlide = (currentSlide + 1) % slides.length;

      slides[currentSlide].classList.add("active");
      if (dots[currentSlide]) dots[currentSlide].classList.add("active");
    }

    function goToSlide(index) {
      if (index === currentSlide) return;
      slides[currentSlide].classList.remove("active");
      if (dots[currentSlide]) dots[currentSlide].classList.remove("active");
      currentSlide = index;
      slides[currentSlide].classList.add("active");
      if (dots[currentSlide]) dots[currentSlide].classList.add("active");
      resetSliderInterval();
    }

    function startSliderInterval() {
      stopSliderInterval();
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    function stopSliderInterval() {
      if (slideInterval) clearInterval(slideInterval);
    }

    function resetSliderInterval() {
      stopSliderInterval();
      startSliderInterval();
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));
    });

    window.forceSliderNext = nextSlide;
    setTimeout(startSliderInterval, 500);
  }

  // ===================================
  // Hero Video — pause when off-screen
  // ===================================
  const videoHero = document.querySelector(".video-hero");
  const heroVideo = videoHero?.querySelector("video");

  if (heroVideo && !prefersReducedMotion) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroVideo.play().catch(() => {});
          } else {
            heroVideo.pause();
          }
        });
      },
      { threshold: 0.25 },
    );
    videoObserver.observe(videoHero);
  } else if (heroVideo && prefersReducedMotion) {
    heroVideo.pause();
    heroVideo.removeAttribute("autoplay");
  }

  // ===================================
  // Lazy-load iframes (YouTube, Maps)
  // ===================================
  const lazyIframes = document.querySelectorAll("iframe[data-src]");
  if (lazyIframes.length > 0) {
    const iframeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute("data-src");
          }
          iframeObserver.unobserve(iframe);
        });
      },
      { rootMargin: "200px 0px" },
    );
    lazyIframes.forEach((iframe) => iframeObserver.observe(iframe));
  }

  // ===================================
  // Custom Cursor Logic
  // ===================================
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  if (cursorDot && cursorOutline) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate(
        { left: `${posX}px`, top: `${posY}px` },
        { duration: 500, fill: "forwards" },
      );
    });
  }

  // ===================================
  // Scroll Fade-In Animation (Intersection Observer)
  // ===================================
  const fadeElements = document.querySelectorAll(
    ".fade-in-up, .reveal-on-scroll",
  );
  if (fadeElements.length > 0) {
    const fadeInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            fadeInObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );
    fadeElements.forEach((element) => fadeInObserver.observe(element));
  }

  // ===================================
  // Interactive Elements & Buttons
  // ===================================
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");
  wishlistButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const svg = button.querySelector("svg");
      const path = svg?.querySelector("path");
      if (path) {
        if (path.getAttribute("fill") === "currentColor") {
          path.setAttribute("fill", "none");
          button.style.color = "";
        } else {
          path.setAttribute("fill", "currentColor");
          button.style.color = "#C5A059";
          button.style.transform = "scale(1.2)";
          setTimeout(() => (button.style.transform = "scale(1)"), 200);
        }
      }
    });
  });

  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitButton = newsletterForm.querySelector("button");
      if (emailInput && emailInput.value.trim() !== "" && submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = "Subscribed!";
        submitButton.style.backgroundColor = "#4A4A4A";
        emailInput.value = "";
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.style.backgroundColor = "";
        }, 3000);
      }
    });
  }

  const scrollToTopBtn = document.getElementById("scrollToTop");
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerOffset = document.body.classList.contains("home-page")
          ? window.innerWidth > 992 ? 112 : 80
          : 80;
        window.scrollTo({
          top: targetSection.offsetTop - headerOffset,
          behavior: "smooth",
        });
      }
    });
  });

  const hoverElements = document.querySelectorAll(
    ".cta-button, .product-card, .category-card",
  );
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

  // ===================================
  // Testimonials Slider + Dots
  // ===================================
  const testimonialCards = document.querySelectorAll(".testimonials-showcase .testimonial-card");
  const testimonialDots = document.querySelectorAll(".testimonial-dot");

  if (testimonialCards.length > 0) {
    let currentTestimonial = 0;
    const testimonialInterval = 10000;
    let testimonialTimer;

    function goToTestimonial(index) {
      if (index === currentTestimonial) return;
      testimonialCards[currentTestimonial].classList.remove("active");
      if (testimonialDots[currentTestimonial]) {
        testimonialDots[currentTestimonial].classList.remove("active");
      }
      currentTestimonial = index;
      testimonialCards[currentTestimonial].classList.add("active");
      if (testimonialDots[currentTestimonial]) {
        testimonialDots[currentTestimonial].classList.add("active");
      }
    }

    function showNextTestimonial() {
      goToTestimonial((currentTestimonial + 1) % testimonialCards.length);
    }

    function startTestimonialTimer() {
      clearInterval(testimonialTimer);
      testimonialTimer = setInterval(showNextTestimonial, testimonialInterval);
    }

    testimonialDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const index = parseInt(dot.dataset.index, 10);
        if (!Number.isNaN(index)) {
          goToTestimonial(index);
          startTestimonialTimer();
        }
      });
    });

    startTestimonialTimer();
  }

  // ===================================
  // Mobile Marquee — pause when off-screen
  // ===================================
  const ITEM_W = 200;
  const GAP = 15;

  if (window.innerWidth <= 768 && !prefersReducedMotion) {
    document.querySelectorAll(".custom-grid-wrapper").forEach((grid) => {
      const origItems = Array.from(grid.children);
      const n = origItems.length;

      origItems.forEach((item) => {
        item.style.width = ITEM_W + "px";
      });

      origItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.style.width = ITEM_W + "px";
        grid.appendChild(clone);
      });

      const halfWidth = n * ITEM_W + (n - 1) * GAP;

      grid.style.cssText = [
        "display:flex",
        "flex-wrap:nowrap",
        "gap:" + GAP + "px",
        "will-change:transform",
        "touch-action:pan-y",
      ].join(";");

      let offset = 0;
      let paused = false;
      let touchPaused = false;
      let inViewport = true;

      const tick = () => {
        if (!paused && !touchPaused && inViewport) {
          offset += 0.4;
          if (offset >= halfWidth + GAP) offset -= halfWidth + GAP;
          grid.style.transform = "translateX(-" + offset + "px)";
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      const wrap = grid.closest(".ourcrafsld");
      if (wrap) {
        wrap.addEventListener("touchstart", () => {
          touchPaused = true;
        }, { passive: true });
        wrap.addEventListener("touchend", () => {
          touchPaused = false;
        }, { passive: true });
        wrap.addEventListener("touchcancel", () => {
          touchPaused = false;
        }, { passive: true });

        const marqueeObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              inViewport = entry.isIntersecting;
            });
          },
          { threshold: 0.05 },
        );
        marqueeObserver.observe(wrap);
      }

      document.addEventListener("visibilitychange", () => {
        paused = document.hidden;
      });
    });
  }

  document.body.classList.add("loaded");
});
