// Pup Selection Scene
window.SelectPupScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting SelectPup scene');
        
        const pups = window.GameData.getAllPups();
        
        const container = window.UI.createElement('div', 'scene-container royal-scene');
        container.innerHTML = `
            <div class="scene-content">
                <div class="scene-header">
                    <h1 class="scene-title">👑 Choose Your Royal Companion!</h1>
                    <p class="scene-subtitle">Select a noble friend to begin your magical journey</p>
                </div>
                
                <div class="royal-selection-grid" id="pup-grid">
                    ${pups.map(pup => `
                        <div class="royal-pet-card kid-friendly-card" data-pup-id="${pup.id}" role="button" tabindex="0" aria-label="Select ${pup.name}">
                            <div class="pet-image-container" style="background: linear-gradient(135deg, ${pup.color}22, ${pup.color}11);">
                                <div class="pet-emoji">${pup.emoji}</div>
                                <div class="pet-crown">${pup.crown}</div>
                            </div>
                            <div class="pet-info">
                                <h3 class="pet-name">${pup.name}</h3>
                                <p class="pet-breed">${pup.breed}</p>
                                <p class="pet-personality">${pup.personality}</p>
                            </div>
                            <div class="selection-indicator">
                                <span class="select-text">Tap to Choose</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        gameRoot.appendChild(container);

        // Add event listeners for pup selection
        const pupCards = container.querySelectorAll('.royal-pet-card');
        const cleanupFunctions = [];

        pupCards.forEach(card => {
            const pupId = card.dataset.pupId;
            
            // Add touch feedback
            window.UI.addTouchFeedback(card);
            
            // Handle selection
            const cleanup = window.InputManager.addTap(card, () => {
                // Visual feedback
                card.classList.add('bounce');
                window.UI.playSfx('tap');
                
                // Disable other cards temporarily
                pupCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.style.opacity = '0.5';
                        otherCard.style.pointerEvents = 'none';
                    }
                });
                
                // Select the pup after animation
                setTimeout(() => {
                    window.selectPup(pupId);
                }, 300);
            });
            
            cleanupFunctions.push(cleanup);

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Hover effects for desktop
            card.addEventListener('mouseenter', () => {
                if (!window.UI.isMobile()) {
                    card.classList.add('pulse');
                }
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('pulse');
            });
        });

        // Return cleanup function
        return function cleanup() {
            console.log('Cleaning up SelectPup scene');
            cleanupFunctions.forEach(fn => fn());
        };
    }
};
