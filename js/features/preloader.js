// js/features/preloader.js
// Handles page load sequence with visual progress indicator

export function initPreloader(config = {}) {
    const {
        selector = '#preloader',
        lineSelector = '.preloader-line',
        startDelay = 100,
        animationDuration = 1300
    } = config;

    window.addEventListener('load', () => {
        const preloader = document.getElementById(selector.replace('#', ''));
        const preloaderLine = document.querySelector(lineSelector);

        if (!preloader || !preloaderLine) return;

        // Start the line animation slightly after load
        setTimeout(() => {
            preloaderLine.style.width = '100%';

            // Wait for line animation plus buffer before sliding up
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, animationDuration);
        }, startDelay);
    });
}
