/* ============================================
   PRELOADER
   ============================================ */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const preloaderLine = document.querySelector('.preloader-line');

    if (preloader && preloaderLine) {
        // Start the line animation slightly after load
        setTimeout(() => {
            preloaderLine.style.width = '100%';

            // Wait for line animation (1.2s) plus a tiny buffer before sliding up
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 1300);
        }, 100);
    }
});

/* ============================================
   TYPING ANIMATION
   ============================================ */
const phrases = [
    'an ex-founder.',
    'an MBA candidate at IESE.',
    'a product builder.',
    'interested in AI & manufacturing.',
    'building zero to one.',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
    if (!typedEl) return;

    const current = phrases[phraseIndex];

    if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
        delay = 2000; // pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
    }

    setTimeout(type, delay);
}

// Start typing after a short delay
setTimeout(type, 800);


/* ============================================
   LIVE CLOCK
   ============================================ */
function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('local-time');
    const tzEl = document.getElementById('local-tz');

    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    }

    if (tzEl) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        tzEl.textContent = tz;
    }
}

setInterval(updateClock, 1000);
updateClock();

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* ============================================
   SCROLL-TRIGGERED REVEAL
   ============================================ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once revealed, stop observing
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Observe all reveal targets
document.querySelectorAll('.reveal, .reveal-child').forEach((el) => {
    revealObserver.observe(el);
});


/* ============================================
   ACTIVE NAV ON SCROLL
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const nav = document.getElementById('top-nav');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    },
    {
        rootMargin: `-${60}px 0px -60% 0px`,
        threshold: 0,
    }
);

sections.forEach((section) => sectionObserver.observe(section));

// Nav shadow on scroll
window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });


/* ============================================
   HERO PARALLAX ON SCROLL
   ============================================ */
(function () {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    let ticking = false;

    function updateHeroParallax() {
        const scrollY = window.scrollY;
        // Only apply if near top
        if (scrollY < window.innerHeight) {
            const yPos = scrollY * 0.3;
            // Start fading out after 50px, completely transparent by 400px
            const opacity = Math.max(0, 1 - (Math.max(0, scrollY - 50) / 350));
            heroContent.style.transform = `translateY(${yPos}px)`;
            heroContent.style.opacity = opacity.toString();
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeroParallax);
            ticking = true;
        }
    }, { passive: true });
})();


/* ============================================
   HAMBURGER MENU
   ============================================ */
(function () {
    const hamburger = document.getElementById('nav-hamburger');
    const navLinksEl = document.getElementById('nav-links');
    if (!hamburger || !navLinksEl) return;

    function closeMenu() {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        navLinksEl.classList.remove('open');
    }

    function toggleMenu() {
        const isOpen = navLinksEl.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close on nav link click
    navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navLinksEl.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on scroll
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - lastY) > 50) {
            closeMenu();
            lastY = window.scrollY;
        }
    }, { passive: true });
})();


/* ============================================
   SHELF — PARALLAX ON SCROLL
   ============================================ */
(function () {
    const shelfImgs = document.querySelectorAll('.shelf-img');
    if (!shelfImgs.length) return;

    let ticking = false;

    function updateParallax() {
        const viewH = window.innerHeight;
        shelfImgs.forEach((img) => {
            const rect = img.getBoundingClientRect();
            // Only process if in or near viewport
            if (rect.bottom < -100 || rect.top > viewH + 100) return;
            // Normalise: 0 when top of image hits bottom of viewport, 1 when bottom hits top
            const progress = (viewH - rect.top) / (viewH + rect.height);
            // Shift between -15px and +15px
            const offset = (progress - 0.5) * 30;
            img.style.transform = `translateY(${offset}px) scale(1)`;
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

    // Initial call
    updateParallax();
})();

/* ============================================
   FILM GRAIN & MAGNETIC LINKS
   ============================================ */
// 1. Film Grain
const grain = document.createElement('div');
grain.className = 'noise-overlay';
document.body.appendChild(grain);

// 2. Magnetic Links
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    // Magnetic pull interactions
    const magneticElements = document.querySelectorAll('.nav-link, .btn, .nav-hamburger, .nav-back');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            // Calculate distance from center of element
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
            el.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none'; // Snap to mouse position instantly once hovering
        });
    });
}


