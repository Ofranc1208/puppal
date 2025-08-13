// Sound Manager for Kid-Friendly Interactive Audio
window.SoundManager = {
    audioContext: null,
    sounds: {},
    isMuted: false,
    isInitialized: false,

    // Initialize the audio context
    init: function() {
        if (this.isInitialized) return;
        
        try {
            // Create audio context
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            this.isInitialized = true;
            console.log('SoundManager initialized');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    },

    // Resume audio context (required for user interaction)
    resume: function() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },

    // Generate a simple tone
    createTone: function(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext || this.isMuted) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        // Create envelope for smooth sound
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    // Create cheerful success sound
    playSuccess: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Happy chord progression
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.3, 'sine', 0.2);
            }, index * 100);
        });
    },

    // Create gentle tap sound
    playTap: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Soft click sound
        this.createTone(800, 0.1, 'sine', 0.15);
    },

    // Create dog bark sound (kid-friendly)
    playBark: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Friendly bark simulation
        const bark1 = () => this.createTone(220, 0.15, 'sawtooth', 0.2);
        const bark2 = () => this.createTone(180, 0.1, 'sawtooth', 0.15);
        
        bark1();
        setTimeout(bark2, 200);
    },

    // Create eating sound
    playEat: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Munching sound
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createTone(150 + Math.random() * 50, 0.1, 'square', 0.1);
            }, i * 150);
        }
    },

    // Create drinking sound
    playDrink: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Gentle slurping
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                this.createTone(300 + Math.random() * 100, 0.2, 'sine', 0.1);
            }, i * 300);
        }
    },

    // Create brushing sound
    playBrush: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Scrubbing sound
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.createTone(400 + Math.random() * 200, 0.1, 'triangle', 0.08);
            }, i * 100);
        }
    },

    // Create clothing rustle
    playClothes: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Fabric sound
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createTone(600 + Math.random() * 300, 0.15, 'triangle', 0.06);
            }, i * 120);
        }
    },

    // Create bubble pop sound
    playBubble: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Pop sound
        this.createTone(1000, 0.05, 'sine', 0.1);
        setTimeout(() => {
            this.createTone(800, 0.03, 'sine', 0.05);
        }, 50);
    },

    // Create disc throw sound
    playDiscThrow: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Whoosh sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    },

    // Create disc catch sound
    playDiscCatch: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Satisfying catch sound
        this.createTone(400, 0.1, 'sine', 0.2);
        setTimeout(() => {
            this.createTone(500, 0.1, 'sine', 0.15);
        }, 100);
    },

    // Create wake up sound
    playWakeUp: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Rising tone like a yawn
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1);
    },

    // Create snoring sound
    playSnore: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Gentle snoring
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createTone(80 + Math.random() * 20, 0.8, 'triangle', 0.05);
            }, i * 1000);
        }
    },

    // Create cheer sound
    playCheer: function() {
        if (!this.audioContext || this.isMuted) return;
        
        // Celebratory sound
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, 0.2, 'sine', 0.15);
            }, index * 80);
        });
    },

    // Set mute state
    setMuted: function(muted) {
        this.isMuted = muted;
    },

    // Play sound by name
    play: function(soundName) {
        if (!this.isInitialized) {
            this.init();
        }
        
        this.resume(); // Ensure audio context is active
        
        // Map sound names to functions
        const soundMap = {
            'tap': () => this.playTap(),
            'success': () => this.playSuccess(),
            'wakeUp': () => this.playWakeUp(),
            'feed': () => this.playEat(),
            'water': () => this.playDrink(),
            'brush': () => this.playBrush(),
            'clothes': () => this.playClothes(),
            'cheer': () => this.playCheer(),
            'discThrow': () => this.playDiscThrow(),
            'discCatch': () => this.playDiscCatch(),
            'bubblePop': () => this.playBubble(),
            'snore': () => this.playSnore(),
            'bark': () => this.playBark()
        };

        const soundFunction = soundMap[soundName];
        if (soundFunction) {
            soundFunction();
        } else {
            console.log(`Sound effect: ${soundName} (not implemented)`);
        }
    }
};
