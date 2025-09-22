// Contact Form JavaScript - IUPMC 2025
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("form-status");
  const submitBtn = contactForm.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnIcon = submitBtn.querySelector(".btn-icon");

  // Form submission handler
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);

    // Show loading state
    showLoadingState();

    try {
      // Submit to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showSuccessMessage();
        contactForm.reset();
      } else {
        showErrorMessage(
          "There was an error sending your message. Please try again."
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      hideLoadingState();
    }
  });

  // Show loading state
  function showLoadingState() {
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    btnText.textContent = "Sending...";
    btnIcon.className = "fas fa-spinner btn-icon";
    formStatus.className = "form-status loading";
    formStatus.textContent = "Sending your message...";
  }

  // Hide loading state
  function hideLoadingState() {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    btnText.textContent = "Send Message";
    btnIcon.className = "fas fa-paper-plane btn-icon";
  }

  // Show success message
  function showSuccessMessage() {
    formStatus.className = "form-status success";
    formStatus.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Message sent successfully!</strong><br>
            Thank you for contacting IUPMC 2025. We'll get back to you within 24 hours.
        `;

    // Auto-hide success message after 8 seconds
    setTimeout(() => {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }, 8000);
  }

  // Show error message
  function showErrorMessage(message) {
    formStatus.className = "form-status error";
    formStatus.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <strong>Error:</strong> ${message}
        `;

    // Auto-hide error message after 10 seconds
    setTimeout(() => {
      formStatus.textContent = "";
      formStatus.className = "form-status";
    }, 10000);
  }

  // Form validation enhancements
  const requiredFields = contactForm.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    field.addEventListener("blur", function () {
      validateField(field);
    });

    field.addEventListener("input", function () {
      // Remove error styling when user starts typing
      if (field.classList.contains("error")) {
        field.classList.remove("error");
        const errorMessage = field.parentNode.querySelector(".error-message");
        if (errorMessage) {
          errorMessage.remove();
        }
      }
    });
  });

  // Field validation function
  function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = "";

    // Check if required field is empty
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }
    // Email validation
    else if (fieldType === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
    }
    // Phone validation (basic)
    else if (fieldType === "tel" && value) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid phone number";
      }
    }

    // Apply validation styling
    if (!isValid) {
      showFieldError(field, errorMessage);
    } else {
      clearFieldError(field);
    }

    return isValid;
  }

  // Show field error
  function showFieldError(field, message) {
    field.classList.add("error");

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
  }

  // Clear field error
  function clearFieldError(field) {
    field.classList.remove("error");
    const errorMessage = field.parentNode.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  // Validate entire form before submission
  function validateForm() {
    let isFormValid = true;

    requiredFields.forEach((field) => {
      if (!validateField(field)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  // Enhanced form submission with validation
  const originalSubmitHandler = contactForm.onsubmit;
  contactForm.addEventListener("submit", function (e) {
    if (!validateForm()) {
      e.preventDefault();
      showErrorMessage("Please correct the errors below before submitting.");

      // Scroll to first error field
      const firstErrorField = contactForm.querySelector(".error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstErrorField.focus();
      }
    }
  });

  // Auto-resize textarea
  const messageTextarea = document.getElementById("message");
  if (messageTextarea) {
    messageTextarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  }

  // Character counter for message field
  if (messageTextarea) {
    const maxLength = 1000;
    const counterElement = document.createElement("div");
    counterElement.className = "character-counter";
    messageTextarea.parentNode.appendChild(counterElement);

    function updateCharacterCount() {
      const currentLength = messageTextarea.value.length;
      counterElement.textContent = `${currentLength}/${maxLength} characters`;

      if (currentLength > maxLength * 0.9) {
        counterElement.style.color = "#dc2626";
      } else if (currentLength > maxLength * 0.7) {
        counterElement.style.color = "#f59e0b";
      } else {
        counterElement.style.color = "#6b7280";
      }
    }

    messageTextarea.addEventListener("input", updateCharacterCount);
    updateCharacterCount(); // Initial count
  }

  // Smooth scroll for quick links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href.startsWith("#") && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  // Add loading animation styles dynamically
  const style = document.createElement("style");
  style.textContent = `
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border-color: #dc2626;
            background-color: #fef2f2;
        }
        
        .error-message {
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        }
        
        .character-counter {
            text-align: right;
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 0.25rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .form-status {
            animation: fadeIn 0.3s ease-out;
        }
        
        .quick-link-card:hover {
            animation: pulse 0.3s ease-in-out;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
  document.head.appendChild(style);

  // Console message for developers
  console.log("🎉 IUPMC 2025 Contact Form Loaded Successfully!");
  console.log("📧 Form integrated with Web3Forms");
  console.log("✨ Enhanced validation and UX features enabled");

  // Performance monitoring
  if ("performance" in window) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        const perfData = performance.getEntriesByType("navigation")[0];
        console.log(
          `⚡ Contact page loaded in ${Math.round(
            perfData.loadEventEnd - perfData.fetchStart
          )}ms`
        );
      }, 0);
    });
  }
});
