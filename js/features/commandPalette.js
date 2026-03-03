// js/features/commandPalette.js
// Cmd+K command palette for quick navigation

export function initCommandPalette(config = {}) {
    const {
        shortcut = { key: 'k', modifier: 'meta' },
        commands = []
    } = config;

    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'cmd-palette-overlay';
    modal.id = 'cmd-palette';
    modal.innerHTML = `
        <div class="cmd-palette-modal">
            <input
                type="text"
                class="cmd-palette-input"
                placeholder="Type a command or search..."
                autocomplete="off"
                spellcheck="false"
            >
            <div class="cmd-palette-results"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const input = modal.querySelector('.cmd-palette-input');
    const results = modal.querySelector('.cmd-palette-results');
    let selectedIndex = 0;

    // Default commands if none provided
    const defaultCommands = [
        { name: 'Home', icon: '🏠', action: () => window.location.hash = '#hero' },
        { name: 'Now', icon: '📍', action: () => window.location.hash = '#now' },
        { name: 'Education', icon: '🎓', action: () => window.location.hash = '#education' },
        { name: 'Work', icon: '💼', action: () => window.location.hash = '#work' },
        { name: 'Projects', icon: '🚀', action: () => window.location.hash = '#projects' },
        { name: 'Shelf', icon: '📚', action: () => window.location.hash = '#shelf' },
        { name: 'Connect', icon: '✉️', action: () => window.location.hash = '#connect' },
        { name: 'Asperio', icon: '🏭', action: () => window.location.href = 'asperio.html' },
        { name: 'Battery Research', icon: '🔋', action: () => window.location.href = 'battery-research.html' },
        { name: 'AGV Patent', icon: '🤖', action: () => window.location.href = 'agv-patent.html' },
        { name: 'INSEAD Product Games', icon: '🏆', action: () => window.location.href = 'insead-product-games.html' },
    ];

    const allCommands = commands.length > 0 ? commands : defaultCommands;

    function filterCommands(query) {
        if (!query) return allCommands;
        const lowerQuery = query.toLowerCase();
        return allCommands.filter(cmd =>
            cmd.name.toLowerCase().includes(lowerQuery)
        );
    }

    function renderResults(filtered) {
        if (filtered.length === 0) {
            results.innerHTML = '<div class="cmd-palette-empty">No results found</div>';
            return;
        }

        results.innerHTML = filtered.map((cmd, index) => `
            <div class="cmd-palette-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
                <span class="cmd-palette-icon">${cmd.icon || '→'}</span>
                <span class="cmd-palette-name">${cmd.name}</span>
            </div>
        `).join('');

        // Add click handlers
        results.querySelectorAll('.cmd-palette-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                executeCommand(filtered[index]);
            });
        });
    }

    function executeCommand(cmd) {
        closeModal();
        if (cmd.action) cmd.action();
    }

    function openModal() {
        modal.classList.add('open');
        input.value = '';
        selectedIndex = 0;
        renderResults(allCommands);
        setTimeout(() => input.focus(), 50);
    }

    function closeModal() {
        modal.classList.remove('open');
        input.blur();
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K to open
        const isModifier = shortcut.modifier === 'meta' ? (e.metaKey || e.ctrlKey) : e.ctrlKey;
        if (isModifier && e.key.toLowerCase() === shortcut.key) {
            e.preventDefault();
            if (modal.classList.contains('open')) {
                closeModal();
            } else {
                openModal();
            }
            return;
        }

        // Only handle these if modal is open
        if (!modal.classList.contains('open')) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const filtered = filterCommands(input.value);
            selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
            renderResults(filtered);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const filtered = filterCommands(input.value);
            selectedIndex = Math.max(selectedIndex - 1, 0);
            renderResults(filtered);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const filtered = filterCommands(input.value);
            if (filtered[selectedIndex]) {
                executeCommand(filtered[selectedIndex]);
            }
        }
    });

    // Search on input
    input.addEventListener('input', () => {
        selectedIndex = 0;
        const filtered = filterCommands(input.value);
        renderResults(filtered);
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}
