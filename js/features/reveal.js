// js/features/reveal.js
// Scroll-triggered reveal animation using IntersectionObserver

export function initReveal(config = {}) {
    const {
        selectors = ['.reveal', '.reveal-child'],
        threshold = 0.1,
        rootMargin = '0px 0px -40px 0px'
    } = config;

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once revealed, stop observing for performance
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold, rootMargin }
    );

    // Observe all reveal targets
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el) => {
            revealObserver.observe(el);
        });
    });
}
