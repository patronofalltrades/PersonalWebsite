// js/features/heroParallax.js
// Creates parallax effect on hero section with fade-out on scroll

export function initHeroParallax(config = {}) {
    const {
        selector = '.hero-content',
        parallaxSpeed = 0.3,
        fadeStart = 50,
        fadeEnd = 350
    } = config;

    const heroContent = document.querySelector(selector);
    if (!heroContent) return;

    let ticking = false;

    function updateHeroParallax() {
        const scrollY = window.scrollY;
        // Only apply if near top
        if (scrollY < window.innerHeight) {
            const yPos = scrollY * parallaxSpeed;
            // Start fading out after fadeStart px, completely transparent by fadeStart + fadeEnd
            const opacity = Math.max(0, 1 - (Math.max(0, scrollY - fadeStart) / fadeEnd));
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
}
