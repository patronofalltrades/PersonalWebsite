// js/config.js
// Centralized configuration for all site features

export default {
    // Preloader configuration
    preloader: {
        selector: '#preloader',
        lineSelector: '.preloader-line',
        startDelay: 100,              // ms - delay before line animation starts
        animationDuration: 1300       // ms - line animation duration (1.2s animation + buffer)
    },

    // Typing animation configuration
    typing: {
        selector: '#typed-text',
        phrases: [
            'an ex-founder.',
            'an MBA candidate at IESE.',
            'a product builder.',
            'interested in AI & manufacturing.',
            'building zero to one.',
        ],
        typeSpeed: 100,               // ms per character when typing
        deleteSpeed: 60,              // ms per character when deleting
        pauseDuration: 2000,          // ms to pause at end of phrase
        betweenPhrasesDelay: 400,    // ms delay between phrases
        startDelay: 800               // ms before first character appears
    },

    // Clock configuration
    clock: {
        timeSelector: '#local-time',
        tzSelector: '#local-tz',
        yearSelector: '#year',
        updateInterval: 1000          // ms - clock update frequency
    },

    // Scroll-triggered reveal configuration
    reveal: {
        selectors: ['.reveal', '.reveal-child'],
        threshold: 0.1,               // 0-1 - % of element visible to trigger reveal
        rootMargin: '0px 0px -40px 0px'  // CSS margin around root (adds 40px bottom buffer)
    },

    // Active navigation configuration
    activeNav: {
        sectionSelector: 'section[id]',
        navLinkSelector: '.nav-link[data-section]',
        navSelector: '#top-nav',
        rootMarginTop: 60,            // px - offset from top for intersection detection
        scrollThreshold: 10           // px - scroll distance to trigger nav shadow
    },

    // Hero parallax configuration
    heroParallax: {
        selector: '.hero-content',
        parallaxSpeed: 0.3,           // 0-1 - parallax effect strength multiplier
        fadeStart: 50,                // px - scroll distance to start fade
        fadeEnd: 350                  // px - scroll distance range for full fade (50+350=400px total)
    },

    // Hamburger menu configuration
    hamburger: {
        hamburgerSelector: '#nav-hamburger',
        navLinksSelector: '#nav-links',
        linkSelector: '.nav-link',
        scrollCloseThreshold: 50      // px - scroll distance to auto-close menu
    },

    // Shelf parallax configuration
    shelfParallax: {
        selector: '.shelf-img',
        parallaxRange: 30,            // px - total parallax movement range (-15px to +15px)
        viewportBuffer: 100           // px - buffer outside viewport to process images
    },

    // Effects configuration (grain + magnetic)
    effects: {
        enableGrain: true,            // Whether to show film grain overlay
        enableMagnetic: true,         // Whether to enable magnetic link effects
        magneticSelectors: ['.nav-link', '.btn', '.nav-hamburger', '.nav-back'],
        magneticStrength: 0.3         // 0-1 - magnetic pull strength multiplier
    },

    // Command palette configuration (Cmd+K)
    commandPalette: {
        shortcut: { key: 'k', modifier: 'meta' },  // Cmd+K (or Ctrl+K on Windows)
        commands: []                   // Uses default commands if empty
    }
};
