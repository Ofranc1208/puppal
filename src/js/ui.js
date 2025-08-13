// UI Helper Functions
window.UI = {
    // DOM selection helpers
    qs: function(selector) {
        return document.querySelector(selector);
    },

    qsa: function(selector) {
        return document.querySelectorAll(selector);
    },

    // Element creation helpers
    createElement: function(tag, className = '', textContent = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    },

    createButton: function(text, className = '', onclick = null) {
        const button = this.createElement('button', `btn ${className}`, text);
        if (onclick) button.addEventListener('click', onclick);
        return button;
    },

    // Progress bar management
    setProgress: function(percentage) {
        const progressFill = this.qs('#progress-fill');
        const progressText = this.qs('#progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }
        
        if (progressText) {
            const day = window.GameState ? window.GameState.current.day : 1;
            progressText.textContent = `Day ${day} - ${Math.round(percentage)}%`;
        }
    },

    // Modal management
    showModal: function(title, content, options = {}) {
        const {
            showContinue = true,
            onContinue = null,
            onClose = null,
            className = ''
        } = options;

        const overlay = this.qs('#modal-overlay');
        const modalTitle = this.qs('#modal-title');
        const modalBody = this.qs('#modal-body');
        const continueBtn = this.qs('#modal-continue');
        const closeBtn = this.qs('#modal-close');
        const modal = this.qs('.modal');

        if (!overlay) {
            console.error('Modal overlay not found');
            return;
        }

        // Set content
        if (modalTitle) modalTitle.textContent = title;
        if (modalBody) modalBody.innerHTML = content;
        
        // Add custom class
        if (className && modal) {
            modal.className = `modal ${className}`;
        }

        // Show/hide continue button
        if (continueBtn) {
            continueBtn.style.display = showContinue ? 'inline-flex' : 'none';
        }

        // Set up event handlers
        const handleContinue = () => {
            this.hideModal();
            if (onContinue) onContinue();
        };

        const handleClose = () => {
            this.hideModal();
            if (onClose) onClose();
        };

        // Remove old listeners
        if (continueBtn) {
            continueBtn.replaceWith(continueBtn.cloneNode(true));
            const newContinueBtn = this.qs('#modal-continue');
            newContinueBtn.addEventListener('click', handleContinue);
        }

        if (closeBtn) {
            closeBtn.replaceWith(closeBtn.cloneNode(true));
            const newCloseBtn = this.qs('#modal-close');
            newCloseBtn.addEventListener('click', handleClose);
        }

        // Show modal with animation
        overlay.classList.remove('hidden');
        if (modal) {
            modal.classList.add('fade-in');
        }
    },

    hideModal: function() {
        const overlay = this.qs('#modal-overlay');
        const modal = this.qs('.modal');
        
        if (modal) {
            modal.classList.add('fade-out');
            setTimeout(() => {
                if (overlay) overlay.classList.add('hidden');
                if (modal) {
                    modal.classList.remove('fade-in', 'fade-out');
                    modal.className = 'modal'; // Reset to default classes
                }
            }, 300);
        } else if (overlay) {
            overlay.classList.add('hidden');
        }
    },

    // Fact modal specifically
    showFact: function(fact, context = 'general', onContinue = null) {
        const contextEmojis = {
            feeding: '🍖',
            water: '💧',
            dental: '🪥',
            grooming: '👕',
            play: '🎾',
            bathing: '🛁',
            sleep: '😴',
            general: '🧠'
        };

        const emoji = contextEmojis[context] || contextEmojis.general;
        const content = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">${emoji}</div>
            </div>
            <p style="font-size: 1.1rem; line-height: 1.6;">${fact}</p>
        `;

        this.showModal('Fun Fact!', content, {
            onContinue,
            className: 'fact-modal'
        });
    },

    // Toast notifications
    showToast: function(message, type = 'success', duration = 3000) {
        const container = this.qs('#toast-container');
        if (!container) {
            console.error('Toast container not found');
            return;
        }

        const toast = this.createElement('div', `toast toast-${type}`);
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    // Sound effect helper
    playSfx: function(soundName) {
        if (!window.GameState?.isSoundEnabled()) {
            return;
        }

        const soundFile = window.GameData?.sounds[soundName];
        if (!soundFile) {
            console.log(`Sound effect placeholder: ${soundName}`);
            return;
        }

        // TODO: Replace with actual audio playback when sound files are added
        console.log(`Playing SFX: ${soundFile}`);
        
        // For now, show a visual feedback for sound
        this.showToast(`🔊 ${soundName}`, 'info', 1000);
    },

    // Animation helpers
    addAnimation: function(element, animationClass, onComplete = null) {
        if (!element) return;

        const handleAnimationEnd = () => {
            element.classList.remove(animationClass);
            element.removeEventListener('animationend', handleAnimationEnd);
            if (onComplete) onComplete();
        };

        element.addEventListener('animationend', handleAnimationEnd);
        element.classList.add(animationClass);
    },

    // Sparkle effect
    createSparkle: function(x, y, container = document.body) {
        const sparkle = this.createElement('div', 'sparkle-effect');
        sparkle.style.position = 'absolute';
        sparkle.style.left = `${x - 8}px`;
        sparkle.style.top = `${y - 8}px`;
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';

        container.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    },

    // Bubble effect
    createBubble: function(x, y, container = document.body) {
        const bubble = this.createElement('div', 'bubble-effect');
        bubble.style.position = 'absolute';
        bubble.style.left = `${x - 10}px`;
        bubble.style.top = `${y - 10}px`;
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '1000';

        container.appendChild(bubble);

        // Remove after animation
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
        }, 2000);
    },

    // Scene transition helper
    transitionToScene: function(newSceneFunction, gameRoot) {
        if (!gameRoot) {
            console.error('Game root not provided for scene transition');
            return;
        }

        // Add exit animation to current content
        const currentContent = gameRoot.firstElementChild;
        if (currentContent) {
            currentContent.classList.add('scene-exit');
            
            setTimeout(() => {
                // Clear current content
                gameRoot.innerHTML = '';
                
                // Mount new scene
                if (newSceneFunction) {
                    newSceneFunction();
                }
                
                // Add enter animation to new content
                const newContent = gameRoot.firstElementChild;
                if (newContent) {
                    newContent.classList.add('scene-enter');
                    requestAnimationFrame(() => {
                        newContent.classList.add('scene-enter-active');
                    });
                }
            }, 300);
        } else {
            // No current content, mount immediately
            if (newSceneFunction) {
                newSceneFunction();
            }
            
            const newContent = gameRoot.firstElementChild;
            if (newContent) {
                newContent.classList.add('scene-enter');
                requestAnimationFrame(() => {
                    newContent.classList.add('scene-enter-active');
                });
            }
        }
    },

    // Utility functions
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    },

    // Touch feedback
    addTouchFeedback: function(element) {
        if (!element) return;

        const feedback = () => {
            element.style.transform = 'scale(0.95)';
            element.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, window.GameData?.config?.touchFeedbackDelay || 100);
        };

        element.addEventListener('touchstart', feedback);
        element.addEventListener('mousedown', feedback);
    }
};
