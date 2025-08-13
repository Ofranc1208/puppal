// Pup Selection Scene
window.SelectPupScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting SelectPup scene');
        
        const pups = window.GameData.getAllPups();
        
        const container = window.UI.createElement('div', 'pup-selection fade-in');
        container.innerHTML = `
            <h1>Choose Your Pup Pal!</h1>
            <p class="care-subtitle">Select a furry friend to start your adventure</p>
            <div class="pup-grid" id="pup-grid">
                ${pups.map(pup => `
                    <div class="pup-card touchable no-select" data-pup-id="${pup.id}" role="button" tabindex="0" aria-label="Select ${pup.name}">
                        <div class="pup-avatar" style="background: linear-gradient(135deg, ${pup.color}, #7ED321);">
                            ${pup.image ? `<img src="${pup.image}" alt="${pup.name}" style="width: 100%; height: 100%; object-fit: contain;">` : pup.emoji}
                        </div>
                        <div class="pup-name">${pup.name}</div>
                        <div class="pup-breed">${pup.breed}</div>
                    </div>
                `).join('')}
            </div>
        `;

        gameRoot.appendChild(container);

        // Add event listeners for pup selection
        const pupCards = container.querySelectorAll('.pup-card');
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
