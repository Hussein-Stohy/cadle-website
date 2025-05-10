// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);

    // Remove loading animation after page load
    window.addEventListener('load', function() {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 500);
    });

    // Header scroll effect
    const header = document.querySelector('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for styling
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });

    // Progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form validation and submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Real-time validation
        const validateField = (field, validationFn, errorElement) => {
            const isValid = validationFn(field.value);
            errorElement.classList.toggle('hidden', isValid);
            field.classList.toggle('border-red-500', !isValid);
            field.classList.toggle('border-green-500', isValid && field.value.length > 0);
            return isValid;
        };

        const validations = {
            name: (value) => value.length >= 3,
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            phone: (value) => !value || /^[+]?[\d\s-]{10,}$/.test(value),
            message: (value) => value.length >= 10
        };

        // Add real-time validation listeners
        Object.keys(validations).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const errorElement = document.getElementById(`${fieldName}-error`);
            if (field && errorElement) {
                field.addEventListener('input', () => {
                    validateField(field, validations[fieldName], errorElement);
                });
            }
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            Object.keys(validations).forEach(fieldName => {
                const field = document.getElementById(fieldName);
                const errorElement = document.getElementById(`${fieldName}-error`);
                if (field && errorElement) {
                    if (!validateField(field, validations[fieldName], errorElement)) {
                        isValid = false;
                    }
                }
            });

            if (!isValid) {
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

            try {
                // Here you would typically send the form data to your backend
                // For now, we'll simulate a successful submission
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message with animation
                const successMessage = document.getElementById('form-success');
                successMessage.classList.remove('hidden');
                successMessage.classList.add('animate-fade-in');

                // Reset form
                contactForm.reset();
                Object.keys(validations).forEach(fieldName => {
                    const field = document.getElementById(fieldName);
                    if (field) {
                        field.classList.remove('border-red-500', 'border-green-500');
                    }
                });

                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('animate-fade-out');
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                        successMessage.classList.remove('animate-fade-out');
                    }, 500);
                }, 5000);
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'mt-4 p-3 bg-red-100 text-red-700 rounded-lg animate-fade-in';
                errorMessage.textContent = 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.';
                contactForm.appendChild(errorMessage);
                setTimeout(() => errorMessage.remove(), 5000);
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // Testimonial carousel
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;

    function updateTestimonialCarousel() {
        const slideWidth = testimonialCarousel.querySelector('.testimonial-slide').offsetWidth;
        testimonialCarousel.scrollTo({
            left: currentSlide * slideWidth,
            behavior: 'smooth'
        });
        
        testimonialDots.forEach((dot, index) => {
            dot.classList.toggle('bg-blue-700', index === currentSlide);
            dot.classList.toggle('bg-blue-300', index !== currentSlide);
        });
    }

    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateTestimonialCarousel();
        });
    });

    // Auto-advance testimonials
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialDots.length;
        updateTestimonialCarousel();
    }, 5000);

    // Add animation classes on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animate');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]');
            const successMessage = document.getElementById('newsletter-success');
            const errorMessage = document.getElementById('newsletter-error');
            
            if (!email.value) {
                errorMessage.textContent = 'الرجاء إدخال البريد الإلكتروني';
                errorMessage.classList.remove('hidden');
                return;
            }
            
            try {
                // Here you would typically send the email to your backend
                // For now, we'll simulate a successful subscription
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                successMessage.classList.remove('hidden');
                errorMessage.classList.add('hidden');
                email.value = '';
                
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
            } catch (error) {
                errorMessage.textContent = 'حدث خطأ، يرجى المحاولة مرة أخرى';
                errorMessage.classList.remove('hidden');
                successMessage.classList.add('hidden');
                
                setTimeout(() => {
                    errorMessage.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // Performance Optimizations
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Defer non-critical CSS
    const nonCriticalCSS = document.createElement('link');
    nonCriticalCSS.rel = 'stylesheet';
    nonCriticalCSS.href = 'css/non-critical.css';
    nonCriticalCSS.media = 'print';
    nonCriticalCSS.onload = function() {
        this.media = 'all';
    };
    document.head.appendChild(nonCriticalCSS);

    // Preload critical assets
    const preloadLinks = [
        { rel: 'preload', href: 'images/icon.jpg', as: 'image' },
        { rel: 'preload', href: 'fonts/Tajawal-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: true }
    ];

    preloadLinks.forEach(link => {
        const preloadLink = document.createElement('link');
        Object.assign(preloadLink, link);
        document.head.appendChild(preloadLink);
    });
});
