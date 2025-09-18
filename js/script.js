// IUPMC 2025 Conference Website JavaScript - Enhanced Mobile Version
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu elements
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const topNav = document.getElementById("topNav");
  const menuOverlay = document.getElementById("menuOverlay");
  const sidebar = document.getElementById("sidebar");
  const sidebarClose = document.getElementById("sidebarClose");

  // Sidebar navigation elements
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
  const sections = document.querySelectorAll(".content-section");

  // Mobile Menu Toggle Functionality
  function toggleMobileMenu() {
    const isActive = topNav.classList.contains("active");

    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    topNav.classList.add("active");
    menuOverlay.classList.add("active");
    mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    topNav.classList.remove("active");
    menuOverlay.classList.remove("active");
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = "";
  }

  // Mobile Sidebar Toggle Functionality
  function toggleSidebar() {
    const isActive = sidebar.classList.contains("active");

    if (isActive) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function openSidebar() {
    sidebar.classList.add("active");
    menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Event Listeners for Mobile Menu
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", function () {
      closeMobileMenu();
      closeSidebar();
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar);
  }

  // Close mobile menu when clicking on nav links
  const topNavLinks = topNav.querySelectorAll("a");
  topNavLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Handle sidebar navigation clicks
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Close sidebar on mobile when link is clicked
      if (window.innerWidth <= 768) {
        closeSidebar();
      }

      // Remove active class from all links
      sidebarLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Get target section
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Calculate offset for sticky header
        const headerHeight = document.querySelector(".top-header").offsetHeight;
        const offset = targetSection.offsetTop - headerHeight - 20;

        // Smooth scroll to section
        window.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      }
    });
  });

  // Update active link based on scroll position
  function updateActiveLink() {
    let current = "";
    const scrollPos = window.scrollY + 150; // Offset for header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    // Update active link
    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  // Listen for scroll events with throttling
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initialize active link on page load
  updateActiveLink();

  // Animate cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all cards for animation
  const cards = document.querySelectorAll(
    ".track-card, .speaker-card, .date-item, .fee-card"
  );
  cards.forEach((card) => {
    observer.observe(card);
  });

  // Add animation styles dynamically
  const style = document.createElement("style");
  style.textContent = `
        .track-card, .speaker-card, .date-item, .fee-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .track-card.animate-in, .speaker-card.animate-in, 
        .date-item.animate-in, .fee-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .content-section {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
  document.head.appendChild(style);

  // Handle window resize events
  function handleResize() {
    const width = window.innerWidth;

    // Close mobile menus when resizing to desktop
    if (width > 768) {
      closeMobileMenu();
      closeSidebar();

      // Reset sidebar styles for desktop
      sidebar.style.display = "";
      sidebar.style.transform = "";
    }
  }

  // Listen for window resize
  window.addEventListener("resize", handleResize);

  // Add click effects to buttons and links
  document.addEventListener("click", function (e) {
    if (e.target.matches("a, button")) {
      // Add ripple effect
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      // Position the ripple relative to the click
      const rect = e.target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 1;
            `;

      e.target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
  });

  // Add ripple animation styles
  const rippleStyle = document.createElement("style");
  rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        a, button {
            position: relative;
            overflow: hidden;
        }
    `;
  document.head.appendChild(rippleStyle);

  // Lazy loading for images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Enhanced loading animation
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");

    // Add loaded styles
    const loadedStyle = document.createElement("style");
    loadedStyle.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            body.loaded {
                opacity: 1;
            }
        `;
    document.head.appendChild(loadedStyle);
  });

  // Keyboard navigation support
  document.addEventListener("keydown", function (e) {
    // Close menus with Escape key
    if (e.key === "Escape") {
      closeMobileMenu();
      closeSidebar();
    }
  });

  // Touch gesture support for mobile sidebar
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchStartX - touchEndX;

    // Only handle swipes on mobile
    if (window.innerWidth <= 768) {
      // Swipe left to close sidebar
      if (diff > swipeThreshold && sidebar.classList.contains("active")) {
        closeSidebar();
      }
      // Swipe right to open sidebar (from left edge)
      else if (
        diff < -swipeThreshold &&
        touchStartX < 50 &&
        !sidebar.classList.contains("active")
      ) {
        openSidebar();
      }
    }
  }

  // Smooth scroll behavior for all internal links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerHeight = document.querySelector(".top-header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Console message for developers
  console.log("🎉 IUPMC 2025 Conference Website Loaded Successfully!");
  console.log("📱 Enhanced Mobile Experience Enabled");
  console.log("📅 Date: 13 December 2025");
  console.log("📍 Location: Islamic University, Najaf, Iraq");

  // Performance monitoring
  if ("performance" in window) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        const perfData = performance.getEntriesByType("navigation")[0];
        console.log(
          `⚡ Page loaded in ${Math.round(
            perfData.loadEventEnd - perfData.fetchStart
          )}ms`
        );
      }, 0);
    });
  }
});
