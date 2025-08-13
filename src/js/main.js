// Main Game Controller
window.Game = {
    // Game root element
    gameRoot: null,
    currentSceneCleanup: null,

    // Initialize the game
    init: function() {
        console.log('Initializing Pup Pal game...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },

    // Start the game
    start: function() {
        // Show loading screen first
        this.showLoadingScreen();
    },

    // Show loading screen with progress
    showLoadingScreen: function() {
        const loadingScreen = window.UI.qs('#loading-screen');
        const loadingProgress = window.UI.qs('#loading-progress');
        const loadingText = window.UI.qs('#loading-text');
        const startButton = window.UI.qs('#start-game');
        
        if (!loadingScreen) {
            console.error('Loading screen not found');
            this.startGame();
            return;
        }

        let progress = 0;
        const loadingSteps = [
            'Loading game systems...',
            'Preparing pup data...',
            'Setting up interactions...',
            'Getting treats ready...',
            'Almost done...'
        ];
        
        const progressInterval = setInterval(() => {
            progress += 20;
            
            if (loadingProgress) {
                loadingProgress.style.width = `${progress}%`;
            }
            
            if (loadingText && progress <= 80) {
                const stepIndex = Math.floor((progress - 20) / 20);
                loadingText.textContent = loadingSteps[stepIndex] || 'Loading...';
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                if (loadingText) {
                    loadingText.textContent = 'Ready to play!';
                }
                
                if (startButton) {
                    startButton.style.display = 'inline-flex';
                    startButton.addEventListener('click', () => {
                        this.hideLoadingScreen();
                    });
                }
            }
        }, 800);
    },

    // Hide loading screen and start game
    hideLoadingScreen: function() {
        const loadingScreen = window.UI.qs('#loading-screen');
        const gameRoot = window.UI.qs('#game-root');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (gameRoot) {
                    gameRoot.style.display = 'block';
                }
                this.startGame();
            }, 500);
        } else {
            this.startGame();
        }
    },

    // Actually start the game after loading
    startGame: function() {
        // Initialize game systems
        window.GameState.init();
        
        // Initialize sound system
        if (window.SoundManager) {
            window.SoundManager.init();
        }
        
        this.gameRoot = window.UI.qs('#game-root');
        
        if (!this.gameRoot) {
            console.error('Game root element not found');
            return;
        }

        // Set up top bar controls
        this.setupTopBar();
        
        // Start from the current scene in state
        const currentScene = window.GameState.getScene();
        this.loadScene(currentScene);

        console.log('Game started successfully');
    },

    // Set up top bar controls
    setupTopBar: function() {
        const muteButton = window.UI.qs('#mute-button');
        
        if (muteButton) {
            muteButton.addEventListener('click', () => {
                const soundEnabled = window.GameState.toggleSound();
                muteButton.textContent = soundEnabled ? '🔊' : '🔇';
                muteButton.setAttribute('aria-label', soundEnabled ? 'Mute sound' : 'Unmute sound');
                
                window.UI.showToast(
                    soundEnabled ? 'Sound enabled' : 'Sound disabled',
                    'info',
                    1500
                );
            });

            // Set initial state
            const soundEnabled = window.GameState.isSoundEnabled();
            muteButton.textContent = soundEnabled ? '🔊' : '🔇';
            muteButton.setAttribute('aria-label', soundEnabled ? 'Mute sound' : 'Unmute sound');
        }

        // Initialize progress bar
        this.updateProgress();
    },

    // Scene management
    loadScene: function(sceneName) {
        console.log(`Loading scene: ${sceneName}`);
        
        // Clean up current scene
        if (this.currentSceneCleanup) {
            this.currentSceneCleanup();
            this.currentSceneCleanup = null;
        }

        // Update state
        window.GameState.setScene(sceneName);
        
        // Update progress
        this.updateProgress();

        // Load the appropriate scene
        const sceneFunction = this.getSceneFunction(sceneName);
        if (sceneFunction) {
            window.UI.transitionToScene(() => {
                this.currentSceneCleanup = sceneFunction(this.gameRoot, window.GameState);
            }, this.gameRoot);
        } else {
            console.error(`Scene not found: ${sceneName}`);
            this.loadScene('selectPup'); // Fallback to pup selection
        }
    },

    // Get scene mounting function
    getSceneFunction: function(sceneName) {
        const sceneMap = {
            'selectPup': window.SelectPupScene?.mount,
            'wakeUp': window.WakeUpScene?.mount,
            'care': window.CareScene?.mount,
            'mission': window.MissionScene?.mount,
            'play': window.PlayScene?.mount,
            'bath': window.BathScene?.mount,
            'bedtime': window.BedtimeScene?.mount
        };

        return sceneMap[sceneName];
    },

    // Update progress bar
    updateProgress: function() {
        const progress = window.GameState.getDayProgress();
        window.UI.setProgress(progress);
    },

    // Navigation methods
    goToScene: function(sceneName) {
        this.loadScene(sceneName);
    },

    // Game flow navigation
    startNewDay: function() {
        console.log('Starting new day...');
        window.GameState.nextDay();
        this.updateProgress();
        this.loadScene('wakeUp');
    },

    selectPup: function(pupId) {
        if (window.GameState.selectPup(pupId)) {
            window.UI.showToast(`${window.GameState.getSelectedPup().name} selected!`, 'success');
            setTimeout(() => {
                this.loadScene('wakeUp');
            }, 1500);
        }
    },

    wakeUpComplete: function() {
        const pup = window.GameState.getSelectedPup();
        if (pup) {
            window.UI.playSfx('wakeUp');
            window.UI.showFact(
                window.GameData.getRandomFact('general'),
                'general',
                () => this.loadScene('care')
            );
        }
    },

    completeTask: function(taskId) {
        if (window.GameState.completeTask(taskId)) {
            const task = window.GameData.careTasks[taskId];
            window.UI.playSfx(taskId);
            this.updateProgress();
            
            // Show fact related to the task
            let factContext = 'general';
            if (taskId === 'feed') factContext = 'feeding';
            else if (taskId === 'water') factContext = 'water';
            else if (taskId === 'brush') factContext = 'dental';
            else if (taskId === 'clothes') factContext = 'grooming';
            
            window.UI.showFact(
                window.GameData.getRandomFact(factContext),
                factContext,
                () => {
                    // Check if all tasks are complete
                    if (window.GameState.areAllTasksCompleted()) {
                        setTimeout(() => {
                            this.loadScene('mission');
                        }, 500);
                    }
                }
            );
        }
    },

    completeMission: function() {
        window.GameState.completeMission();
        window.UI.playSfx('cheer');
        this.updateProgress();
        
        setTimeout(() => {
            this.loadScene('play');
        }, 1000);
    },

    completePlay: function() {
        window.GameState.completePlay();
        this.updateProgress();
        
        setTimeout(() => {
            this.loadScene('bath');
        }, 1000);
    },

    completeBath: function() {
        window.GameState.completeBath();
        window.UI.playSfx('success');
        this.updateProgress();
        
        window.UI.showFact(
            window.GameData.getRandomFact('bathing'),
            'bathing',
            () => this.loadScene('bedtime')
        );
    },

    // Debug functions
    debugInfo: function() {
        return {
            game: {
                currentScene: window.GameState.getScene(),
                gameRoot: !!this.gameRoot,
                cleanupFunction: !!this.currentSceneCleanup
            },
            state: window.GameState.debugInfo()
        };
    },

    // Reset game
    resetGame: function() {
        if (confirm('Are you sure you want to reset your progress?')) {
            window.GameState.reset();
            this.loadScene('selectPup');
            window.UI.showToast('Game reset successfully', 'info');
        }
    }
};

// Global navigation function for scenes to use
window.goToScene = function(sceneName) {
    window.Game.goToScene(sceneName);
};

// Global game action functions
window.selectPup = function(pupId) {
    window.Game.selectPup(pupId);
};

window.wakeUpComplete = function() {
    window.Game.wakeUpComplete();
};

window.completeTask = function(taskId) {
    window.Game.completeTask(taskId);
};

window.completeMission = function() {
    window.Game.completeMission();
};

window.completePlay = function() {
    window.Game.completePlay();
};

window.completeBath = function() {
    window.Game.completeBath();
};

window.startNewDay = function() {
    window.Game.startNewDay();
};

// Initialize the game when script loads
window.Game.init();
