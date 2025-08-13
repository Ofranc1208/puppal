// Game State Management
window.GameState = {
    // Current game state
    current: {
        scene: 'selectPup',
        selectedPup: null,
        day: 1,
        careTasks: {
            feed: false,
            water: false,
            brush: false,
            clothes: false
        },
        missionCompleted: false,
        playCompleted: false,
        bathCompleted: false,
        soundEnabled: true,
        lastSaved: null
    },

    // State management methods
    init: function() {
        this.load();
        this.migrateOldData();
        this.startAutoSave();
        console.log('GameState initialized:', this.current);
    },

    // Scene management
    setScene: function(sceneName) {
        console.log(`Scene change: ${this.current.scene} -> ${sceneName}`);
        this.current.scene = sceneName;
        this.save();
    },

    getScene: function() {
        return this.current.scene;
    },

    // Pup selection
    selectPup: function(pupId) {
        const pup = window.GameData.getPup(pupId);
        if (pup) {
            this.current.selectedPup = pup;
            console.log('Pup selected:', pup.name);
            this.save();
            return true;
        }
        return false;
    },

    getSelectedPup: function() {
        return this.current.selectedPup;
    },

    // Care task management
    completeTask: function(taskId) {
        if (this.current.careTasks.hasOwnProperty(taskId)) {
            this.current.careTasks[taskId] = true;
            console.log(`Task completed: ${taskId}`);
            this.save();
            return true;
        }
        return false;
    },

    isTaskCompleted: function(taskId) {
        return this.current.careTasks[taskId] === true;
    },

    areAllTasksCompleted: function() {
        return Object.values(this.current.careTasks).every(completed => completed);
    },

    getCompletedTasksCount: function() {
        return Object.values(this.current.careTasks).filter(completed => completed).length;
    },

    getTotalTasksCount: function() {
        return Object.keys(this.current.careTasks).length;
    },

    // Mission and activity completion
    completeMission: function() {
        this.current.missionCompleted = true;
        console.log('Mission completed');
        this.save();
    },

    completePlay: function() {
        this.current.playCompleted = true;
        console.log('Play completed');
        this.save();
    },

    completeBath: function() {
        this.current.bathCompleted = true;
        console.log('Bath completed');
        this.save();
    },

    // Day progression
    nextDay: function() {
        this.current.day++;
        this.resetDailyTasks();
        console.log(`Starting day ${this.current.day}`);
        this.save();
    },

    resetDailyTasks: function() {
        // Reset all daily tasks
        Object.keys(this.current.careTasks).forEach(task => {
            this.current.careTasks[task] = false;
        });
        this.current.missionCompleted = false;
        this.current.playCompleted = false;
        this.current.bathCompleted = false;
    },

    // Progress calculation
    getDayProgress: function() {
        const totalSteps = 7; // Care tasks (4) + mission (1) + play (1) + bath (1)
        let completed = 0;

        // Count completed care tasks
        completed += this.getCompletedTasksCount();

        // Count other completed activities
        if (this.current.missionCompleted) completed++;
        if (this.current.playCompleted) completed++;
        if (this.current.bathCompleted) completed++;

        return Math.round((completed / totalSteps) * 100);
    },

    // Settings
    toggleSound: function() {
        this.current.soundEnabled = !this.current.soundEnabled;
        console.log('Sound', this.current.soundEnabled ? 'enabled' : 'disabled');
        this.save();
        return this.current.soundEnabled;
    },

    isSoundEnabled: function() {
        return this.current.soundEnabled;
    },

    // Persistence
    save: function() {
        try {
            const stateToSave = {
                ...this.current,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem('pupPalGameState', JSON.stringify(stateToSave));
            console.log('Game state saved');
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    },

    load: function() {
        try {
            const savedState = localStorage.getItem('pupPalGameState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.current = { ...this.current, ...parsedState };
                console.log('Game state loaded from localStorage');
            } else {
                console.log('No saved state found, using defaults');
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
            console.log('Using default state');
        }
    },

    // Auto-save functionality
    startAutoSave: function() {
        setInterval(() => {
            this.save();
        }, window.GameData.config.autoSaveInterval);
    },

    // Reset game
    reset: function() {
        localStorage.removeItem('pupPalGameState');
        this.current = {
            scene: 'selectPup',
            selectedPup: null,
            day: 1,
            careTasks: {
                feed: false,
                water: false,
                brush: false,
                clothes: false
            },
            missionCompleted: false,
            playCompleted: false,
            bathCompleted: false,
            soundEnabled: true,
            lastSaved: null
        };
        console.log('Game state reset');
    },

    // Migration helper for old save data
    migrateOldData: function() {
        if (this.current.selectedPup) {
            // Handle old pup IDs
            const oldToNewMap = {
                'rofa': 'rover',
                'bingo': 'trooper'
            };
            
            if (oldToNewMap[this.current.selectedPup.id]) {
                const newId = oldToNewMap[this.current.selectedPup.id];
                this.current.selectedPup = window.GameData.getPup(newId);
                this.save();
                console.log('Migrated old pup data');
            }
        }
    },

    // Debug helpers
    debugInfo: function() {
        return {
            scene: this.current.scene,
            pup: this.current.selectedPup?.name || 'None',
            day: this.current.day,
            progress: this.getDayProgress() + '%',
            tasks: this.current.careTasks,
            mission: this.current.missionCompleted,
            play: this.current.playCompleted,
            bath: this.current.bathCompleted,
            sound: this.current.soundEnabled
        };
    }
};
