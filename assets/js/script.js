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

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinksContainer.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
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

    console.log("Slider: Initializing with 3s interval. Found", slides.length, "slides.");

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
      
      console.log(`Slider: Moved from ${oldSlide} to ${currentSlide} at ${new Date().toLocaleTimeString()}`);
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
  // Scroll Fade-In Animation (Intersection Observer)
  // ===================================
  const fadeElements = document.querySelectorAll(".fade-in-up");
  if (fadeElements.length > 0) {
    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
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
        window.scrollTo({ top: targetSection.offsetTop - 80, behavior: "smooth" });
      }
    });
  });

  // Global Hover Transitions
  const hoverElements = document.querySelectorAll(".cta-button, .product-card, .category-card");
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

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
