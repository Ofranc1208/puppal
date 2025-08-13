// Theme Manager - 2025 Design System for Kids
window.ThemeManager = {
    // Current active theme
    currentTheme: 'royal',

    // Theme configurations
    themes: {
        royal: {
            name: 'Royal Palace',
            primary: '#6B46C1',
            secondary: '#EC4899',
            accent: '#F59E0B',
            background: 'linear-gradient(135deg, #6B46C1 0%, #EC4899 50%, #F59E0B 100%)',
            surface: 'rgba(255, 255, 255, 0.08)',
            text: '#FFFFFF',
            textSecondary: 'rgba(255, 255, 255, 0.8)'
        },
        light: {
            name: 'Clean & Bright',
            primary: '#6B46C1',
            secondary: '#EC4899',
            accent: '#F59E0B',
            background: '#FFFFFF',
            surface: '#F9FAFB',
            text: '#111827',
            textSecondary: '#6B7280'
        }
    },

    // Kid-friendly design tokens
    kidDesign: {
        // Large touch targets for small fingers
        touchTarget: '48px',
        // Rounded corners for safety feel
        borderRadius: '16px',
        // High contrast for accessibility
        contrastRatio: 4.5,
        // Smooth animations for comfort
        animationDuration: '300ms',
        animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // Generous spacing for clarity
        spacing: {
            xs: '4px',
            sm: '8px',
            md: '16px',
            lg: '24px',
            xl: '32px'
        }
    },

    // Apply theme to document
    applyTheme: function(themeName = 'royal') {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        
        // Update CSS custom properties
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-secondary', theme.secondary);
        root.style.setProperty('--theme-accent', theme.accent);
        root.style.setProperty('--theme-background', theme.background);
        root.style.setProperty('--theme-surface', theme.surface);
        root.style.setProperty('--theme-text', theme.text);
        root.style.setProperty('--theme-text-secondary', theme.textSecondary);

        this.currentTheme = themeName;
        console.log(`Theme applied: ${theme.name}`);
    },

    // Get current theme colors
    getCurrentTheme: function() {
        return this.themes[this.currentTheme];
    },

    // Kid-friendly color generator
    generateKidFriendlyPalette: function(baseColor) {
        // Generate softer, more playful variations
        const colors = {
            light: this.lightenColor(baseColor, 30),
            medium: baseColor,
            dark: this.darkenColor(baseColor, 20),
            contrast: this.getContrastColor(baseColor)
        };
        return colors;
    },

    // Utility functions
    lightenColor: function(color, percent) {
        // Simple lightening - in production, use a proper color library
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const B = (num >> 8 & 0x00FF) + amt;
        const G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
                     (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + 
                     (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
    },

    darkenColor: function(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const B = (num >> 8 & 0x00FF) - amt;
        const G = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 + 
                     (B > 255 ? 255 : B < 0 ? 0 : B) * 0x100 + 
                     (G > 255 ? 255 : G < 0 ? 0 : G)).toString(16).slice(1);
    },

    getContrastColor: function(hexColor) {
        // Return black or white based on luminance
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    },

    // Initialize theme system
    init: function() {
        this.applyTheme('royal');
        console.log('Theme Manager initialized');
    }
};
