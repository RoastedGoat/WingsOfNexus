// Theme Toggle Component
// Based on Uiverse.io design by JustCode14 - red-dingo-61
// Implements device preference detection and cookie storage

// Utility functions for cookie management
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Apply theme immediately to prevent flash
function applyThemeImmediately() {
    const savedTheme = getCookie('theme');
    const root = document.documentElement;
    
    if (savedTheme) {
        if (savedTheme === 'dark') {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }
    } else {
        // Use device preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }
    }
}

// Apply theme immediately when script loads
applyThemeImmediately();

class ThemeToggle {
    constructor() {
        this.themeToggle = null;
        this.isDark = false;
        this.init();
    }

    init() {
        // Create the toggle element
        this.createToggle();
        
        // Set initial theme based on device preference or cookie
        this.setInitialTheme();
        
        // Add event listener
        this.themeToggle.addEventListener('change', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!getCookie('theme')) {
                this.isDark = e.matches;
                this.updateTheme();
            }
        });
    }

    createToggle() {
        // Create toggle container
        this.themeToggle = document.createElement('label');
        this.themeToggle.className = 'theme-switch';
        this.themeToggle.innerHTML = `
            <input type="checkbox" id="theme-toggle" />
            <div class="slider round"></div>
        `;
    }

    setInitialTheme() {
        // Check for saved theme preference
        const savedTheme = getCookie('theme');
        
        if (savedTheme) {
            this.isDark = savedTheme === 'dark';
        } else {
            // Use device preference
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        
        this.updateTheme();
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        this.updateTheme();
        setCookie('theme', this.isDark ? 'dark' : 'light', 365);
    }

    updateTheme() {
        const root = document.documentElement;
        const checkbox = this.themeToggle.querySelector('#theme-toggle');
        
        if (this.isDark) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
            checkbox.checked = true;
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
            checkbox.checked = false;
        }
    }

    // Method to add toggle to a specific element
    addToElement(element) {
        if (element && this.themeToggle) {
            element.appendChild(this.themeToggle);
        }
    }

    // Method to add toggle to header
    addToHeader() {
        const header = document.querySelector('header');
        if (header) {
            // Create a container for the toggle
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'theme-toggle-wrapper';
            toggleContainer.appendChild(this.themeToggle);
            header.appendChild(toggleContainer);
        }
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = new ThemeToggle();
    themeToggle.addToHeader();
});

// Export for use in other scripts
window.ThemeToggle = ThemeToggle;