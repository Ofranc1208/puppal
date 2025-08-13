// Disc Throw Mini-Game
window.DiscGame = {
    // Game state
    gameContainer: null,
    disc: null,
    pup: null,
    isPlaying: false,
    throwInProgress: false,
    
    // Game configuration
    config: {
        throwDuration: 800,
        pupMoveSpeed: 600,
        gravity: 0.5,
        initialVelocityY: -15,
        maxThrows: 5,
        targetZone: { x: 70, y: 60, width: 20, height: 20 } // Percentage based
    },

    // Initialize the disc game
    init: function(container, pupData, onComplete = null) {
        this.gameContainer = container;
        this.onComplete = onComplete;
        this.isPlaying = true;
        this.throwInProgress = false;
        this.currentThrow = 0;
        
        this.setupGameArea(pupData);
        this.setupControls();
        
        return this.cleanup.bind(this);
    },

    // Set up the game area
    setupGameArea: function(pupData) {
        this.gameContainer.innerHTML = `
            <div class="disc-game-area" style="position: relative; height: 300px; background: linear-gradient(135deg, #7ED321, #4A90E2); border-radius: 1rem; overflow: hidden; margin: 1rem 0;">
                <!-- Sky background -->
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 60%; background: linear-gradient(to bottom, #87CEEB, #98FB98);"></div>
                
                <!-- Ground -->
                <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 40%; background: linear-gradient(to bottom, #32CD32, #228B22);"></div>
                
                <!-- Target zone indicator -->
                <div id="target-zone" style="position: absolute; left: 70%; top: 60%; width: 20%; height: 20%; border: 2px dashed #FFD700; border-radius: 50%; opacity: 0.7;"></div>
                
                <!-- Pup -->
                <div id="game-pup" class="pup-character" style="
                    position: absolute; 
                    bottom: 10%; 
                    right: 10%; 
                    width: 60px; 
                    height: 60px; 
                    background: linear-gradient(135deg, ${pupData.color}, #F5A623);
                    font-size: 2rem;
                    transition: all 0.6s ease;
                ">
                    ${pupData.emoji}
                </div>
                
                <!-- Disc -->
                <div id="game-disc" class="disc" style="
                    position: absolute; 
                    bottom: 20%; 
                    left: 10%; 
                    width: 40px; 
                    height: 40px;
                    display: none;
                "></div>
                
                <!-- Instructions -->
                <div id="game-instructions" style="position: absolute; top: 10px; left: 10px; color: white; font-weight: bold; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 0.5rem;">
                    <div>Throws: <span id="throw-count">0/${this.config.maxThrows}</span></div>
                    <div style="font-size: 0.9rem; margin-top: 0.25rem;">Tap to throw the disc!</div>
                </div>
                
                <!-- Success indicator -->
                <div id="success-indicator" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; display: none;">
                    🎉
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 1rem;">
                <button class="btn btn-primary btn-large" id="throw-button">
                    🥏 Throw Disc
                </button>
            </div>
        `;

        this.disc = this.gameContainer.querySelector('#game-disc');
        this.pup = this.gameContainer.querySelector('#game-pup');
        this.throwButton = this.gameContainer.querySelector('#throw-button');
        this.throwCountDisplay = this.gameContainer.querySelector('#throw-count');
    },

    // Set up game controls
    setupControls: function() {
        if (!this.throwButton) return;

        window.UI.addTouchFeedback(this.throwButton);
        
        this.throwCleanup = window.InputManager.addTap(this.throwButton, () => {
            if (!this.throwInProgress && this.isPlaying) {
                this.throwDisc();
            }
        });
    },

    // Throw the disc
    throwDisc: function() {
        if (this.throwInProgress || !this.isPlaying) return;
        
        this.throwInProgress = true;
        this.currentThrow++;
        
        // Update throw count
        this.throwCountDisplay.textContent = `${this.currentThrow}/${this.config.maxThrows}`;
        
        // Disable throw button
        this.throwButton.disabled = true;
        this.throwButton.textContent = 'Flying...';
        
        // Show and animate disc
        this.disc.style.display = 'block';
        this.disc.classList.add('throwing');
        
        // Play throw sound
        window.UI.playSfx('discThrow');
        
        // Calculate throw trajectory
        this.animateDiscThrow();
    },

    // Animate the disc throw with parabolic trajectory
    animateDiscThrow: function() {
        const startTime = Date.now();
        const startX = 10; // 10% from left
        const startY = 20; // 20% from bottom
        const endX = this.config.targetZone.x + (this.config.targetZone.width / 2);
        const endY = this.config.targetZone.y + (this.config.targetZone.height / 2);
        
        const animate = () => {
            if (!this.isPlaying) return;
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.config.throwDuration, 1);
            
            // Parabolic trajectory calculation
            const x = startX + (endX - startX) * progress;
            const baseY = startY + (endY - startY) * progress;
            const arc = Math.sin(progress * Math.PI) * 20; // Arc height
            const y = baseY - arc;
            
            // Update disc position
            this.disc.style.left = `${x}%`;
            this.disc.style.bottom = `${y}%`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.handleDiscLanding();
            }
        };
        
        requestAnimationFrame(animate);
        
        // Move pup to catch position
        setTimeout(() => {
            this.movePupToCatch();
        }, this.config.throwDuration * 0.3);
    },

    // Move pup to catch the disc
    movePupToCatch: function() {
        if (!this.pup || !this.isPlaying) return;
        
        const targetX = this.config.targetZone.x;
        const targetY = this.config.targetZone.y;
        
        this.pup.style.right = `${100 - targetX - 10}%`;
        this.pup.style.bottom = `${targetY}%`;
        this.pup.classList.add('bounce');
    },

    // Handle disc landing
    handleDiscLanding: function() {
        if (!this.isPlaying) return;
        
        this.disc.classList.remove('throwing');
        
        // Check if catch was successful (simplified - always successful for better UX)
        const success = true;
        
        if (success) {
            this.handleSuccessfulCatch();
        } else {
            this.handleMissedCatch();
        }
    },

    // Handle successful catch
    handleSuccessfulCatch: function() {
        // Hide disc
        this.disc.style.display = 'none';
        
        // Show success animation
        this.pup.classList.add('sparkle');
        const successIndicator = this.gameContainer.querySelector('#success-indicator');
        if (successIndicator) {
            successIndicator.style.display = 'block';
            successIndicator.classList.add('bounce');
        }
        
        // Play success sound
        window.UI.playSfx('discCatch');
        
        // Create sparkle effects
        const rect = this.pup.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                window.UI.createSparkle(
                    rect.left + rect.width / 2 + (Math.random() - 0.5) * 60,
                    rect.top + rect.height / 2 + (Math.random() - 0.5) * 60
                );
            }, i * 150);
        }
        
        // End game after success
        setTimeout(() => {
            this.endGame(true);
        }, 2000);
    },

    // Handle missed catch (currently not used, but available for harder difficulty)
    handleMissedCatch: function() {
        // Reset disc position
        this.disc.style.left = '10%';
        this.disc.style.bottom = '20%';
        this.disc.style.display = 'none';
        
        // Reset pup position
        this.pup.style.right = '10%';
        this.pup.style.bottom = '10%';
        
        // Check if game should continue
        if (this.currentThrow >= this.config.maxThrows) {
            this.endGame(false);
        } else {
            this.resetForNextThrow();
        }
    },

    // Reset for next throw
    resetForNextThrow: function() {
        this.throwInProgress = false;
        this.throwButton.disabled = false;
        this.throwButton.textContent = '🥏 Throw Again';
    },

    // End the game
    endGame: function(success = true) {
        this.isPlaying = false;
        
        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete(success);
            }
        }, 500);
    },

    // Cleanup function
    cleanup: function() {
        this.isPlaying = false;
        if (this.throwCleanup) {
            this.throwCleanup();
        }
    }
};
