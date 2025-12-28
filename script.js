// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });

    // Smooth Scrolling for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Contact Page Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Handle URL parameters for contact page tabs
    const urlParams = new URLSearchParams(window.location.search);
    const contactType = urlParams.get('type');

    if (contactType) {
        // Find the tab button for the specified type
        const targetButton = document.querySelector(`[data-tab="${contactType}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }

    // Form Submission Handlers
    const writeForm = document.getElementById('writeForm');
    if (writeForm) {
        writeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmit(this, 'write');
        });
    }

    const collaborateForm = document.getElementById('collaborateForm');
    if (collaborateForm) {
        collaborateForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmit(this, 'collaborate');
        });
    }

    // Pathway Cards Animation on Scroll
    const pathwayCards = document.querySelectorAll('.pathway-card');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    pathwayCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Pathway Items Animation
    const pathwayItems = document.querySelectorAll('.pathway-item');

    pathwayItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

// Form Submission Handler
async function handleFormSubmit(form, type) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    const action = form.getAttribute('action');

    // Check if the placeholder is still there
    if (!action || action.includes('YOUR_FORM_ID')) {
        alert('Please update the form action in contact.html with your Formspree form ID.');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const formWrapper = form.parentElement;
        // Remove any existing messages
        const existingMessages = formWrapper.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 600;
        `;

        if (response.ok) {
            messageDiv.className = 'success-message';
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';

            if (type === 'write') {
                messageDiv.textContent = 'Thank you for your message! We will get back to you soon.';
            } else if (type === 'collaborate') {
                messageDiv.textContent = 'Thank you for your collaboration proposal! We will review it and contact you shortly.';
            }

            form.reset();
        } else {
            throw new Error('Form submission failed');
        }

        formWrapper.appendChild(messageDiv);

        // Remove success message after 5 seconds
        if (response.ok) {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }

    } catch (error) {
        const formWrapper = form.parentElement;
        const messageDiv = document.createElement('div');
        messageDiv.className = 'error-message';
        messageDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 600;
        `;
        messageDiv.textContent = 'Oops! There was a problem submitting your form. Please try again later.';
        formWrapper.appendChild(messageDiv);
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Navbar scroll effect - add scrolled class and change background
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add active state to current page in navigation
const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentLocation ||
        (currentLocation === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    }
});

// Lazy loading for images (when actual images are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Parallax effect removed - hero content stays in place

// Add hover effect enhancement for pathway cards
document.addEventListener('DOMContentLoaded', function () {
    const pathwayCards = document.querySelectorAll('.pathway-card');

    pathwayCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.borderColor = '#efcd4c';
        });

        card.addEventListener('mouseleave', function () {
            this.style.borderColor = '#efcd4c';
        });
    });
});

// Add smooth fade-in effect for sections
const fadeInElements = document.querySelectorAll('.vm-card, .founder-content, .cta-section');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeInElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeInObserver.observe(element);
});
