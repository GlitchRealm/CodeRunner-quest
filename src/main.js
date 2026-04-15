// Main entry point for CodeRunner game
import { Game } from './core/Game.js';
import { performanceMonitor } from './utils/PerformanceMonitor.js';
import './systems/ProfileManager.js'; // Initialize ProfileManager

// Silence noisy console output by default to keep runtime console clean.
// Set `window.DEBUG_CONSOLE = true` in the console or before loading to re-enable logs.
if (typeof window !== 'undefined' && !window.DEBUG_CONSOLE) {
    ['log', 'info', 'debug'].forEach(fn => {
        try {
            if (console && console[fn]) console[fn] = function() {};
        } catch (e) {
            // ignore if console cannot be overwritten
        }
    });
}

// Initialize and start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    try {
         ('main.js DOMContentLoaded event fired');
        
        // Initialize performance monitoring
        performanceMonitor.reset();
        
        const game = new Game();
        
        // Make game instance available globally for leaderboard cleanup
        window.gameInstance = game;
    
    // Connect global audio system to game instance
    if (window.audioSystem) {
         ('Audio: Connecting audioSystem to game immediately');
        game.audioSystem = window.audioSystem;
    } else {
        // Wait for audio system to be initialized
         ('AudioSystem not ready, setting up delayed connection');
        const checkAudioSystem = () => {
            if (window.audioSystem) {
                 ('Audio: Connecting audioSystem to game after delay');
                game.audioSystem = window.audioSystem;
            } else {
                setTimeout(checkAudioSystem, 50);
            }
        };
        checkAudioSystem();
    }    // Connect general settings to game instance
    if (window.generalSettings) {
        ('Connecting generalSettings to game immediately');
        const fpsEnabled = window.generalSettings.isShowFpsCounterEnabled();
        ('FPS counter enabled from settings:', fpsEnabled);
        game.showFpsCounter = fpsEnabled;
        game.initializeGraphicsSettings(); // Refresh graphics settings
    } else {
        // Wait for general settings to be initialized
         ('GeneralSettings not ready, setting up delayed connection');
        const checkGeneralSettings = () => {
            if (window.generalSettings) {
                 ('Connecting generalSettings to game after delay');
                const fpsEnabled = window.generalSettings.isShowFpsCounterEnabled();
                 ('FPS counter enabled from settings (delayed):', fpsEnabled);
                game.showFpsCounter = fpsEnabled;
                game.initializeGraphicsSettings(); // Refresh graphics settings
            } else {
                setTimeout(checkGeneralSettings, 50);
            }
        };
        checkGeneralSettings();
    }
        
         ('Starting game...');
        game.start();
         ('Game initialization completed');
        
    } catch (error) {
    // Failed to initialize game (log removed)
        
                // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(248, 81, 73, 0.9);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-family: 'Courier New', monospace;
            z-index: 10000;
        `;
        errorDiv.innerHTML = `
            <h3>Game Failed to Start</h3>
            <p>An error occurred while initializing the game.</p>
            <p>Please refresh the page to try again.</p>
            <button onclick="location.reload()" style="
                background: #21262d;
                color: white;
                border: 1px solid #30363d;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-family: inherit;
                margin-top: 10px;
            ">Refresh Page</button>
        `;
        document.body.appendChild(errorDiv);
    }
});
