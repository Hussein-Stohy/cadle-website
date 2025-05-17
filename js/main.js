document.addEventListener("DOMContentLoaded", function () {
  // Loading Animation
  const loading = document.createElement("div");
  loading.className = "loading";
  loading.innerHTML = '<div class="loading-spinner"></div>';
  document.body.appendChild(loading);

  window.addEventListener("load", function () {
    loading.style.opacity = "0";
    setTimeout(() => loading.remove(), 500);
  });

  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        !mobileMenu.contains(event.target) &&
        !mobileMenuButton.contains(event.target)
      ) {
        mobileMenu.classList.remove("active");
      }
    });
  }

  // Progress Bar
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", function () {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.scrollY;
    const progress = (scrollTop / documentHeight) * 100;
    progressBar.style.width = progress + "%";
  });

  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Form Validation
  document.addEventListener("DOMContentLoaded", function () {
    // تحديد المنطقة الزمنية تلقائياً
    const timezoneInput = document.getElementById("timezone");
    if (timezoneInput) {
      timezoneInput.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
      const validateField = (field, validationFn, errorElement) => {
        const isValid = validationFn(field.value);
        errorElement.classList.toggle("hidden", isValid);
        field.classList.toggle("border-red-500", !isValid);
        field.classList.toggle(
          "border-green-500",
          isValid && field.value.length > 0
        );
        return isValid;
      };

      const validations = {
        name: (value) => value.length >= 3,
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => !value || /^[+]?[\d\s-]{10,}$/.test(value),
        message: (value) => value.length >= 10,
      };

      Object.keys(validations).forEach((fieldName) => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (field && errorElement) {
          field.addEventListener("input", () => {
            validateField(field, validations[fieldName], errorElement);
          });
        }
      });

      contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        let isValid = true;
        Object.keys(validations).forEach((fieldName) => {
          const field = document.getElementById(fieldName);
          const errorElement = document.getElementById(`${fieldName}-error`);
          if (field && errorElement) {
            if (!validateField(field, validations[fieldName], errorElement)) {
              isValid = false;
            }
          }
        });

        if (!isValid) return;

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

        try {
          const formData = new FormData(contactForm);
          const response = await fetch(contactForm.action, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
          });

          if (response.ok) {
            const successMessage = document.getElementById("form-success");
            successMessage.classList.remove("hidden", "animate-fade-out");
            successMessage.classList.add("animate-fade-in");

            contactForm.reset();
            Object.keys(validations).forEach((fieldName) => {
              const field = document.getElementById(fieldName);
              if (field) {
                field.classList.remove("border-red-500", "border-green-500");
              }
            });

            setTimeout(() => {
              successMessage.classList.add("animate-fade-out");
              setTimeout(() => {
                successMessage.classList.add("hidden");
                successMessage.classList.remove("animate-fade-out");
              }, 500);
            }, 5000);
          } else {
            throw new Error("Form submission failed");
          }
        } catch (error) {
          const errorMessage = document.createElement("div");
          errorMessage.className =
            "mt-4 p-3 bg-red-100 text-red-700 rounded-lg animate-fade-in";
          errorMessage.textContent =
            "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.";
          contactForm.appendChild(errorMessage);
          setTimeout(() => errorMessage.remove(), 5000);
        } finally {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
        }
      });
    }
  });

  // Testimonials Carousel
  const testimonialCarousel = document.querySelector(".testimonial-carousel");
  const testimonialDots = document.querySelectorAll(".testimonial-dot");
  let currentSlide = 0;

  function updateTestimonialCarousel() {
    if (!testimonialCarousel) return;

    const slide = testimonialCarousel.querySelector(".testimonial-slide");
    if (!slide) return;

    const slideWidth = slide.offsetWidth;
    testimonialCarousel.scrollTo({
      left: currentSlide * slideWidth,
      behavior: "smooth",
    });

    testimonialDots.forEach((dot, index) => {
      dot.classList.toggle("bg-blue-700", index === currentSlide);
      dot.classList.toggle("bg-blue-300", index !== currentSlide);
    });
  }

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateTestimonialCarousel();
    });
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialDots.length;
    updateTestimonialCarousel();
  }, 5000);

  // Animate on Scroll
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      if (elementTop < window.innerHeight && elementBottom > 0) {
        element.classList.add("animate");
      }
    });
  };
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll();

  // Newsletter Form
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]');
      const successMessage = document.getElementById("newsletter-success");
      const errorMessage = document.getElementById("newsletter-error");

      if (!email.value) {
        errorMessage.textContent = "الرجاء إدخال البريد الإلكتروني";
        errorMessage.classList.remove("hidden");
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        successMessage.classList.remove("hidden");
        errorMessage.classList.add("hidden");
        email.value = "";
        setTimeout(() => successMessage.classList.add("hidden"), 5000);
      } catch (error) {
        errorMessage.textContent = "حدث خطأ، يرجى المحاولة مرة أخرى";
        errorMessage.classList.remove("hidden");
        successMessage.classList.add("hidden");
        setTimeout(() => errorMessage.classList.add("hidden"), 5000);
      }
    });
  }

  // Lazy Load Images
  const lazyImages = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });
  lazyImages.forEach((img) => imageObserver.observe(img));
});
