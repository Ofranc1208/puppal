// Game Data Configuration
window.GameData = {
    // Pup definitions
    pups: {
        rover: {
            id: 'rover',
            name: 'Rover',
            breed: 'Golden Retriever',
            emoji: '🐕',
            color: '#F5A623',
            personality: 'Friendly and energetic'
        },
        trooper: {
            id: 'trooper',
            name: 'Trooper',
            breed: 'German Shepherd',
            emoji: '🐕‍🦺',
            color: '#4A90E2',
            personality: 'Loyal and brave'
        },
        bluey: {
            id: 'bluey',
            name: 'Bluey',
            breed: 'Blue Heeler',
            emoji: '🦮',
            color: '#7ED321',
            personality: 'Playful and curious'
        }
    },

    // Care tasks configuration
    careTasks: {
        feed: {
            id: 'feed',
            name: 'Feed',
            icon: '🍖',
            description: 'Give your pup a nutritious meal',
            duration: 2000
        },
        water: {
            id: 'water',
            name: 'Water',
            icon: '💧',
            description: 'Fresh water for hydration',
            duration: 1500
        },
        brush: {
            id: 'brush',
            name: 'Brush Teeth',
            icon: '🪥',
            description: 'Keep those teeth sparkling clean',
            duration: 3000
        },
        clothes: {
            id: 'clothes',
            name: 'Get Dressed',
            icon: '👕',
            description: 'Put on comfortable clothes',
            duration: 2500
        }
    },

    // Science facts organized by context
    scienceFacts: {
        feeding: [
            "Dogs have about 1,700 taste buds compared to humans who have about 9,000!",
            "A dog's digestive system is much shorter than ours - food moves through in about 8-10 hours.",
            "Dogs can't taste sweet flavors as well as we can, but they're great at tasting meat and fat!"
        ],
        water: [
            "Dogs need about 1 ounce of water per pound of body weight each day.",
            "A dog's tongue acts like a tiny ladle, curling backward to scoop up water efficiently.",
            "Dogs can survive much longer without food than without water - staying hydrated is super important!"
        ],
        dental: [
            "Adult dogs have 42 teeth - that's 10 more than adult humans!",
            "Dogs lose their baby teeth just like we do, usually between 3-6 months old.",
            "A dog's bite force can be 200-400 pounds per square inch - that's why dental care matters!"
        ],
        grooming: [
            "Dogs have a double coat - a soft undercoat for warmth and a tougher outer coat for protection.",
            "A dog's fur grows in cycles, which is why they shed seasonally.",
            "Some dog breeds don't shed much because their hair keeps growing like ours does!"
        ],
        play: [
            "Play fighting helps puppies learn bite control and social skills.",
            "Dogs play to bond with each other and release energy - it's like exercise and friendship combined!",
            "When dogs play bow (front down, rear up), they're saying 'everything I do now is just for fun!'"
        ],
        bathing: [
            "Dogs naturally produce oils in their skin that help keep them waterproof and healthy.",
            "A dog's skin is much thinner than human skin, so gentle products are important.",
            "Most dogs only need baths every 6-12 weeks unless they get extra dirty or smelly!"
        ],
        sleep: [
            "Dogs sleep 12-14 hours a day on average - they're professional nappers!",
            "Dogs dream just like we do, and you might see them moving their legs while dreaming of running.",
            "Puppies and senior dogs need even more sleep to help their bodies grow and recover."
        ],
        general: [
            "Dogs have an incredible sense of smell - about 10,000 to 100,000 times better than ours!",
            "A dog's nose print is unique, just like our fingerprints.",
            "Dogs can hear sounds at frequencies twice as high as humans can detect.",
            "The average dog can learn about 150 words and can count up to 4 or 5!"
        ]
    },

    // Mission types for variety
    missions: [
        {
            type: 'fetch',
            name: 'Fetch the Disc',
            description: 'Help your pup catch the flying disc!',
            icon: '🥏'
        },
        {
            type: 'stars',
            name: 'Collect Stars',
            description: 'Tap all the twinkling stars!',
            icon: '⭐'
        },
        {
            type: 'treats',
            name: 'Find Treats',
            description: 'Help your pup find hidden treats!',
            icon: '🦴'
        }
    ],

    // Game configuration
    config: {
        wiggleThreshold: 30,        // Minimum movement for wiggle detection
        wiggleTimeWindow: 5000,     // Time window for wiggle detection (ms)
        wiggleMinMoves: 3,          // Minimum direction changes for wake up
        bathBubbleTarget: 20,       // Number of bubbles needed for bath completion
        discThrowSpeed: 800,        // Disc throw animation duration
        autoSaveInterval: 5000,     // Auto-save interval (ms)
        soundEnabled: true,         // Sound effects enabled by default
        animationSpeed: 1.0,        // Animation speed multiplier
        touchFeedbackDelay: 100     // Touch feedback delay (ms)
    },

    // Sound effect mappings (placeholders)
    sounds: {
        wakeUp: 'wake-up.mp3',
        feed: 'feed.mp3',
        water: 'water.mp3',
        brush: 'brush.mp3',
        clothes: 'clothes.mp3',
        cheer: 'cheer.mp3',
        discThrow: 'disc-throw.mp3',
        discCatch: 'disc-catch.mp3',
        bubblePop: 'bubble-pop.mp3',
        snore: 'snore.mp3',
        success: 'success.mp3',
        tap: 'tap.mp3'
    }
};

// Utility functions for data access
window.GameData.getPup = function(id) {
    return this.pups[id] || null;
};

window.GameData.getRandomFact = function(context = 'general') {
    const facts = this.scienceFacts[context] || this.scienceFacts.general;
    return facts[Math.floor(Math.random() * facts.length)];
};

window.GameData.getRandomMission = function() {
    const missions = this.missions;
    return missions[Math.floor(Math.random() * missions.length)];
};

window.GameData.getAllPups = function() {
    return Object.values(this.pups);
};
