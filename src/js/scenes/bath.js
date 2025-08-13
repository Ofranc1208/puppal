// Bath Scene with Bubble Interaction
window.BathScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting Bath scene');
        
        const pup = gameState.getSelectedPup();
        if (!pup) {
            console.error('No pup selected for bath scene');
            window.goToScene('selectPup');
            return () => {};
        }

        const container = window.UI.createElement('div', 'pup-display fade-in');
        container.innerHTML = `
            <h2>Bath Time for ${pup.name}!</h2>
            <p class="pup-status">
                🛁 Let's get squeaky clean! Drag around to create bubbles and scrub.
            </p>
            
            <div id="bath-area" style="position: relative; height: 300px; background: linear-gradient(135deg, #87CEEB, #4A90E2); border-radius: 1rem; overflow: hidden; margin: 2rem 0; cursor: crosshair;">
                <!-- Bath tub -->
                <div style="position: absolute; bottom: 0; left: 10%; right: 10%; height: 80%; background: linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1)); border-radius: 1rem 1rem 0 0; border: 3px solid white;"></div>
                
                <!-- Water -->
                <div style="position: absolute; bottom: 3px; left: 13%; right: 13%; height: 60%; background: linear-gradient(to bottom, rgba(135, 206, 235, 0.8), rgba(74, 144, 226, 0.9)); border-radius: 0.8rem 0.8rem 0 0;"></div>
                
                <!-- Pup in bath -->
                <div id="bath-pup" class="pup-character" style="
                    position: absolute; 
                    bottom: 15%; 
                    left: 50%; 
                    transform: translateX(-50%);
                    width: 80px; 
                    height: 80px; 
                    background: linear-gradient(135deg, ${pup.color}, #F5A623);
                    font-size: 2.5rem;
                ">
                    ${pup.emoji}
                </div>
                
                <!-- Progress indicator -->
                <div style="position: absolute; top: 10px; left: 10px; color: white; font-weight: bold; background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 0.5rem;">
                    <div>Bubbles: <span id="bubble-count">0/${window.GameData.config.bathBubbleTarget}</span></div>
                    <div style="font-size: 0.9rem; margin-top: 0.25rem;">Drag to scrub!</div>
                </div>
                
                <!-- Completion indicator -->
                <div id="bath-complete" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; display: none;">
                    ✨
                </div>
            </div>
            
            <div style="text-align: center;">
                <p style="color: var(--neutral-gray); font-size: 0.9rem;">
                    Tap and drag around the bath area to create bubbles and clean ${pup.name}!
                </p>
            </div>
        `;

        gameRoot.appendChild(container);

        const bathArea = container.querySelector('#bath-area');
        const bubbleCountDisplay = container.querySelector('#bubble-count');
        const bathPup = container.querySelector('#bath-pup');
        
        let bubbleCount = 0;
        let isComplete = false;
        const targetBubbles = window.GameData.config.bathBubbleTarget;

        // Set up bubble creation interaction
        const cleanup = this.setupBubbleInteraction(
            bathArea, 
            bubbleCountDisplay, 
            bathPup, 
            targetBubbles,
            (count) => this.onBubbleCreated(count, targetBubbles, container)
        );

        // Return cleanup function
        return function cleanup() {
            console.log('Cleaning up Bath scene');
            if (cleanup) cleanup();
        };
    },

    // Set up bubble creation interaction
    setupBubbleInteraction: function(bathArea, bubbleCountDisplay, bathPup, targetBubbles, onBubbleCreated) {
        let bubbleCount = 0;
        let lastBubbleTime = 0;
        const bubbleDelay = 150; // Minimum delay between bubbles

        return window.InputManager.addTouchDrag(bathArea, {
            onStart: (data) => {
                window.UI.playSfx('tap');
                this.createBubbleAt(data.x, data.y, bathArea);
                bubbleCount++;
                this.updateBubbleCount(bubbleCount, targetBubbles, bubbleCountDisplay);
                onBubbleCreated(bubbleCount);
            },

            onMove: (data) => {
                const now = Date.now();
                if (now - lastBubbleTime > bubbleDelay) {
                    // Create bubble at drag position
                    const rect = bathArea.getBoundingClientRect();
                    const relativeX = data.x - rect.left;
                    const relativeY = data.y - rect.top;
                    
                    // Only create bubbles within the bath area
                    if (relativeX >= 0 && relativeX <= rect.width && 
                        relativeY >= 0 && relativeY <= rect.height) {
                        
                        this.createBubbleAt(data.x, data.y, bathArea);
                        bubbleCount++;
                        this.updateBubbleCount(bubbleCount, targetBubbles, bubbleCountDisplay);
                        onBubbleCreated(bubbleCount);
                        
                        lastBubbleTime = now;
                    }
                }
            },

            onEnd: () => {
                // Optional: Add splash sound
                window.UI.playSfx('bubblePop');
            }
        });
    },

    // Create a bubble at specific coordinates
    createBubbleAt: function(x, y, container) {
        // Convert screen coordinates to container-relative coordinates
        const rect = container.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        
        window.UI.createBubble(relativeX, relativeY, container);
    },

    // Update bubble count display
    updateBubbleCount: function(count, target, display) {
        if (display) {
            display.textContent = `${count}/${target}`;
        }
    },

    // Handle bubble creation
    onBubbleCreated: function(count, target, container) {
        const bathPup = container.querySelector('#bath-pup');
        
        // Add cleaning animation to pup occasionally
        if (count % 5 === 0 && bathPup) {
            bathPup.classList.add('sparkle');
            setTimeout(() => {
                bathPup.classList.remove('sparkle');
            }, 1000);
        }

        // Check if bath is complete
        if (count >= target) {
            this.completeBath(container);
        }
    },

    // Complete the bath
    completeBath: function(container) {
        const bathComplete = container.querySelector('#bath-complete');
        const bathPup = container.querySelector('#bath-pup');
        
        // Show completion animation
        if (bathComplete) {
            bathComplete.style.display = 'block';
            bathComplete.classList.add('sparkle', 'bounce');
        }
        
        // Pup celebration animation
        if (bathPup) {
            bathPup.classList.add('bounce', 'sparkle');
        }
        
        // Play completion sound
        window.UI.playSfx('success');
        
        // Create multiple sparkle effects
        const rect = container.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const x = rect.left + rect.width * (0.2 + Math.random() * 0.6);
                const y = rect.top + rect.height * (0.3 + Math.random() * 0.4);
                window.UI.createSparkle(x, y);
            }, i * 100);
        }
        
        // Show completion message
        setTimeout(() => {
            const pup = window.GameState.getSelectedPup();
            window.UI.showModal(
                'Squeaky Clean!',
                `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🧼</div>
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                            ${pup.name} is all clean and fresh! Great job scrubbing!
                        </p>
                        <p>Time to get cozy for bedtime.</p>
                    </div>
                `,
                {
                    onContinue: () => {
                        window.completeBath();
                    }
                }
            );
        }, 2000);
    }
};
