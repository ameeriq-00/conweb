// IUPMC 2025 Conference Website JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for sidebar navigation
  const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
  const sections = document.querySelectorAll(".content-section");

  // Handle sidebar navigation clicks
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

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

  // Listen for scroll events
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

  // Add animation styles
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

  // Mobile menu functionality for smaller screens
  function handleMobileMenu() {
    const sidebar = document.querySelector(".sidebar");
    const content = document.querySelector(".content");

    if (window.innerWidth <= 768) {
      // Create mobile menu toggle if it doesn't exist
      let menuToggle = document.querySelector(".mobile-menu-toggle");
      if (!menuToggle) {
        menuToggle = document.createElement("button");
        menuToggle.className = "mobile-menu-toggle";
        menuToggle.innerHTML = "☰ Menu";
        menuToggle.style.cssText = `
                    position: fixed;
                    top: 80px;
                    left: 20px;
                    z-index: 1000;
                    background: #1e3a8a;
                    color: white;
                    border: none;
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                `;
        document.body.appendChild(menuToggle);

        // Toggle sidebar visibility
        menuToggle.addEventListener("click", function () {
          sidebar.style.display =
            sidebar.style.display === "block" ? "none" : "block";
          if (sidebar.style.display === "block") {
            sidebar.style.position = "fixed";
            sidebar.style.top = "120px";
            sidebar.style.left = "20px";
            sidebar.style.zIndex = "999";
            sidebar.style.maxHeight = "calc(100vh - 140px)";
            sidebar.style.overflowY = "auto";
          }
        });

        // Hide sidebar when clicking outside
        document.addEventListener("click", function (e) {
          if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.style.display = "none";
          }
        });
      }
    } else {
      // Remove mobile menu toggle on larger screens
      const menuToggle = document.querySelector(".mobile-menu-toggle");
      if (menuToggle) {
        menuToggle.remove();
      }
      sidebar.style.display = "";
      sidebar.style.position = "";
      sidebar.style.top = "";
      sidebar.style.left = "";
      sidebar.style.zIndex = "";
    }
  }

  // Handle window resize
  window.addEventListener("resize", handleMobileMenu);
  handleMobileMenu(); // Initial call

  // Add click effects to buttons and links
  document.addEventListener("click", function (e) {
    if (e.target.matches("a, button")) {
      // Add ripple effect
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      e.target.appendChild(ripple);

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
            `;

      setTimeout(() => ripple.remove(), 600);
    }
  });

  // Add ripple animation
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

  // Lazy loading for any images (if added later)
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

  // Add loading animation for the page
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

  // Console message for developers
  console.log("🎉 IUPMC 2025 Conference Website Loaded Successfully!");
  console.log("📅 Date: 13 December 2025");
  console.log("📍 Location: Islamic University, Najaf, Iraq");
});
