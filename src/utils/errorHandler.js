/**
 * Error Boundary System - Comprehensive error handling for game crashes
 */

export class GameErrorHandler {
    constructor(game) {
        this.game = game;
        this.errorCount = 0;
        this.maxErrors = 10;
        this.errorLog = [];
        this.lastErrorTime = 0;
        this.errorCooldown = 1000; // 1 second between error logs
        
        this.setupGlobalErrorHandlers();
    }

    /**
     * Setup global error handlers
     */
    setupGlobalErrorHandlers() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'Uncaught Error', {
                filename: event.filename,
                line: event.lineno,
                column: event.colno
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise Rejection');
            event.preventDefault(); // Prevent console error
        });

        // Handle canvas context loss
        if (this.game.canvas) {
            this.game.canvas.addEventListener('webglcontextlost', (event) => {
                this.handleError(new Error('WebGL context lost'), 'WebGL Context Lost');
                event.preventDefault();
            });
        }
    }

    /**
     * Handle individual errors
     */
    handleError(error, context = 'Unknown', metadata = {}) {
        const now = Date.now();
        
        // Throttle error logging
        if (now - this.lastErrorTime < this.errorCooldown) {
            return;
        }
        
        this.lastErrorTime = now;
        this.errorCount++;

        const errorInfo = {
            timestamp: now,
            context,
            message: error?.message || 'Unknown error',
            stack: error?.stack || 'No stack trace',
            metadata,
            gameState: this.getGameState()
        };

        this.errorLog.push(errorInfo);
        
        // Keep only recent errors
        if (this.errorLog.length > 50) {
            this.errorLog = this.errorLog.slice(-50);
        }

    // Game Error [${context}]: (log removed)
        ('Error metadata:', metadata);
        ('Game state:', errorInfo.gameState);

        // Try to recover from the error
        this.attemptRecovery(errorInfo);

        // If too many errors, show user-friendly message
        if (this.errorCount >= this.maxErrors) {
            this.showCriticalErrorMessage();
        }
    }

    /**
     * Attempt to recover from errors
     */
    attemptRecovery(errorInfo) {
        try {
            // Save game data before potential crash
            if (this.game.cloudSaveSystem) {
                this.game.cloudSaveSystem.saveAllGameData().catch(e => {
                    console.warn('Failed to save data during error recovery:', e);
                });
            }

            // Reset problematic game states
            if (errorInfo.context.includes('Render')) {
                this.resetRenderingState();
            }
            
            if (errorInfo.context.includes('Physics')) {
                this.resetPhysicsState();
            }
            
            if (errorInfo.context.includes('Audio')) {
                this.resetAudioState();
            }

             ('Attempted automatic recovery');
        } catch (recoveryError) {
            // ❌ Recovery attempt failed (log removed)
        }
    }

    /**
     * Reset rendering state
     */
    resetRenderingState() {
        try {
            if (this.game.renderer) {
                this.game.renderer.resetAnimations?.();
            }
            
            // Clear any problematic visual effects
            if (this.game.powerUpSystem) {
                this.game.powerUpSystem.powerUpNotifications = [];
            }
            
             ('Rendering state reset');
        } catch (error) {
            // Failed to reset rendering state (log removed)
        }
    }

    /**
     * Reset physics state
     */
    resetPhysicsState() {
        try {
            if (this.game.player) {
                // Reset player to safe state
                this.game.player.velocityY = 0;
                this.game.player.isGrounded = true;
                this.game.player.y = Math.max(this.game.player.y, 100);
            }
            
             ('Physics state reset');
        } catch (error) {
            // Failed to reset physics state (log removed)
        }
    }

    /**
     * Reset audio state
     */
    resetAudioState() {
        try {
            if (this.game.audioSystem) {
                this.game.audioSystem.stopAll?.();
            }
            
             ('Audio state reset');
        } catch (error) {
            // Failed to reset audio state (log removed)
        }
    }

    /**
     * Get current game state for debugging
     */
    getGameState() {
        try {
            return {
                gameState: this.game.gameState,
                score: this.game.score || 0,
                distance: this.game.distance || 0,
                playerHealth: this.game.player?.health || 0,
                activePowerUps: this.game.powerUpSystem?.activePowerUps?.size || 0,
                dataPackets: this.game.upgradeSystem?.dataPackets || 0,
                isLoggedIn: this.game.cloudSaveSystem?.isUserLoggedIn() || false
            };
        } catch (error) {
            return { error: 'Failed to get game state' };
        }
    }

    /**
     * Show critical error message to user
     */
    showCriticalErrorMessage() {
    const message = `
The game has encountered multiple errors and may be unstable.

Your progress has been automatically saved.

Recommended actions:
• Refresh the page to restart the game
• Check your internet connection
• Clear your browser cache if problems persist

Error count: ${this.errorCount}
    `;

        if (this.game.popupSystem) {
            this.game.popupSystem.showError('Critical Error', message);
        } else {
            alert(message);
        }

    // 🚨 Critical error threshold reached (log removed)
    }

    /**
     * Generate error report for debugging
     */
    generateErrorReport() {
        return {
            timestamp: Date.now(),
            totalErrors: this.errorCount,
            recentErrors: this.errorLog.slice(-10),
            gameInfo: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                gameState: this.getGameState()
            }
        };
    }

    /**
     * Clear error log (for testing)
     */
    clearErrors() {
        this.errorCount = 0;
        this.errorLog = [];
         ('Error log cleared');
    }

    /**
     * Wrap function calls with error handling
     */
    wrapFunction(fn, context = 'Unknown Function') {
        return (...args) => {
            try {
                return fn.apply(this, args);
            } catch (error) {
                this.handleError(error, context, { args });
                return null;
            }
        };
    }

    /**
     * Wrap async function calls with error handling
     */
    wrapAsyncFunction(fn, context = 'Unknown Async Function') {
        return async (...args) => {
            try {
                return await fn.apply(this, args);
            } catch (error) {
                this.handleError(error, context, { args });
                return null;
            }
        };
    }
}
