/* ===================================
   DP Jewellers - Main JavaScript
   =================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("DP Jewellers Script Initializing...");

  // ===================================
  // Navbar & Navigation
  // ===================================
  const navbar = document.getElementById("navbar");
  const header = document.querySelector(".main-header");
  const navLinks = document.querySelectorAll(".nav-link");
  const hamburger = document.getElementById("hamburger");
  const navLinksContainer = document.getElementById("navLinks");
  const sections = document.querySelectorAll("section[id]");

  // Navbar Scroll Behavior
  if (navbar && header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
        header.classList.add("is-sticky");
      } else {
        navbar.classList.remove("scrolled");
        header.classList.remove("is-sticky");
      }
    });
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
        // Don't close menu if clicking a dropdown toggle
        if (link.parentElement.classList.contains('has-dropdown')) {
          e.preventDefault();
          link.parentElement.classList.toggle('active');
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

  // Active Navigation Link on Scroll
  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }
  if (sections.length > 0) {
    window.addEventListener("scroll", updateActiveLink);
  }

  // ===================================
  // Hero Slider logic (Ultra-Stable Version)
  // ===================================
  const sliderSection = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  if (sliderSection && slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 3000; // Increased to 3 seconds for stability

    console.log(
      "Slider: Initializing with 3s interval. Found",
      slides.length,
      "slides.",
    );

    function nextSlide() {
      const oldSlide = currentSlide;
      // Remove active class from current slide and dot
      slides[currentSlide].classList.remove("active");
      if (dots[currentSlide]) dots[currentSlide].classList.remove("active");

      // Move to next slide
      currentSlide = (currentSlide + 1) % slides.length;

      // Add active class to new slide and dot
      slides[currentSlide].classList.add("active");
      if (dots[currentSlide]) dots[currentSlide].classList.add("active");

      console.log(
        `Slider: Moved from ${oldSlide} to ${currentSlide} at ${new Date().toLocaleTimeString()}`,
      );
    }

    function goToSlide(index) {
      if (index === currentSlide) return;
      console.log("Slider: Manually going to slide", index);
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
      console.log("Slider: Interval started.");
    }

    function stopSliderInterval() {
      if (slideInterval) {
        clearInterval(slideInterval);
        console.log("Slider: Interval stopped.");
      }
    }

    function resetSliderInterval() {
      stopSliderInterval();
      startSliderInterval();
    }

    // Dot Click Event
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));
    });

    // Provide a global way to trigger next slide for manual testing
    window.forceSliderNext = nextSlide;

    // Initial Start after a short delay to ensure everything is settled
    setTimeout(startSliderInterval, 500);
  }

  // ===================================
  // Header Scroll Effect
  // ===================================
  // The 'header' variable is already declared globally at the top of the DOMContentLoaded listener.
  // The 'header' scroll behavior is already handled in the 'Navbar Scroll Behavior' section.
  // This block is redundant if the existing 'Navbar Scroll Behavior' is intended to cover the header's 'scrolled' class.
  // If this is meant to be a separate, additional effect, ensure 'header' is not re-declared.
  // For now, assuming this is an *additional* effect or a refactoring, and keeping the original header declaration.
  // If the intent is to replace the header part of 'Navbar Scroll Behavior', that section should be modified.
  // As per instruction, adding this block as provided.
  // Note: The original 'Navbar Scroll Behavior' also adds/removes 'is-sticky'. This new block only handles 'scrolled'.
  // If the goal is to consolidate, the existing 'Navbar Scroll Behavior' should be updated.
  // For now, faithfully adding the provided code.
  // const header = document.querySelector(".main-header"); // Already declared at the top
  if (header) { // Check if header exists to prevent errors
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
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

      // Dot follows immediately
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Outline follows with slight delay (animation in CSS)
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });
  }

  // ===================================
  // Scroll Fade-In Animation (Intersection Observer)
  // ===================================
  const fadeElements = document.querySelectorAll(".fade-in-up, .reveal-on-scroll");
  if (fadeElements.length > 0) {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    };
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 100);
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    fadeElements.forEach((element) => fadeInObserver.observe(element));
  }

  // ===================================
  // Interactive Elements & Buttons
  // ===================================
  // Wishlist Button
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

  // Newsletter Form
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

  // Scroll To Top
  const scrollToTopBtn = document.getElementById("scrollToTop");
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Smooth Scroll for Anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Global Hover Transitions
  const hoverElements = document.querySelectorAll(
    ".cta-button, .product-card, .category-card",
  );
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

  // ===================================
  // Testimonials Slider (Auto-Rotate Every 10 Seconds)
  // ===================================
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  if (testimonialCards.length > 0) {
    let currentTestimonial = 0;
    const testimonialInterval = 10000; // 10 seconds
    const transitionDelay = 300; // Small delay to ensure smooth transition

    function showNextTestimonial() {
      // Remove active class from current testimonial
      testimonialCards[currentTestimonial].classList.remove("active");

      // Wait for fade-out to complete before showing next
      setTimeout(() => {
        // Move to next testimonial
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;

        // Add active class to new testimonial
        testimonialCards[currentTestimonial].classList.add("active");
      }, transitionDelay);
    }

    // Initialize: Show first testimonial
    if (testimonialCards[0]) {
      testimonialCards[0].classList.add("active");
    }

    // Start auto-rotation
    setInterval(showNextTestimonial, testimonialInterval);
  }

  // ===================================
  // Mobile Marquee: JS rAF-based (zero touch conflict)
  // ===================================
  if (window.innerWidth <= 768) {
    const grids = document.querySelectorAll(".custom-grid-wrapper");
    grids.forEach((grid) => {
      // 1. Clone items for seamless loop
      const origItems = Array.from(grid.children);
      origItems.forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        grid.appendChild(clone);
      });

      // 2. Measure half-width (the original set width)
      //    We do this after cloning so layout is correct
      let halfWidth = 0;
      const measureHalf = () => {
        let w = 0;
        origItems.forEach(item => { w += item.offsetWidth + 15; }); // 15 = gap
        halfWidth = w;
      };
      measureHalf();
      window.addEventListener("resize", measureHalf, { passive: true });

      // 3. Set the grid to flex with no overflow issues
      grid.style.display = "flex";
      grid.style.gap = "15px";
      grid.style.flexWrap = "nowrap";
      grid.style.willChange = "transform";

      // 4. Run rAF loop
      let offset = 0;
      let paused = false;
      let rafId;

      const tick = () => {
        if (!paused) {
          offset += 0.5; // px per frame (~30px/s at 60fps)
          if (halfWidth > 0 && offset >= halfWidth) {
            offset -= halfWidth; // seamless wrap
          }
          grid.style.transform = `translateX(-${offset}px)`;
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      // 5. Pause while user actively touches the section (optional UX)
      const section = grid.closest(".ourcrafsld");
      if (section) {
        section.addEventListener("touchstart", () => { paused = true; }, { passive: true });
        section.addEventListener("touchend",   () => { paused = false; }, { passive: true });
      }
    });
  } else {
    // Desktop: original simple flex grid, no marquee
    const grids = document.querySelectorAll(".custom-grid-wrapper");
    grids.forEach((grid) => {
      grid.style.display = "flex";
      grid.style.flexWrap = "wrap";
      grid.style.gap = "15px";
    });
  }

  // Loading indicator
  document.body.classList.add("loaded");

  console.log(`
╔══════════════════════════════════════╗
║                                      ║
║         DP JEWELLERS                 ║
║    Where Elegance Meets Eternity     ║
║                                      ║
╚══════════════════════════════════════╝
  `);
});
