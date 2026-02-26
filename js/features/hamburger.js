// js/features/hamburger.js
// Mobile hamburger menu with click-outside and scroll-to-close behavior

export function initHamburger(config = {}) {
    const {
        hamburgerSelector = '#nav-hamburger',
        navLinksSelector = '#nav-links',
        linkSelector = '.nav-link',
        scrollCloseThreshold = 50
    } = config;

    const hamburger = document.getElementById(hamburgerSelector.replace('#', ''));
    const navLinksEl = document.getElementById(navLinksSelector.replace('#', ''));

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

    // Toggle on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Close on nav link click
    navLinksEl.querySelectorAll(linkSelector).forEach((link) => {
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
        if (Math.abs(window.scrollY - lastY) > scrollCloseThreshold) {
            closeMenu();
            lastY = window.scrollY;
        }
    }, { passive: true });
}
