# Pup Pal - Virtual Pet Game

A delightful mobile-first HTML/CSS/JS game where players care for adorable virtual pups through daily routines and fun activities.

## 🐕 Game Overview

**Pup Pal** is a charming virtual pet game designed specifically for mobile devices. Players choose from three unique pups (Rover, Trooper, and Bluey) and guide them through daily care routines, educational activities, and fun mini-games.

### Game Flow

1. **Choose Your Pup** - Select from three adorable pups with unique personalities
2. **Wake Up** - Gently wake your pup with wiggle gestures
3. **Care Tasks** - Complete feeding, watering, dental care, and dressing
4. **Mission** - Unlock special activities like fetch, star collection, or treat hunting
5. **Play Time** - Enjoy the disc throw mini-game with parabolic physics
6. **Bath Time** - Create bubbles and scrub your pup clean
7. **Bedtime** - Tuck your pup in and start a new day

### Educational Features

- **Science Facts** - Learn fun facts about dogs during care activities
- **Interactive Learning** - Educational content woven naturally into gameplay
- **Positive Reinforcement** - Encouragement and celebration of completed tasks

## 🎮 Features

### Core Gameplay
- **Mobile-First Design** - Optimized for touch interactions and small screens
- **Gesture Controls** - Swipe, drag, and tap interactions for natural gameplay
- **State Persistence** - Progress automatically saved to localStorage
- **Progressive Web App Ready** - Responsive design works across all devices

### Technical Highlights
- **Vanilla JavaScript** - No frameworks, clean modular architecture
- **CSS Animations** - Smooth, engaging animations for all interactions
- **Touch-Friendly UI** - All buttons meet 44px minimum touch target size
- **Accessibility** - ARIA labels, keyboard navigation, and reduced motion support
- **Performance Optimized** - Efficient event handling and DOM management

### Interactive Elements
- **Wiggle Detection** - Advanced touch pattern recognition for wake-up sequences
- **Physics-Based Mini-Game** - Realistic disc throwing with parabolic trajectories
- **Bubble System** - Dynamic bubble creation during bath time
- **Sound Effects** - Audio feedback for all interactions (with toggle)

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (required due to ES6 modules and CORS policies)

### Installation

1. **Download or clone** the project files
2. **Navigate** to the `pup-pal` directory
3. **Start a local server** using one of these methods:

#### Option 1: Python (if installed)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -SimpleHTTPServer 8000
```

#### Option 2: Node.js (if installed)
```bash
# Install a simple server globally
npm install -g http-server

# Run the server
http-server
```

#### Option 3: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click on `src/index.html`
3. Select "Open with Live Server"

#### Option 4: Browser Developer Tools (Chrome/Edge)
```bash
# Navigate to the pup-pal/src directory and run:
npx serve .
```

### Running the Game

1. Open your web browser
2. Navigate to `http://localhost:8000/src/` (or the URL shown by your server)
3. The game will automatically load and start with a loading screen, then proceed to pup selection

## 📦 Git Repository

