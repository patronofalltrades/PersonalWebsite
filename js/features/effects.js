// js/features/effects.js
// Film grain overlay and magnetic link effects

export function initEffects(config = {}) {
    const {
        enableGrain = true,
        enableMagnetic = true,
        magneticSelectors = ['.nav-link', '.btn', '.nav-hamburger', '.nav-back'],
        magneticStrength = 0.3
    } = config;

    // 1. Film Grain
    if (enableGrain) {
        const grain = document.createElement('div');
        grain.className = 'noise-overlay';
        document.body.appendChild(grain);
    }

    // 2. Magnetic Links
    if (enableMagnetic) {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) {
            // Magnetic pull interactions
            const magneticElements = document.querySelectorAll(magneticSelectors.join(', '));

            magneticElements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    // Calculate distance from center of element
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    el.style.transform = `translate(${x * magneticStrength}px, ${y * magneticStrength}px)`;
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
    }
}
