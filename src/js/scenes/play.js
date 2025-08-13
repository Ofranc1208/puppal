// Play Scene with Disc Game
window.PlayScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting Play scene');
        
        const pup = gameState.getSelectedPup();
        if (!pup) {
            console.error('No pup selected for play scene');
            window.goToScene('selectPup');
            return () => {};
        }

        const container = window.UI.createElement('div', 'pup-display fade-in');
        container.innerHTML = `
            <h2>Play Time with ${pup.name}!</h2>
            <p class="pup-status">
                🎾 Time for some fun! Let's play fetch with the disc.
            </p>
            <div id="disc-game-container">
                <!-- Disc game will be mounted here -->
            </div>
        `;

        gameRoot.appendChild(container);

        const gameContainer = container.querySelector('#disc-game-container');
        
        // Initialize the disc game
        const discGameCleanup = window.DiscGame.init(
            gameContainer,
            pup,
            (success) => this.onGameComplete(success, pup)
        );

        // Return cleanup function
        return function cleanup() {
            console.log('Cleaning up Play scene');
            if (discGameCleanup) {
                discGameCleanup();
            }
        };
    },

    // Handle game completion
    onGameComplete: function(success, pup) {
        if (success) {
            // Show success message with sparkles
            window.UI.showModal(
                'Amazing Catch!',
                `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🏆</div>
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                            ${pup.name} caught the disc perfectly! What a superstar!
                        </p>
                        <p>Time for a relaxing bath!</p>
                    </div>
                `,
                {
                    onContinue: () => {
                        window.completePlay();
                    }
                }
            );
        } else {
            // Show encouragement message (though currently disc game always succeeds)
            window.UI.showModal(
                'Good Try!',
                `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">👏</div>
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                            ${pup.name} had fun playing! Practice makes perfect.
                        </p>
                        <p>Let's move on to bath time!</p>
                    </div>
                `,
                {
                    onContinue: () => {
                        window.completePlay();
                    }
                }
            );
        }
    }
};
