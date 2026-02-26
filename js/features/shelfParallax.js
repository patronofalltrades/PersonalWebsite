// js/features/shelfParallax.js
// Parallax effect for shelf images as they scroll through viewport

export function initShelfParallax(config = {}) {
    const {
        selector = '.shelf-img',
        parallaxRange = 30,
        viewportBuffer = 100
    } = config;

    const shelfImgs = document.querySelectorAll(selector);
    if (!shelfImgs.length) return;

    let ticking = false;

    function updateParallax() {
        const viewH = window.innerHeight;
        shelfImgs.forEach((img) => {
            const rect = img.getBoundingClientRect();
            // Only process if in or near viewport
            if (rect.bottom < -viewportBuffer || rect.top > viewH + viewportBuffer) return;
            // Normalize: 0 when top of image hits bottom of viewport, 1 when bottom hits top
            const progress = (viewH - rect.top) / (viewH + rect.height);
            // Shift between -parallaxRange/2 and +parallaxRange/2
            const offset = (progress - 0.5) * parallaxRange;
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
}
