// ============================================
// DOM Elements
// ============================================
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('back-to-top');
const typedText = document.querySelector('.typed-text');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.getElementById('contact-form');
const scrollProgress = document.getElementById('scroll-progress');
const themeToggle = document.getElementById('theme-toggle');
const langBtns = document.querySelectorAll('.lang-btn');
const langThumb = document.querySelector('.lang-thumb');
const root = document.documentElement;
const skillsCategories = document.querySelectorAll('.skills-category');

// Respect the visitor's motion preference for the pointer-driven effects
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// Loader
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }, 1000);
});

// ============================================
// Navbar Scroll Effect
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (currentScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // Reading progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.setProperty('--progress', docHeight > 0 ? currentScroll / docHeight : 0);

    // Update active nav link based on section
    updateActiveNavLink();
    
    lastScroll = currentScroll;
});

// ============================================
// Mobile Menu
// ============================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Close menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// ============================================
// Active Nav Link on Scroll
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// Typing Effect
// ============================================
let words = TRANSLATIONS.en.typed;
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        typedText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typedText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 500; // Pause before typing new word
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
setTimeout(typeEffect, 1500);

// ============================================
// Scroll Reveal Animation
// ============================================
function reveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// ============================================
// Skill Bars Animation
// ============================================
function animateSkillBars() {
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        const windowHeight = window.innerHeight;
        const elementTop = bar.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            bar.style.setProperty('--progress', `${progress}%`);
            bar.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// ============================================
// Projects Filter
// ============================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shows = filter === 'all' || category === filter;

            card.style.opacity = '0';

            setTimeout(() => {
                card.classList.toggle('hidden', !shows);
                if (shows) {
                    // next frame, so the fade-in actually animates
                    requestAnimationFrame(() => { card.style.opacity = '1'; });
                }
            }, 260);
        });
    });
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Back to Top Button
// ============================================
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// Contact Form
// ============================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + t('form.sending');
    btn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> ' + t('form.sent');
        btn.style.background = 'linear-gradient(120deg, #34d399, #22d3ee)';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after delay
        setTimeout(() => {
            btn.innerHTML = originalText;
            // the restored markup carries the old label, so re-translate it
            const label = btn.querySelector('[data-i18n]');
            if (label) label.textContent = t('form.send');
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }, 2000);
});

// ============================================
// Parallax Effect for Hero Shapes
// ============================================
document.addEventListener('mousemove', (e) => {
    if (reduceMotion) return;
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 14;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Animate skill bars when visible
            if (entry.target.closest('.skills')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
});

// ============================================
// Tilt Effect for Project Cards
// ============================================
// A soft 3D tilt plus a light that follows the cursor.
function trackSpotlight(el) {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
}

skillsCategories.forEach(trackSpotlight);

projectCards.forEach(card => {
    trackSpotlight(card);

    if (reduceMotion) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -7;
        const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 7;

        card.style.transform =
            `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============================================
// Magnetic Button Effect
// ============================================
const magneticBtns = document.querySelectorAll('.btn-primary');

magneticBtns.forEach(btn => {
    if (reduceMotion) return;

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // CSS vars, not an inline transform, so the hover styles keep working
        btn.style.setProperty('--mx', `${x * 0.16}px`);
        btn.style.setProperty('--my', `${y * 0.16}px`);
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
    });
});

// ============================================
// Keyboard Navigation Support
// ============================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
});

// ============================================
// Lazy Loading Images (if you add real images)
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// Performance: Debounce Scroll Events
// ============================================
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(reveal, 15));
window.addEventListener('scroll', debounce(animateSkillBars, 15));

// ============================================
// Theme — dark / light
// ============================================
function setTheme(theme, animate) {
    if (animate) {
        // a short global cross-fade so the swap doesn't snap
        root.classList.add('theming');
        setTimeout(() => root.classList.remove('theming'), 450);
    }

    root.setAttribute('data-theme', theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f5f7fb' : '#05060c');

    try { localStorage.setItem('theme', theme); } catch (e) {}
}

themeToggle.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
});

// ============================================
// Language — English / Turkmen / Russian
// ============================================
let currentLang = 'en';

// Translate a single key, falling back to English and then to the key itself
function t(key) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
}

function moveLangThumb(btn) {
    langThumb.style.setProperty('--thumb-w', btn.offsetWidth + 'px');
    langThumb.style.setProperty('--thumb-x', btn.offsetLeft + 'px');
}

function applyLang(lang, save) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    currentLang = TRANSLATIONS[lang] ? lang : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const value = dict[el.dataset.i18n];
        if (value) el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const value = dict[el.dataset.i18nAria];
        if (value) el.setAttribute('aria-label', value);
    });

    if (dict['meta.title']) document.title = dict['meta.title'];
    root.lang = currentLang;

    langBtns.forEach(btn => {
        const isOn = btn.dataset.lang === currentLang;
        btn.classList.toggle('active', isOn);
        btn.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        if (isOn) moveLangThumb(btn);
    });

    // restart the rotating job title in the new language
    words = dict.typed || TRANSLATIONS.en.typed;
    wordIndex = 0;
    charIndex = 0;
    isDeleting = false;
    if (typedText) typedText.textContent = '';

    if (save) {
        try { localStorage.setItem('lang', lang); } catch (e) {}
    }
}

langBtns.forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang, true));
});

// Keep the sliding pill aligned when the fonts land or the layout changes
window.addEventListener('load', () => {
    const active = document.querySelector('.lang-btn.active');
    if (active) moveLangThumb(active);
});
window.addEventListener('resize', debounce(() => {
    const active = document.querySelector('.lang-btn.active');
    if (active) moveLangThumb(active);
}, 120));

// ---- boot from whatever was saved last time ----
(function initPreferences() {
    let savedTheme = 'dark';
    let savedLang = 'en';
    try {
        savedTheme = 'light';
        const stored = localStorage.getItem('lang');
        if (TRANSLATIONS[stored]) savedLang = stored;
    } catch (e) {}

    setTheme(savedTheme, false);
    applyLang(savedLang, false);
})();

// ============================================
// Console Easter Egg
// ============================================
console.log('%c Welcome to my Portfolio! ', 'background: linear-gradient(120deg,#22d3ee,#a855f7); color: #04121a; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: bold;');
console.log('%c Built with vanilla HTML, CSS & JavaScript ', 'color: #22d3ee; font-size: 12px;');
