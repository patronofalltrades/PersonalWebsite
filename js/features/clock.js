// js/features/clock.js
// Updates time display and year in footer

export function initClock(config = {}) {
    const {
        timeSelector = '#local-time',
        tzSelector = '#local-tz',
        yearSelector = '#year',
        updateInterval = 1000
    } = config;

    function updateClock() {
        const now = new Date();
        const timeEl = document.getElementById(timeSelector.replace('#', ''));
        const tzEl = document.getElementById(tzSelector.replace('#', ''));

        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
        }

        if (tzEl) {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            tzEl.textContent = tz;
        }
    }

    setInterval(updateClock, updateInterval);
    updateClock();

    // Set year in footer
    const yearEl = document.getElementById(yearSelector.replace('#', ''));
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}
