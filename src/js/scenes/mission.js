// Mission Scene
window.MissionScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting Mission scene');
        
        const pup = gameState.getSelectedPup();
        if (!pup) {
            console.error('No pup selected for mission scene');
            window.goToScene('selectPup');
            return () => {};
        }

        // Get a random mission or default to fetch
        const mission = window.GameData.getRandomMission();
        
        const container = window.UI.createElement('div', 'pup-display fade-in');
        container.innerHTML = `
            <h2>${mission.name}</h2>
            <div class="pup-character bounce" style="background: linear-gradient(135deg, ${pup.color}, #F5A623);">
                ${pup.emoji}
            </div>
            <p class="pup-status">
                ${pup.name} is ready for a mission!
            </p>
            <div class="mission-area" id="mission-area">
                ${this.createMissionContent(mission)}
            </div>
        `;

        gameRoot.appendChild(container);

        // Set up mission-specific interactions
        const cleanup = this.setupMissionInteractions(mission, container, gameState);

        // Return cleanup function
        return function cleanup() {
            console.log('Cleaning up Mission scene');
            if (cleanup) cleanup();
        };
    },

    // Create mission-specific content
    createMissionContent: function(mission) {
        switch (mission.type) {
            case 'fetch':
                return `
                    <div style="text-align: center; margin: 2rem 0;">
                        <p style="margin-bottom: 1rem;">${mission.description}</p>
                        <div class="btn btn-primary btn-large" id="start-fetch" role="button" tabindex="0">
                            ${mission.icon} Start Fetch Game
                        </div>
                    </div>
                `;
            
            case 'stars':
                return `
                    <div style="text-align: center; margin: 1rem 0;">
                        <p style="margin-bottom: 1rem;">${mission.description}</p>
                        <div id="stars-game" style="position: relative; height: 200px; background: linear-gradient(135deg, #4A90E2, #9013FE); border-radius: 1rem; margin: 1rem 0;">
                            ${this.createStars()}
                        </div>
                        <div id="stars-count" style="font-size: 1.2rem; margin-top: 1rem;">
                            ⭐ 0/5 stars collected
                        </div>
                    </div>
                `;
            
            case 'treats':
                return `
                    <div style="text-align: center; margin: 1rem 0;">
                        <p style="margin-bottom: 1rem;">${mission.description}</p>
                        <div id="treats-game" style="position: relative; height: 200px; background: linear-gradient(135deg, #7ED321, #F5A623); border-radius: 1rem; margin: 1rem 0;">
                            ${this.createTreats()}
                        </div>
                        <div id="treats-count" style="font-size: 1.2rem; margin-top: 1rem;">
                            🦴 0/3 treats found
                        </div>
                    </div>
                `;
            
            default:
                return `
                    <div style="text-align: center; margin: 2rem 0;">
                        <p style="margin-bottom: 1rem;">Simple mission complete!</p>
                        <div class="btn btn-success btn-large" id="complete-mission" role="button" tabindex="0">
                            ✅ Mission Complete
                        </div>
                    </div>
                `;
        }
    },

    // Create stars for star collection game
    createStars: function() {
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            const x = 20 + (i * 15) + Math.random() * 10;
            const y = 20 + Math.random() * 60;
            starsHtml += `
                <div class="mission-star sparkle" 
                     data-star-id="${i}"
                     style="position: absolute; left: ${x}%; top: ${y}%; font-size: 2rem; cursor: pointer;"
                     role="button" tabindex="0" aria-label="Collect star ${i + 1}">
                    ⭐
                </div>
            `;
        }
        return starsHtml;
    },

    // Create treats for treat finding game
    createTreats: function() {
        let treatsHtml = '';
        for (let i = 0; i < 3; i++) {
            const x = 25 + (i * 25) + Math.random() * 15;
            const y = 30 + Math.random() * 40;
            treatsHtml += `
                <div class="mission-treat bounce" 
                     data-treat-id="${i}"
                     style="position: absolute; left: ${x}%; top: ${y}%; font-size: 2rem; cursor: pointer;"
                     role="button" tabindex="0" aria-label="Collect treat ${i + 1}">
                    🦴
                </div>
            `;
        }
        return treatsHtml;
    },

    // Set up mission-specific interactions
    setupMissionInteractions: function(mission, container, gameState) {
        const cleanupFunctions = [];

        switch (mission.type) {
            case 'fetch':
                const fetchButton = container.querySelector('#start-fetch');
                if (fetchButton) {
                    window.UI.addTouchFeedback(fetchButton);
                    
                    const cleanup = window.InputManager.addTap(fetchButton, () => {
                        window.UI.playSfx('tap');
                        window.completeMission();
                    });
                    cleanupFunctions.push(cleanup);
                }
                break;
                
            case 'stars':
                const stars = container.querySelectorAll('.mission-star');
                const starsCount = container.querySelector('#stars-count');
                let collectedStars = 0;
                
                stars.forEach(star => {
                    const cleanup = window.InputManager.addTap(star, () => {
                        star.style.display = 'none';
                        collectedStars++;
                        starsCount.textContent = `⭐ ${collectedStars}/5 stars collected`;
                        window.UI.playSfx('tap');
                        
                        // Create sparkle effect
                        const rect = star.getBoundingClientRect();
                        window.UI.createSparkle(rect.left + 10, rect.top + 10);
                        
                        if (collectedStars >= 5) {
                            setTimeout(() => {
                                window.completeMission();
                            }, 500);
                        }
                    });
                    cleanupFunctions.push(cleanup);
                });
                break;
                
            case 'treats':
                const treats = container.querySelectorAll('.mission-treat');
                const treatsCount = container.querySelector('#treats-count');
                let collectedTreats = 0;
                
                treats.forEach(treat => {
                    const cleanup = window.InputManager.addTap(treat, () => {
                        treat.classList.add('zoom');
                        setTimeout(() => {
                            treat.style.display = 'none';
                        }, 300);
                        
                        collectedTreats++;
                        treatsCount.textContent = `🦴 ${collectedTreats}/3 treats found`;
                        window.UI.playSfx('tap');
                        
                        if (collectedTreats >= 3) {
                            setTimeout(() => {
                                window.completeMission();
                            }, 800);
                        }
                    });
                    cleanupFunctions.push(cleanup);
                });
                break;
                
            default:
                const completeButton = container.querySelector('#complete-mission');
                if (completeButton) {
                    window.UI.addTouchFeedback(completeButton);
                    
                    const cleanup = window.InputManager.addTap(completeButton, () => {
                        window.UI.playSfx('success');
                        window.completeMission();
                    });
                    cleanupFunctions.push(cleanup);
                }
                break;
        }

        return function cleanup() {
            cleanupFunctions.forEach(fn => fn());
        };
    }
};
