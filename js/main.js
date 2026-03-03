// js/main.js
// Main orchestrator for all site features

import { initPreloader } from './features/preloader.js';
import { initTyping } from './features/typing.js';
import { initClock } from './features/clock.js';
import { initReveal } from './features/reveal.js';
import { initActiveNav } from './features/activeNav.js';
import { initHeroParallax } from './features/heroParallax.js';
import { initHamburger } from './features/hamburger.js';
import { initShelfParallax } from './features/shelfParallax.js';
import { initEffects } from './features/effects.js';
import { initCommandPalette } from './features/commandPalette.js';
import config from './config.js';

// Feature registry with conditional loading
const features = {
    preloader: { init: initPreloader, enabled: true },
    typing: { init: initTyping, enabled: true },
    clock: { init: initClock, enabled: true },
    reveal: { init: initReveal, enabled: true },
    activeNav: { init: initActiveNav, enabled: true },
    heroParallax: { init: initHeroParallax, enabled: true },
    hamburger: { init: initHamburger, enabled: true },
    shelfParallax: { init: initShelfParallax, enabled: true },
    effects: { init: initEffects, enabled: true },
    commandPalette: { init: initCommandPalette, enabled: true }
};

// Initialize all enabled features
Object.entries(features).forEach(([name, feature]) => {
    if (feature.enabled) {
        try {
            feature.init(config[name] || {});
        } catch (error) {
            console.error(`Failed to initialize ${name}:`, error);
        }
    }
});

// Export for programmatic control if needed
export { features };
