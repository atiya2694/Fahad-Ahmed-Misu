// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('nav-open');
        hamburger.classList.toggle('active');
        // accessibility attributes
        const opened = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', opened);
        navMenu.setAttribute('aria-hidden', !opened);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            // Close only on mobile to avoid hiding desktop navigation.
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('nav-open');
                hamburger.classList.remove('active');
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('nav-open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', false);
            navMenu.setAttribute('aria-hidden', true);
        }
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';

            setTimeout(() => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.pointerEvents = 'auto';
                    }, 10);
                } else {
                    item.style.display = 'none';
                }
            }, 300);
        });
    });
});

// Add Navigation Active State on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe portfolio items for animation
document.querySelectorAll('.portfolio-item, .service-card, .blog-card').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Contact Form Submission with EmailJS
(function () {
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;

    const showContactToast = (message, type = 'success') => {
        let toast = document.querySelector('.contact-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'contact-toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.dataset.type = type;
        toast.classList.add('show');

        window.clearTimeout(showContactToast.timer);
        showContactToast.timer = window.setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    };

    if (!window.emailjs) {
        console.error('EmailJS library did not load.');
        showContactToast('Email service is not available right now. Please use WhatsApp or email directly.', 'error');
        return;
    }

    emailjs.init('4USPOij5z0peTV_zq');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const serviceId = 'service_rlsxmly';
        const templateId = 'template_atx6rej';

        emailjs.sendForm(serviceId, templateId, contactForm)
            .then(() => {
                contactForm.reset();
                showContactToast('Message sent successfully. I will reply soon.', 'success');
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                showContactToast('Message could not be sent. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
})();

// Lazy Load Images
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
});

images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
});

// Add some visual feedback
console.log('🚀 Portfolio website loaded successfully!');

// Hero background slider with controls and dots
(function () {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.hero-dots');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    if (!slides || slides.length === 0) return;

    // Adjustable interval (ms) — tweak by setting window.HERO_SLIDE_INTERVAL before this script
    window.HERO_SLIDE_INTERVAL = window.HERO_SLIDE_INTERVAL || 6000;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = 0;
    let timer = null;

    function show(index) {
        index = (index + slides.length) % slides.length;
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        if (dotsContainer) {
            dotsContainer.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', i === index));
        }
        current = index;
    }

    // build dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = i === 0 ? 'dot active' : 'dot';
            btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
            btn.addEventListener('click', () => { show(i); resetTimer(); });
            dotsContainer.appendChild(btn);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { show(current - 1); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { show(current + 1); resetTimer(); });

    function startTimer() {
        if (prefersReduced) return;
        timer = setInterval(() => { show(current + 1); }, window.HERO_SLIDE_INTERVAL);
    }

    function resetTimer() {
        if (timer) clearInterval(timer);
        startTimer();
    }

    show(0);
    startTimer();

    // pause on hover/focus for accessibility
    const heroEl = document.querySelector('.hero');
    [heroEl, prevBtn, nextBtn, dotsContainer].forEach(el => {
        if (!el) return;
        el.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
        el.addEventListener('mouseleave', () => { resetTimer(); });
        el.addEventListener('focusin', () => { if (timer) clearInterval(timer); });
        el.addEventListener('focusout', () => { resetTimer(); });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (timer) clearInterval(timer);
        } else {
            resetTimer();
        }
    });
})();
