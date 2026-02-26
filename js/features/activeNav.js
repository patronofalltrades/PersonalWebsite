// js/features/activeNav.js
// Highlights nav links based on visible section and adds shadow on scroll

export function initActiveNav(config = {}) {
    const {
        sectionSelector = 'section[id]',
        navLinkSelector = '.nav-link[data-section]',
        navSelector = '#top-nav',
        rootMarginTop = 60,
        scrollThreshold = 10
    } = config;

    const sections = document.querySelectorAll(sectionSelector);
    const navLinks = document.querySelectorAll(navLinkSelector);
    const nav = document.getElementById(navSelector.replace('#', ''));

    if (!sections.length || !navLinks.length) return;

    // Observe sections to update active nav link
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
            rootMargin: `-${rootMarginTop}px 0px -60% 0px`,
            threshold: 0,
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    // Nav shadow on scroll
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > scrollThreshold);
        }, { passive: true });
    }
}
