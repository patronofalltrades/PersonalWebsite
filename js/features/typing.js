// js/features/typing.js
// Typewriter effect that cycles through phrases

export function initTyping(config = {}) {
    const {
        selector = '#typed-text',
        phrases = [
            'an ex-founder.',
            'an MBA candidate at IESE.',
            'a product builder.',
            'interested in AI & manufacturing.',
            'building zero to one.',
        ],
        typeSpeed = 100,
        deleteSpeed = 60,
        pauseDuration = 2000,
        betweenPhrasesDelay = 400,
        startDelay = 800
    } = config;

    const typedEl = document.getElementById(selector.replace('#', ''));
    if (!typedEl) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === current.length) {
            delay = pauseDuration; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = betweenPhrasesDelay;
        }

        setTimeout(type, delay);
    }

    // Start typing after initial delay
    setTimeout(type, startDelay);
}