This project is hosted at: [https://github.com/Ofranc1208/puppal.git](https://github.com/Ofranc1208/puppal.git)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Ofranc1208/puppal.git
cd puppal

# Or if starting from scratch
git init
git remote add origin https://github.com/Ofranc1208/puppal.git

# Add all files
git add .
git commit -m "Initial commit: Pup Pal virtual pet game"
git push -u origin main
```

### Development Workflow

```bash
# Make your changes, then:
git add .
git commit -m "Description of changes"
git push origin main
```

## 🏗️ Project Structure

```
pup-pal/
├── public/assets/          # Asset placeholders
│   ├── pups/              # Pup sprites (TODO)
│   ├── ui/                # UI elements (TODO)
│   └── sfx/               # Sound effects (TODO)
├── src/
│   ├── index.html         # Main HTML file
│   ├── styles/            # CSS files
│   │   ├── base.css       # Base styles and variables
│   │   ├── components.css # UI component styles
│   │   └── animations.css # Animation definitions
│   └── js/                # JavaScript modules
│       ├── main.js        # Game controller and initialization
│       ├── state.js       # Game state management
│       ├── data.js        # Game data and configuration
│       ├── input.js       # Touch/mouse input handling
│       ├── ui.js          # UI helper functions
│       ├── scenes/        # Scene modules
│       │   ├── selectPup.js
│       │   ├── wakeUp.js
│       │   ├── care.js
│       │   ├── mission.js
│       │   ├── play.js
│       │   ├── bath.js
│       │   └── bedtime.js
│       └── mini/          # Mini-game modules
│           └── disc.js    # Disc throwing physics
└── README.md
```

## 🎨 Customization

### Adding Assets

The game currently uses placeholder emojis and CSS gradients. To add real assets:

1. **Pup Sprites**: Add PNG files to `public/assets/pups/`
   - `rover.png`, `trooper.png`, `bluey.png`
   - Multiple states: idle, sleeping, awake, happy, playing

2. **UI Elements**: Add icons to `public/assets/ui/`
   - Care task icons, progress elements, buttons

3. **Sound Effects**: Add MP3 files to `public/assets/sfx/`
   - Update `data.js` sound mappings
   - Implement actual audio playback in `ui.js`

### Modifying Game Data

Edit `src/js/data.js` to customize:
- **Pup definitions** - Names, breeds, colors, personalities
- **Science facts** - Educational content for each activity
- **Game configuration** - Timing, difficulty, targets
- **Mission types** - New activities and challenges

### Styling

The game uses CSS custom properties for easy theming:
- **Colors**: Defined in `base.css` root variables
- **Spacing**: Consistent spacing scale
- **Typography**: Font sizes and families
- **Animations**: Customizable timing and effects

## 🧪 Testing

### Manual Testing Checklist

**Mobile Viewport (390x844)**:
- [ ] Pup selection works with touch
- [ ] Wiggle detection triggers wake up
- [ ] All care tasks complete successfully
- [ ] Mission activities are interactive
- [ ] Disc throw has realistic physics
- [ ] Bath bubbles respond to drag
- [ ] Scene transitions are smooth
- [ ] Progress persists on reload

**Accessibility**:
- [ ] All interactive elements have ARIA labels
- [ ] Keyboard navigation works
- [ ] Touch targets are ≥44px
- [ ] Reduced motion preference respected

**Performance**:
- [ ] Smooth animations on mobile devices
- [ ] No memory leaks during extended play
- [ ] Quick scene transitions

## 🐛 Troubleshooting

### Common Issues

**Game doesn't load**:
- Ensure you're running a local server (not opening file:// directly)
- Check browser console for JavaScript errors
- Verify all script files are loading correctly

**Touch interactions not working**:
- Check if device supports touch events
- Ensure preventDefault is not interfering
- Test with mouse as fallback

**Performance issues**:
- Reduce animation complexity in `animations.css`
- Check for memory leaks in scene cleanup functions
- Optimize image assets if added

**State not persisting**:
- Check if localStorage is available
- Verify browser allows local storage for your domain
- Clear storage if corrupted: `localStorage.removeItem('pupPalGameState')`

## 🔧 Development

### Code Architecture

The game follows a modular architecture with clear separation of concerns:

- **State Management**: Centralized in `state.js` with localStorage persistence
- **Scene System**: Each scene is a self-contained module with mount/unmount lifecycle
- **Input Handling**: Unified touch/mouse handling with gesture recognition
- **UI Utilities**: Reusable functions for common interface patterns

### Adding New Scenes

1. Create a new file in `src/js/scenes/`
2. Export an object with a `mount(gameRoot, gameState)` function
3. Return a cleanup function from mount
4. Register the scene in `main.js` getSceneFunction method
5. Add navigation logic in appropriate places

### Performance Considerations

- Use `requestAnimationFrame` for smooth animations
- Clean up event listeners in scene unmount functions
- Avoid excessive DOM queries - cache element references
- Use CSS transforms instead of changing layout properties
- Implement touch event passive listeners where possible

## 📱 Browser Support

**Fully Supported**:
- Chrome/Chromium 70+
- Firefox 65+
- Safari 12+
- Edge 79+

**Partially Supported**:
- Internet Explorer 11 (basic functionality, no modern features)
- Older mobile browsers (may lack some CSS features)

## 📄 License

This project is created as an educational example and is free to use, modify, and distribute.

## 🤝 Contributing

This is a standalone educational project. Feel free to:
- Fork and modify for your own projects
- Use as a learning resource for mobile game development
- Adapt the architecture for similar games

## 📞 Support

For questions about the code or implementation:
1. Check the browser console for error messages
2. Review the troubleshooting section above
3. Examine the modular code structure for understanding

---

**Made with ❤️ for aspiring web game developers**

*Happy gaming with your virtual pup pal!* 🐕✨
