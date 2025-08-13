// Bedtime Scene
window.BedtimeScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting Bedtime scene');
        
        const pup = gameState.getSelectedPup();
        if (!pup) {
            console.error('No pup selected for bedtime scene');
            window.goToScene('selectPup');
            return () => {};
        }

        const container = window.UI.createElement('div', 'pup-display fade-in');
        container.innerHTML = `
            <h2>Good Night, ${pup.name}!</h2>
            <div id="bedtime-scene" style="position: relative; height: 300px; background: linear-gradient(135deg, #2C3E50, #34495E); border-radius: 1rem; overflow: hidden; margin: 2rem 0;">
                <!-- Night sky with stars -->
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 60%; background: linear-gradient(to bottom, #0F4C75, #2C3E50);">
                    ${this.createStars()}
                </div>
                
                <!-- Moon -->
                <div style="position: absolute; top: 15%; right: 15%; width: 60px; height: 60px; background: #F4F1DE; border-radius: 50%; box-shadow: 0 0 20px rgba(244, 241, 222, 0.6);">
                    🌙
                </div>
                
                <!-- Bed area -->
                <div style="position: absolute; bottom: 0; left: 20%; right: 20%; height: 40%; background: linear-gradient(to bottom, #8B4513, #A0522D); border-radius: 1rem 1rem 0 0;"></div>
                
                <!-- Bedding -->
                <div style="position: absolute; bottom: 10%; left: 25%; right: 25%; height: 25%; background: linear-gradient(135deg, #E8E8E8, #D3D3D3); border-radius: 0.5rem;"></div>
                
                <!-- Sleeping pup -->
                <div id="sleeping-pup" class="pup-character sleeping" style="
                    position: absolute; 
                    bottom: 20%; 
                    left: 50%; 
                    transform: translateX(-50%);
                    width: 80px; 
                    height: 80px; 
                    background: linear-gradient(135deg, ${pup.color}, #9013FE);
                    font-size: 2.5rem;
                ">
                    ${pup.emoji}
                </div>
                
                <!-- Dimming overlay -->
                <div id="dimming-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0); transition: background 3s ease;"></div>
            </div>
            
            <p class="pup-status" id="bedtime-status">
                😴 ${pup.name} is getting sleepy...
            </p>
            
            <div style="text-align: center; margin-top: 2rem;">
                <div class="day-summary" style="background: var(--white); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem; box-shadow: 0 4px 16px var(--shadow);">
                    <h3 style="margin-bottom: 1rem; color: var(--dark-gray);">Day ${gameState.current.day} Complete!</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: center;">
                        <div>
                            <div style="font-size: 2rem;">✅</div>
                            <div style="font-size: 0.9rem; color: var(--neutral-gray);">Tasks Done</div>
                            <div style="font-weight: bold;">${gameState.getCompletedTasksCount()}/${gameState.getTotalTasksCount()}</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem;">🎯</div>
                            <div style="font-size: 0.9rem; color: var(--neutral-gray);">Activities</div>
                            <div style="font-weight: bold;">All Complete!</div>
                        </div>
                    </div>
                </div>
                
                <button class="btn btn-primary btn-large" id="new-day-button" style="display: none;">
                    🌅 Start New Day
                </button>
                
                <button class="btn btn-secondary" id="reset-button" style="margin-top: 1rem;">
                    🔄 Choose Different Pup
                </button>
            </div>
        `;

        gameRoot.appendChild(container);

        // Start bedtime animation
        this.startBedtimeAnimation(container, gameState);

        // Set up controls
        const cleanup = this.setupControls(container);

        // Return cleanup function
        return function cleanup() {
            console.log('Cleaning up Bedtime scene');
            if (cleanup) cleanup();
        };
    },

    // Create twinkling stars
    createStars: function() {
        let starsHtml = '';
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * 90 + 5;
            const y = Math.random() * 50 + 5;
            const delay = Math.random() * 3;
            starsHtml += `
                <div style="
                    position: absolute; 
                    left: ${x}%; 
                    top: ${y}%; 
                    color: #F4F1DE; 
                    font-size: 1rem;
                    animation: sparkle 3s ease-in-out infinite;
                    animation-delay: ${delay}s;
                ">✨</div>
            `;
        }
        return starsHtml;
    },

    // Start bedtime animation sequence
    startBedtimeAnimation: function(container, gameState) {
        const dimmingOverlay = container.querySelector('#dimming-overlay');
        const statusElement = container.querySelector('#bedtime-status');
        const newDayButton = container.querySelector('#new-day-button');
        const sleepingPup = container.querySelector('#sleeping-pup');
        const pup = gameState.getSelectedPup();

        // Play snore sound
        setTimeout(() => {
            window.UI.playSfx('snore');
        }, 1000);

        // Gradual dimming
        setTimeout(() => {
            if (dimmingOverlay) {
                dimmingOverlay.style.background = 'rgba(0,0,0,0.3)';
            }
            if (statusElement) {
                statusElement.textContent = `💤 ${pup.name} is falling asleep...`;
            }
        }, 2000);

        // Deeper sleep
        setTimeout(() => {
            if (dimmingOverlay) {
                dimmingOverlay.style.background = 'rgba(0,0,0,0.6)';
            }
            if (statusElement) {
                statusElement.textContent = `🌙 Sweet dreams, ${pup.name}!`;
            }
        }, 4000);

        // Show new day option
        setTimeout(() => {
            if (statusElement) {
                statusElement.textContent = `☀️ Ready for another day with ${pup.name}?`;
            }
            if (newDayButton) {
                newDayButton.style.display = 'inline-flex';
                newDayButton.classList.add('fade-in');
            }
        }, 6000);
    },

    // Set up control interactions
    setupControls: function(container) {
        const newDayButton = container.querySelector('#new-day-button');
        const resetButton = container.querySelector('#reset-button');
        const cleanupFunctions = [];

        // New day button
        if (newDayButton) {
            window.UI.addTouchFeedback(newDayButton);
            
            const newDayCleanup = window.InputManager.addTap(newDayButton, () => {
                newDayButton.classList.add('zoom');
                window.UI.playSfx('success');
                
                setTimeout(() => {
                    window.startNewDay();
                }, 300);
            });
            cleanupFunctions.push(newDayCleanup);
        }

        // Reset button
        if (resetButton) {
            window.UI.addTouchFeedback(resetButton);
            
            const resetCleanup = window.InputManager.addTap(resetButton, () => {
                window.UI.showModal(
                    'Choose Different Pup?',
                    `
                        <div style="text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🐕</div>
                            <p style="margin-bottom: 1rem;">
                                Would you like to go back and choose a different pup to play with?
                            </p>
                            <p style="color: var(--neutral-gray); font-size: 0.9rem;">
                                This will reset your progress with the current pup.
                            </p>
                        </div>
                    `,
                    {
                        showContinue: true,
                        onContinue: () => {
                            window.Game.resetGame();
                        }
                    }
                );
            });
            cleanupFunctions.push(resetCleanup);
        }

        return function cleanup() {
            cleanupFunctions.forEach(fn => fn());
        };
    }
};
