// Wake Up Scene
window.WakeUpScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting WakeUp scene');
        
        const pup = gameState.getSelectedPup();
        if (!pup) {
            console.error('No pup selected for wake up scene');
            window.goToScene('selectPup');
            return () => {};
        }

        const container = window.UI.createElement('div', 'pup-display fade-in');
        container.innerHTML = `
            <h2>Wake up ${pup.name}!</h2>
            <div class="pup-character sleeping" id="sleepy-pup" style="background: linear-gradient(135deg, ${pup.color}, #9013FE);">
                ${pup.image ? `<img src="${pup.image}" alt="${pup.name}" style="width: 80%; height: 80%; object-fit: contain;">` : pup.emoji}
            </div>
            <p class="pup-status" id="wake-status">
                💤 ${pup.name} is sleeping peacefully... 
            </p>
            <p class="care-subtitle">
                Swipe left and right to gently wake them up!
            </p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" id="bark-button" style="display: none;">
                    🐕 Make ${pup.name} Bark!
                </button>
            </div>
        `;

        gameRoot.appendChild(container);

        const pupElement = container.querySelector('#sleepy-pup');
        const statusElement = container.querySelector('#wake-status');
        const barkButton = container.querySelector('#bark-button');
        
        let isAwake = false;
        let wiggleCount = 0;

        // Add bark button functionality
        let barkCleanup = null;
        if (barkButton) {
            window.UI.addTouchFeedback(barkButton);
            barkCleanup = window.InputManager.addTap(barkButton, () => {
                window.UI.playSfx('bark');
                pupElement.classList.add('bounce');
                setTimeout(() => {
                    pupElement.classList.remove('bounce');
                }, 600);
            });
        }

        // Add touch drag functionality with wiggle detection
        const dragCleanup = window.InputManager.addTouchDrag(pupElement, {
            onStart: () => {
                if (isAwake) return;
                window.UI.playSfx('tap');
            },
            
            onMove: (data) => {
                if (isAwake) return;
                
                // Add subtle movement to show responsiveness
                const movement = Math.sin(Date.now() * 0.01) * 5;
                pupElement.style.transform = `translateX(${movement}px)`;
            },
            
            onWiggle: () => {
                if (isAwake) return;
                
                wiggleCount++;
                console.log(`Wiggle detected! Count: ${wiggleCount}`);
                
                // Visual feedback for each wiggle
                pupElement.classList.add('wiggle');
                setTimeout(() => {
                    pupElement.classList.remove('wiggle');
                }, 500);

                // Update status
                const encouragements = [
                    `${pup.name} is stirring...`,
                    `Keep going! ${pup.name} is waking up...`,
                    `Almost there! One more wiggle...`
                ];

                if (wiggleCount < encouragements.length) {
                    statusElement.textContent = encouragements[wiggleCount - 1];
                }

                // Wake up after enough wiggles
                if (wiggleCount >= 3) {
                    this.wakeUpPup(pupElement, statusElement, pup, barkButton);
                    isAwake = true;
                }
            },

            onEnd: () => {
                if (isAwake) return;
                // Reset position
                pupElement.style.transform = '';
            }
        });

        // Return cleanup function
        return function cleanup() {
            console.log('Cleaning up WakeUp scene');
            if (dragCleanup) dragCleanup();
            if (barkCleanup) barkCleanup();
        };
    },

    // Wake up animation and transition
    wakeUpPup: function(pupElement, statusElement, pup, barkButton) {
        // Remove sleeping class and add waking animation
        pupElement.classList.remove('sleeping');
        pupElement.classList.add('waking-up');
        
        // Update status
        statusElement.textContent = `🌅 Good morning, ${pup.name}!`;
        
        // Show bark button
        if (barkButton) {
            barkButton.style.display = 'inline-flex';
            barkButton.classList.add('fade-in');
        }
        
        // Play wake up sound
        window.UI.playSfx('wakeUp');
        
        // Add sparkle effects
        const rect = pupElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create multiple sparkles around the pup
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const offsetX = (Math.random() - 0.5) * 100;
                const offsetY = (Math.random() - 0.5) * 100;
                window.UI.createSparkle(centerX + offsetX, centerY + offsetY);
            }, i * 200);
        }
        
        // Transition to care scene after animation
        setTimeout(() => {
            window.wakeUpComplete();
        }, 2000);
    }
};
