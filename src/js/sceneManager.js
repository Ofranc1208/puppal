// Scene Manager - 2025 Architecture for Smooth Transitions
window.SceneManager = {
    currentScene: null,
    gameRoot: null,
    sceneCleanup: null,
    transitionQueue: [],
    isTransitioning: false,

    // Scene registry
    scenes: {
        'selectPup': window.SelectPupScene,
        'wakeUp': window.WakeUpScene,
        'care': window.CareScene,
        'mission': window.MissionScene,
        'play': window.PlayScene,
        'bath': window.BathScene,
        'bedtime': window.BedtimeScene
    },

    // Initialize scene manager
    init: function(gameRootElement) {
        this.gameRoot = gameRootElement;
        console.log('Scene Manager initialized');
    },

    // Navigate to a scene with smooth transitions
    navigateTo: function(sceneName, data = {}) {
        if (this.isTransitioning) {
            this.transitionQueue.push({ sceneName, data });
            return;
        }

        this.isTransitioning = true;
        console.log(`Navigating to scene: ${sceneName}`);

        // Apply theme if scene has specific theme requirements
        if (data.theme) {
            window.ThemeManager?.applyTheme(data.theme);
        }

        // Create transition effect
        this.createTransitionEffect(() => {
            this.loadScene(sceneName, data);
        });
    },

    // Load a scene
    loadScene: function(sceneName, data = {}) {
        // Clean up current scene
        if (this.sceneCleanup) {
            try {
                this.sceneCleanup();
            } catch (error) {
                console.warn('Error cleaning up scene:', error);
            }
            this.sceneCleanup = null;
        }

        // Update state
        if (window.GameState) {
            window.GameState.setScene(sceneName);
        }

        // Get scene module
        const sceneModule = this.scenes[sceneName];
        if (!sceneModule || !sceneModule.mount) {
            console.error(`Scene not found or invalid: ${sceneName}`);
            this.navigateTo('selectPup');
            return;
        }

        // Clear game root
        if (this.gameRoot) {
            this.gameRoot.innerHTML = '';
        }

        try {
            // Mount new scene
            this.sceneCleanup = sceneModule.mount(this.gameRoot, window.GameState, data);
            this.currentScene = sceneName;

            // Update UI
            if (window.Game) {
                window.Game.updateProgress();
            }

            // Add entrance animation
            this.addSceneEntranceAnimation();

        } catch (error) {
            console.error('Error mounting scene:', error);
            this.navigateTo('selectPup');
        }

        this.isTransitioning = false;
        this.processTransitionQueue();
    },

    // Create smooth transition effect
    createTransitionEffect: function(callback) {
        const overlay = document.createElement('div');
        overlay.className = 'scene-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, var(--royal-primary), var(--royal-secondary));
            z-index: 9999;
            opacity: 0;
            transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
        `;

        document.body.appendChild(overlay);

        // Fade in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';

            setTimeout(() => {
                // Execute callback
                if (callback) callback();

                // Fade out
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';

                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 300);
            }, 150);
        });
    },

    // Add entrance animation to scene content
    addSceneEntranceAnimation: function() {
        if (!this.gameRoot) return;

        const sceneContent = this.gameRoot.firstElementChild;
        if (sceneContent) {
            sceneContent.style.opacity = '0';
            sceneContent.style.transform = 'translateY(20px)';
            sceneContent.style.transition = 'opacity 400ms ease, transform 400ms ease';

            requestAnimationFrame(() => {
                sceneContent.style.opacity = '1';
                sceneContent.style.transform = 'translateY(0)';
            });
        }
    },

    // Process queued transitions
    processTransitionQueue: function() {
        if (this.transitionQueue.length > 0 && !this.isTransitioning) {
            const next = this.transitionQueue.shift();
            this.navigateTo(next.sceneName, next.data);
        }
    },

    // Get current scene info
    getCurrentScene: function() {
        return {
            name: this.currentScene,
            module: this.scenes[this.currentScene]
        };
    },

    // Emergency scene reset
    reset: function() {
        this.isTransitioning = false;
        this.transitionQueue = [];
        if (this.sceneCleanup) {
            try {
                this.sceneCleanup();
            } catch (error) {
                console.warn('Error during reset cleanup:', error);
            }
        }
        this.navigateTo('selectPup');
    }
};
