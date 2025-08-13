// Touch and Mouse Input Handling
window.InputManager = {
    // Touch/drag event handler with wiggle detection
    addTouchDrag: function(element, callbacks = {}) {
        const {
            onStart = () => {},
            onMove = () => {},
            onEnd = () => {},
            onWiggle = () => {}
        } = callbacks;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let lastX = 0;
        let lastY = 0;
        let wiggleData = {
            moves: [],
            startTime: null,
            directions: []
        };

        // Helper function to detect wiggle pattern
        const detectWiggle = (currentX) => {
            const now = Date.now();
            const config = window.GameData.config;
            
            // Initialize wiggle tracking
            if (!wiggleData.startTime) {
                wiggleData.startTime = now;
                wiggleData.moves = [{ x: currentX, time: now }];
                wiggleData.directions = [];
                return false;
            }

            // Reset if too much time has passed
            if (now - wiggleData.startTime > config.wiggleTimeWindow) {
                wiggleData.startTime = now;
                wiggleData.moves = [{ x: currentX, time: now }];
                wiggleData.directions = [];
                return false;
            }

            // Track movement
            wiggleData.moves.push({ x: currentX, time: now });

            // Calculate direction changes
            if (wiggleData.moves.length >= 2) {
                const prev = wiggleData.moves[wiggleData.moves.length - 2];
                const curr = wiggleData.moves[wiggleData.moves.length - 1];
                const deltaX = curr.x - prev.x;

                if (Math.abs(deltaX) > config.wiggleThreshold) {
                    const direction = deltaX > 0 ? 'right' : 'left';
                    const lastDirection = wiggleData.directions[wiggleData.directions.length - 1];
                    
                    if (direction !== lastDirection) {
                        wiggleData.directions.push(direction);
                    }
                }
            }

            // Check if we have enough direction changes for a wiggle
            if (wiggleData.directions.length >= config.wiggleMinMoves) {
                // Check for alternating pattern
                let alternating = true;
                for (let i = 1; i < wiggleData.directions.length; i++) {
                    if (wiggleData.directions[i] === wiggleData.directions[i - 1]) {
                        alternating = false;
                        break;
                    }
                }

                if (alternating) {
                    // Reset wiggle data
                    wiggleData = {
                        moves: [],
                        startTime: null,
                        directions: []
                    };
                    return true;
                }
            }

            return false;
        };

        // Mouse events
        const handleMouseDown = (e) => {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            lastX = startX;
            lastY = startY;
            
            element.style.cursor = 'grabbing';
            onStart({ x: startX, y: startY, type: 'mouse' });
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const currentX = e.clientX;
            const currentY = e.clientY;
            const deltaX = currentX - lastX;
            const deltaY = currentY - lastY;

            onMove({ 
                x: currentX, 
                y: currentY, 
                deltaX, 
                deltaY,
                type: 'mouse' 
            });

            // Check for wiggle
            if (detectWiggle(currentX)) {
                onWiggle({ type: 'mouse' });
            }

            lastX = currentX;
            lastY = currentY;
        };

        const handleMouseUp = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            isDragging = false;
            element.style.cursor = 'grab';
            
            onEnd({ 
                x: e.clientX, 
                y: e.clientY, 
                totalDeltaX: e.clientX - startX,
                totalDeltaY: e.clientY - startY,
                type: 'mouse' 
            });
        };

        // Touch events
        const handleTouchStart = (e) => {
            e.preventDefault();
            if (e.touches.length !== 1) return;
            
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            lastX = startX;
            lastY = startY;
            
            onStart({ x: startX, y: startY, type: 'touch' });
        };

        const handleTouchMove = (e) => {
            if (!isDragging || e.touches.length !== 1) return;
            e.preventDefault();

            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            const deltaX = currentX - lastX;
            const deltaY = currentY - lastY;

            onMove({ 
                x: currentX, 
                y: currentY, 
                deltaX, 
                deltaY,
                type: 'touch' 
            });

            // Check for wiggle
            if (detectWiggle(currentX)) {
                onWiggle({ type: 'touch' });
            }

            lastX = currentX;
            lastY = currentY;
        };

        const handleTouchEnd = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            isDragging = false;
            
            // Use the last known position or changedTouches if available
            let endX = lastX;
            let endY = lastY;
            
            if (e.changedTouches && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                endX = touch.clientX;
                endY = touch.clientY;
            }
            
            onEnd({ 
                x: endX, 
                y: endY, 
                totalDeltaX: endX - startX,
                totalDeltaY: endY - startY,
                type: 'touch' 
            });
        };

        // Add event listeners
        element.addEventListener('mousedown', handleMouseDown, { passive: false });
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp, { passive: false });
        
        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Set initial cursor
        element.style.cursor = 'grab';

        // Return cleanup function
        return function cleanup() {
            element.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            element.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            
            element.style.cursor = '';
        };
    },

    // Simple tap/click handler
    addTap: function(element, callback, options = {}) {
        const { 
            preventDefault = true,
            threshold = 10,  // Max movement to still count as tap
            maxDuration = 300  // Max duration to count as tap
        } = options;

        let startTime;
        let startX, startY;

        const handleStart = (e) => {
            if (preventDefault) e.preventDefault();
            
            startTime = Date.now();
            
            if (e.type === 'touchstart') {
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
            }
        };

        const handleEnd = (e) => {
            if (preventDefault) e.preventDefault();
            
            const duration = Date.now() - startTime;
            if (duration > maxDuration) return;

            let endX, endY;
            
            if (e.type === 'touchend' && e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                endX = touch.clientX;
                endY = touch.clientY;
            } else if (e.type === 'mouseup') {
                endX = e.clientX;
                endY = e.clientY;
            } else {
                return;
            }

            const distance = Math.sqrt(
                Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
            );

            if (distance <= threshold) {
                callback({
                    x: endX,
                    y: endY,
                    type: e.type === 'touchend' ? 'touch' : 'mouse'
                });
            }
        };

        element.addEventListener('touchstart', handleStart, { passive: !preventDefault });
        element.addEventListener('touchend', handleEnd, { passive: !preventDefault });
        element.addEventListener('mousedown', handleStart, { passive: !preventDefault });
        element.addEventListener('mouseup', handleEnd, { passive: !preventDefault });

        // Return cleanup function
        return function cleanup() {
            element.removeEventListener('touchstart', handleStart);
            element.removeEventListener('touchend', handleEnd);
            element.removeEventListener('mousedown', handleStart);
            element.removeEventListener('mouseup', handleEnd);
        };
    },

    // Debounced input handler
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttled input handler
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};
