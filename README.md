# CodeRunner - Digital Explorer 🏃‍♂️

A fast-paced digital exploration platformer game built with HTML5 Canvas and JavaScript. Navigate through procedurally generated worlds while collecting data packets and avoiding obstacles.

## 🎮 Features

- **Procedural World Generation**: Infinite, dynamically generated levels
- **Progressive Difficulty**: Game gets harder as you progress
- **Character Customization**: Multiple player sprites to choose from
- **Shop System**: Upgrade your character with various abilities
- **Leaderboard**: Compete with other players online
- **Achievement System**: Unlock achievements as you play
- **Multiple Difficulty Levels**: Choose from Easy to Impossible
- **Power-ups**: Collect various power-ups to enhance gameplay
- **Responsive Controls**: Smooth, responsive player movement
- **Visual Effects**: Particle effects, screen shake, and more

## 🚀 Getting Started

### Prerequisites

- Modern web browser with HTML5 Canvas support
- Python 3.x (for local development server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/coderunner.git
cd coderunner
```

2. Start a local development server:
```bash
npm start
# or
python -m http.server 8000
```

3. Open your browser and navigate to `http://localhost:8000`

## 🎯 How to Play

### Controls

- **Arrow Keys / WASD**: Move left/right
- **Spacebar / Up Arrow**: Jump
- **Shift**: Dash (when upgrade is available)
- **Down Arrow**: Drop through platforms
- **Escape**: Pause game / Navigate back
- **F11**: Toggle fullscreen

### Objective

- Collect data packets to increase your score
- Avoid obstacles like spikes, saws, and lasers
- Survive as long as possible
- Unlock achievements and upgrade your character

## 🏗️ Project Structure

```
CodeRunner/
├── src/
│   ├── core/               # Core game logic
│   │   ├── Game.js         # Main game class
│   │   ├── player.js       # Player character
│   │   ├── WorldGenerator.js # Procedural world generation
│   │   └── ...
│   ├── systems/            # Game systems
│   │   ├── ShopSystem.js   # Shop and upgrades
│   │   ├── LeaderboardSystem.js # Online leaderboard
│   │   └── ...
│   ├── rendering/          # Rendering systems
│   │   ├── GameRenderer.js # Main renderer
│   │   ├── TileRenderer.js # Tile rendering
│   │   └── ...
│   ├── physics/            # Physics engine
│   │   └── physicsengine.js
│   ├── utils/              # Utility functions
│   │   ├── constants.js    # Game constants
│   │   ├── AssetLoader.js  # Asset management
│   │   └── ...
│   └── config/             # Configuration files
│       └── firebase-config.js
├── assets/                 # Game assets
│   ├── sprites/            # Character sprites
│   └── music/              # Background music
├── index.html              # Main HTML file
└── package.json            # Project configuration
```

## 🔧 Development

### Firebase Config (No Hardcoded Secrets)

This project now reads Firebase config from runtime-injected values instead of committed keys.

Local development options:
1. Copy [env-config.example.js](env-config.example.js) to `env-config.js` and fill values.
2. Or define values in `.env` using [.env.example](.env.example) (used by build tooling if introduced).

Netlify deployment:
1. Set these environment variables in Netlify Site settings:
	- `VITE_FIREBASE_API_KEY`
	- `VITE_FIREBASE_AUTH_DOMAIN`
	- `VITE_FIREBASE_DATABASE_URL`
	- `VITE_FIREBASE_PROJECT_ID`
	- `VITE_FIREBASE_STORAGE_BUCKET`
	- `VITE_FIREBASE_MESSAGING_SENDER_ID`
	- `VITE_FIREBASE_APP_ID`
	- `VITE_FIREBASE_MEASUREMENT_ID`
2. `netlify.toml` generates `env-config.js` during build from those vars.

### Code Organization

- **Core**: Main game logic and classes
- **Systems**: Modular game systems (shop, leaderboard, etc.)
- **Rendering**: All rendering-related code
- **Physics**: Collision detection and physics
- **Utils**: Utility functions and helpers

### Performance Optimizations

- Object pooling for particles and effects
- Efficient collision detection with spatial partitioning
- Canvas optimization techniques
- Memory management for large worlds

### Error Handling

- Comprehensive error handling throughout the codebase
- Graceful degradation when features fail
- User-friendly error messages

## 🎨 Customization

### Adding New Sprites

1. Add sprite files to `assets/sprites/`
2. Update the character customization system
3. Configure sprite metadata in ProfileManager

### Creating New Obstacles

1. Add obstacle type to `TILE_TYPES` in constants.js
2. Implement rendering in TileRenderer.js
3. Add collision detection in physicsengine.js
4. Update world generation logic

### Modifying Difficulty

- Adjust constants in `DIFFICULTY_LEVELS`
- Modify progression scaling in WorldGenerator.js
- Update adaptive difficulty system

## 🐛 Known Issues

- Some formatting issues in legacy code (being addressed)
- Performance optimization opportunities exist
- Browser compatibility varies for advanced features

## 📈 Performance

The game is optimized for:
- 60 FPS on modern browsers
- Efficient memory usage
- Responsive controls
- Smooth animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use ES6+ features
- Follow existing naming conventions
- Add comments for complex logic
- Include error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with HTML5 Canvas and modern JavaScript
- Uses Firebase for backend services
- Inspired by classic platformer games

## 🔗 Links

- [Live Game](https://your-game-url.com)
- [Issues](https://github.com/your-username/coderunner/issues)
- [Documentation](https://github.com/your-username/coderunner/wiki)

---

**Have fun exploring the digital world! 🌟**
