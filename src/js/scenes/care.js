// Care Tasks Scene
window.CareScene = {
    mount: function(gameRoot, gameState) {
        console.log('Mounting Care scene');
        
        const pup = gameState.getSelectedPup();
        if (!pup) {
            console.error('No pup selected for care scene');
            window.goToScene('selectPup');
            return () => {};
        }

        const tasks = window.GameData.careTasks;
        
        const container = window.UI.createElement('div', 'care-container fade-in');
        container.innerHTML = `
            <div class="care-header">
                <h2>Take Care of ${pup.name}</h2>
                <p class="care-subtitle">Complete all care tasks to unlock the next activity!</p>
                <div class="progress-info" style="margin-top: 1rem;">
                    <span id="task-progress">${gameState.getCompletedTasksCount()}/${gameState.getTotalTasksCount()} tasks completed</span>
                </div>
            </div>
            
            <div class="care-grid" id="care-grid">
                ${Object.values(tasks).map(task => {
                    const isCompleted = gameState.isTaskCompleted(task.id);
                    return `
                        <button class="care-task ${isCompleted ? 'completed' : ''}" 
                                data-task-id="${task.id}"
                                ${isCompleted ? 'disabled' : ''}
                                aria-label="${task.description}">
                            <div class="care-icon">${task.icon}</div>
                            <div class="care-name">${task.name}</div>
                        </button>
                    `;
                }).join('')}
            </div>
        `;

        gameRoot.appendChild(container);

        const taskButtons = container.querySelectorAll('.care-task');
        const progressElement = container.querySelector('#task-progress');
        const cleanupFunctions = [];

        taskButtons.forEach(button => {
            const taskId = button.dataset.taskId;
            const task = tasks[taskId];
            
            if (gameState.isTaskCompleted(taskId)) {
                return; // Skip completed tasks
            }

            // Add touch feedback
            window.UI.addTouchFeedback(button);
            
            // Handle task completion
            const cleanup = window.InputManager.addTap(button, () => {
                this.performTask(button, task, gameState, progressElement);
            });
            
            cleanupFunctions.push(cleanup);

            // Keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });

        // Return cleanup function
        return function cleanup() {
            console.log('Cleaning up Care scene');
            cleanupFunctions.forEach(fn => fn());
        };
    },

    // Perform a care task
    performTask: function(button, task, gameState, progressElement) {
        // Disable button and show loading state
        button.disabled = true;
        button.classList.add('pulse');
        
        const originalContent = button.innerHTML;
        button.innerHTML = `
            <div class="care-icon">⏳</div>
            <div class="care-name">Working...</div>
        `;

        // Simulate task duration
        setTimeout(() => {
            // Mark task as completed
            window.completeTask(task.id);
            
            // Update button appearance
            button.classList.remove('pulse');
            button.classList.add('completed', 'task-complete');
            button.innerHTML = `
                <div class="care-icon">✅</div>
                <div class="care-name">Done!</div>
            `;

            // Update progress
            progressElement.textContent = `${gameState.getCompletedTasksCount()}/${gameState.getTotalTasksCount()} tasks completed`;

            // Add sparkle effect
            const rect = button.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            window.UI.createSparkle(centerX, centerY);
            
            // Check if all tasks are completed
            if (gameState.areAllTasksCompleted()) {
                this.showAllTasksComplete(gameState);
            }
            
        }, task.duration);
    },

    // Show completion message when all tasks are done
    showAllTasksComplete: function(gameState) {
        const pup = gameState.getSelectedPup();
        
        setTimeout(() => {
            window.UI.showModal(
                'Great Job!',
                `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                        <p style="font-size: 1.2rem; margin-bottom: 1rem;">
                            ${pup.name} is all taken care of and ready for an adventure!
                        </p>
                        <p>Time for a special mission!</p>
                    </div>
                `,
                {
                    onContinue: () => {
                        setTimeout(() => {
                            window.goToScene('mission');
                        }, 300);
                    }
                }
            );
        }, 1000);
    }
};
