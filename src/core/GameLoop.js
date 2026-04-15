/**
 * Game Loop and Update Logic - Main game loop, performance, and gameplay updates
 */

import { GAME_STATES, DIFFICULTY_LEVELS, GAME_CONFIG, TILE_TYPES } from '../utils/constants.js';
import { getMemoryMazeLayout, isValidMemoryMazeLayout } from './MemoryMazeLayouts.js';

export class GameLoop {
    constructor(game) {
        this.game = game;
    }

    /**
     * Main game loop - handles updating and rendering
     */
    gameLoop(timestamp) {
        try {
            const frameStartTime = performance.now();
            
            // Calculate delta time with frame limiting
            const currentTime = timestamp || performance.now();
            this.game.deltaTime = Math.min(currentTime - this.game.lastTime, 16.67); // Cap at ~60fps
            this.game.lastTime = currentTime;
            
            // Track frame timing for performance metrics
            const updateStartTime = performance.now();
            
            // Update FPS counter
            this.updateFPS(currentTime);
            
            // Update game state
            this.update();
            
            // Track update time
            this.game.performanceMetrics.updateTime = performance.now() - updateStartTime;
            
            // Track render start time
            const renderStartTime = performance.now();
            
            // Render everything
            this.game.render();
            
            // Track render time
            this.game.performanceMetrics.renderTime = performance.now() - renderStartTime;
            
            // Track total frame time
            this.game.performanceMetrics.frameTime = performance.now() - frameStartTime;
            
            // Adaptive performance optimization
            this.checkAndApplyAdaptiveOptimizations();
            
            // Continue the game loop
            requestAnimationFrame((ts) => this.gameLoop(ts));
        } catch (error) {
            // 🎮 Game loop error (log removed)
            // Continue the loop even if there's an error to prevent the game from completely freezing
            requestAnimationFrame((ts) => this.gameLoop(ts));
        }
    }

    /**
     * Update FPS counter and performance metrics
     */
    updateFPS(currentTime) {
        this.game.frameCount++;
        
        if (currentTime - this.game.lastFpsUpdate >= 1000) {
            this.game.fps = Math.round((this.game.frameCount - this.game.lastFrameCount) * 1000 / (currentTime - this.game.lastFpsUpdate));
            this.game.lastFrameCount = this.game.frameCount;
            this.game.lastFpsUpdate = currentTime;
            
            // Store FPS history for performance monitoring
            if (this.game.performanceMetrics) {
                this.game.performanceMetrics.fpsHistory.push(this.game.fps);
                if (this.game.performanceMetrics.fpsHistory.length > 60) {
                    this.game.performanceMetrics.fpsHistory.shift();
                }
            }
        }
    }

    /**
     * Get performance metrics for UI display
     */
    getPerformanceMetrics() {
        return {
            fps: this.game.fps || 0,
            frameTime: this.game.performanceMetrics.frameTime || 0,
            updateTime: this.game.performanceMetrics.updateTime || 0,
            renderTime: this.game.performanceMetrics.renderTime || 0,
            fpsHistory: this.game.performanceMetrics.fpsHistory || []
        };
    }

    /**
     * Update game logic
     */
    update() {
        // Input manager uses event listeners, no update needed
        
        // Update systems based on game state
        switch (this.game.gameState) {
            case GAME_STATES.LOADING:
                if (this.game.loadingScreenSystem) {
                    this.game.loadingScreenSystem.update(this.game.deltaTime);
                }
                break;
                
            case GAME_STATES.PLAYING:
                this.updateGameplay();
                break;
                
            case GAME_STATES.OPENING_ANIMATION:
                if (this.game.openingAnimation) {
                    this.game.openingAnimation.update(this.game.deltaTime);
                }
                break;
                
            case GAME_STATES.TUTORIAL:
                if (this.game.tutorialSystem) {
                    this.game.tutorialSystem.update(this.game.deltaTime);
                }
                break;
                
            case GAME_STATES.PROFILE:
                if (this.game.userProfileSystem) {
                    // Auto-start the profile system if not active
                    if (!this.game.userProfileSystem.isActive) {
                        this.game.userProfileSystem.start();
                    }
                    this.game.userProfileSystem.update(this.game.deltaTime);
                }
                break;
                
            case GAME_STATES.LOGIN_PROMPT:
                if (this.game.loginSystem) {
                    this.game.loginSystem.update(this.game.deltaTime);
                }
                break;
                
            default:
                // Update background systems that should always run
                if (this.game.popupSystem) {
                    this.game.popupSystem.update(this.game.deltaTime);
                }
                break;
        }
        
        // Audio system doesn't need per-frame updates (event-driven)
    }

    /**
     * Update gameplay logic when in playing state
     */
    updateGameplay() {
        if (!this.game.player || !this.game.world) return;

        this.updateTimelineLimits(this.game.deltaTime);
        this.updateMemoryMazeRoomFlow();
        
        // Always update quantum dash animation (even when paused, since it controls the pause)
        if (this.game.quantumDashAnimation) {
            this.game.quantumDashAnimation.update(this.game.deltaTime);
        }
        
        // Skip other updates if paused
        if (this.game.isPaused) return;
        
        // Get input keys from input manager
        const inputKeys = this.game.inputManager ? this.game.inputManager.getKeys() : {};
        
        // Update player with all required parameters
        this.game.player.update(this.game.deltaTime, inputKeys, this.game.world, this.game.physics);
        
        // Update world
        this.game.world.update(this.game.deltaTime, this.game.camera);
        
        // Update physics
        if (this.game.physics) {
            this.game.physics.update(this.game.deltaTime);
        }
        
        // Update game systems
        if (this.game.powerUpSystem) {
            this.game.powerUpSystem.update(this.game.deltaTime);
        }
        
        if (this.game.lifeBoxSystem) {
            this.game.lifeBoxSystem.update(this.game.deltaTime);
        }
        
        // Update camera
        this.updateCamera();
        
        // Update screen shake
        this.updateScreenShake(this.game.deltaTime);
        
        // Update adaptive difficulty
        this.updateAdaptiveDifficulty();
        
        // Update score
        this.updateScore();

        // Check memory maze distance milestones (1000m, 2000m, ...)
        this.checkMemoryMazeMilestoneTriggers();
        this.updateMemoryMazeRoomFlow();
    }

    updateMemoryMazeRoomFlow() {
        const memoryMazeState = this.game.memoryMazeState;
        const player = this.game.player;
        const world = this.game.world;
        if (!memoryMazeState || !player || !world) return;

        if (!memoryMazeState.active && memoryMazeState.pendingMilestoneMeters !== null) {
            this.activateMemoryMazeRoom(memoryMazeState.pendingMilestoneMeters);
        }

        if (!memoryMazeState.active || !memoryMazeState.roomBounds) return;

        const now = Date.now();
        const elapsed = now - memoryMazeState.roomStartedAt;
        const roomExitX = memoryMazeState.roomBounds.maxX;

        if (memoryMazeState.spikeRevealEndsAt <= 0) {
            memoryMazeState.spikeRevealEndsAt = memoryMazeState.roomStartedAt + memoryMazeState.spikeBlinkDurationMs;
        }

        memoryMazeState.spikeBlinkActive = now < memoryMazeState.spikeRevealEndsAt;
        memoryMazeState.spikesHidden = !memoryMazeState.spikeBlinkActive;

        if (
            !memoryMazeState.misdirectionTilesCollapsed &&
            elapsed >= memoryMazeState.spikeBlinkDurationMs &&
            Array.isArray(memoryMazeState.roomMisdirectionTiles)
        ) {
            for (const tile of memoryMazeState.roomMisdirectionTiles) {
                world.setTileAt(tile.x, tile.y, TILE_TYPES.EMPTY);
            }
            memoryMazeState.misdirectionTilesCollapsed = true;
        }

        if (player.x > roomExitX + GAME_CONFIG.TILE_SIZE || elapsed > 20000) {
            memoryMazeState.active = false;
            memoryMazeState.lockCamera = false;
            memoryMazeState.roomBounds = null;
            memoryMazeState.cameraLockX = 0;
            memoryMazeState.cameraLockY = 0;
            memoryMazeState.distanceCounterDisabled = false;
            memoryMazeState.spikeRevealEndsAt = 0;
            memoryMazeState.spikeBlinkActive = false;
            memoryMazeState.spikesHidden = false;
            memoryMazeState.roomSpikeTileKeys = [];
            memoryMazeState.roomMisdirectionTiles = [];
            memoryMazeState.misdirectionTilesCollapsed = false;
        }
    }

    activateMemoryMazeRoom(milestoneMeters) {
        const memoryMazeState = this.game.memoryMazeState;
        const world = this.game.world;
        const player = this.game.player;
        if (!memoryMazeState || !world || !player) return;

        const layout = getMemoryMazeLayout(milestoneMeters);
        if (!isValidMemoryMazeLayout(layout)) return;

        const roomWidthTiles = 10;
        const roomHeightTiles = 10;

        const originTileX = Math.floor(player.x / GAME_CONFIG.TILE_SIZE) + 8;
        const originTileY = 2;

        // Build a 10x10 memory room from pre-defined layout data.
        for (let y = 0; y < roomHeightTiles; y++) {
            for (let x = 0; x < roomWidthTiles; x++) {
                const worldTileX = originTileX + x;
                const worldTileY = originTileY + y;

                const tileCode = layout.tiles[y][x];
                const tile = tileCode === 1 ? TILE_TYPES.FLOOR : TILE_TYPES.EMPTY;

                world.setTileAt(worldTileX, worldTileY, tile);
            }
        }

        for (const trap of layout.traps) {
            if (
                trap.x >= 0 && trap.x < roomWidthTiles &&
                trap.y >= 0 && trap.y < roomHeightTiles
            ) {
                const trapTileX = originTileX + trap.x;
                const trapTileY = originTileY + trap.y;
                world.setTileAt(trapTileX, trapTileY, TILE_TYPES.SPIKE);
            }
        }

        for (const falsePath of layout.falsePaths || []) {
            if (
                falsePath.x >= 0 && falsePath.x < roomWidthTiles &&
                falsePath.y >= 0 && falsePath.y < roomHeightTiles
            ) {
                world.setTileAt(originTileX + falsePath.x, originTileY + falsePath.y, TILE_TYPES.FLOOR);
            }
        }

        for (const misdirectionTile of layout.misdirectionTiles || []) {
            if (
                misdirectionTile.x >= 0 && misdirectionTile.x < roomWidthTiles &&
                misdirectionTile.y >= 0 && misdirectionTile.y < roomHeightTiles
            ) {
                world.setTileAt(originTileX + misdirectionTile.x, originTileY + misdirectionTile.y, TILE_TYPES.FLOOR);
            }
        }

        // Entrance/exit gaps in side walls.
        world.setTileAt(originTileX, originTileY + roomHeightTiles - 2, TILE_TYPES.EMPTY);
        world.setTileAt(originTileX + roomWidthTiles - 1, originTileY + roomHeightTiles - 2, TILE_TYPES.EMPTY);

        const roomCenterX = (originTileX + roomWidthTiles / 2) * GAME_CONFIG.TILE_SIZE;
        const roomCenterY = (originTileY + roomHeightTiles / 2) * GAME_CONFIG.TILE_SIZE;

        memoryMazeState.active = true;
        memoryMazeState.pendingMilestoneMeters = null;
        memoryMazeState.lockCamera = true;
        memoryMazeState.distanceCounterDisabled = true;
        memoryMazeState.frozenDistanceMeters = Math.floor(player.x / 10);
        memoryMazeState.roomStartedAt = Date.now();
        memoryMazeState.spikeRevealEndsAt = memoryMazeState.roomStartedAt + memoryMazeState.spikeBlinkDurationMs;
        memoryMazeState.spikeBlinkActive = true;
        memoryMazeState.spikesHidden = false;
        memoryMazeState.roomSpikeTileKeys = layout.traps
            .filter((trap) => trap.x >= 0 && trap.x < roomWidthTiles && trap.y >= 0 && trap.y < roomHeightTiles)
            .map((trap) => `${originTileX + trap.x},${originTileY + trap.y}`);
        memoryMazeState.roomMisdirectionTiles = (layout.misdirectionTiles || [])
            .filter((tile) => tile.x >= 0 && tile.x < roomWidthTiles && tile.y >= 0 && tile.y < roomHeightTiles)
            .map((tile) => ({ x: originTileX + tile.x, y: originTileY + tile.y }));
        memoryMazeState.misdirectionTilesCollapsed = false;
        memoryMazeState.roomBounds = {
            minX: originTileX * GAME_CONFIG.TILE_SIZE,
            maxX: (originTileX + roomWidthTiles) * GAME_CONFIG.TILE_SIZE,
            minY: originTileY * GAME_CONFIG.TILE_SIZE,
            maxY: (originTileY + roomHeightTiles) * GAME_CONFIG.TILE_SIZE
        };

        memoryMazeState.cameraLockX = Math.max(0, roomCenterX - this.game.canvas.width / 2);
        memoryMazeState.cameraLockY = Math.max(0, roomCenterY - this.game.canvas.height / 2);
    }

    checkMemoryMazeMilestoneTriggers() {
        const memoryMazeState = this.game.memoryMazeState;
        const player = this.game.player;
        if (!memoryMazeState || !player) return;

        const currentMeters = Math.floor(player.x / 10);

        while (currentMeters >= memoryMazeState.nextTriggerMeters) {
            const milestone = memoryMazeState.nextTriggerMeters;

            // Queue the latest pending milestone for upcoming maze-room flow.
            memoryMazeState.pendingMilestoneMeters = milestone;
            memoryMazeState.triggeredMilestones.push(milestone);
            memoryMazeState.nextTriggerMeters += memoryMazeState.triggerIntervalMeters;
        }
    }

    updateTimelineLimits(deltaTime) {
        if (!this.game.timelineLimits) return;

        const limits = this.game.timelineLimits;

        if (limits.overheatWarningMs > 0) {
            limits.overheatWarningMs = Math.max(0, limits.overheatWarningMs - deltaTime);
        }

        if (limits.swapLockoutMs > 0) {
            limits.swapLockoutMs = Math.max(0, limits.swapLockoutMs - deltaTime);
        }

        if (this.game.currentTimeline === 'corrupt') {
            const previousRemaining = limits.corruptedRemainingMs;
            limits.corruptedRemainingMs = Math.max(0, limits.corruptedRemainingMs - deltaTime);

            if (previousRemaining > 0 && limits.corruptedRemainingMs === 0) {
                this.handleTimelineOverheat();
            }
        } else {
            limits.corruptedRemainingMs = limits.corruptedMaxMs;
        }
    }

    handleTimelineOverheat() {
        this.game.currentTimeline = 'normal';

        if (this.game.timelineLimits) {
            this.game.timelineLimits.overheatWarningMs = 900;
            this.game.timelineLimits.corruptedRemainingMs = this.game.timelineLimits.corruptedMaxMs;
            this.game.timelineLimits.swapLockoutMs = this.game.timelineLimits.swapLockoutDurationMs;
        }

        if (this.game.player && typeof this.game.player.applyTimelineSwapMomentumCancel === 'function') {
            this.game.player.applyTimelineSwapMomentumCancel(140);
        }

        if (this.game.renderer && typeof this.game.renderer.triggerTimelineSwapEffect === 'function') {
            this.game.renderer.triggerTimelineSwapEffect('normal');
        }

        if (this.game.audioSystem && typeof this.game.audioSystem.playSound === 'function') {
            this.game.audioSystem.playSound('damage');
        }
    }

    /**
     * Update camera position to follow player
     */
    updateCamera() {
        if (this.game.memoryMazeState && this.game.memoryMazeState.lockCamera) {
            this.game.camera.x = this.game.memoryMazeState.cameraLockX;
            this.game.camera.y = this.game.memoryMazeState.cameraLockY;
            return;
        }

        if (this.game.player) {
            this.game.camera.x = this.game.player.x - this.game.canvas.width / 2;
            this.game.camera.y = this.game.player.y - this.game.canvas.height / 2;
            
            // Prevent camera from showing empty space to the left of the world
            // Keep camera.x at minimum 0 so the left edge of the world is always at screen edge
            this.game.camera.x = Math.max(0, this.game.camera.x);
        }
    }

    /**
     * Update game score
     */
    updateScore() {
        if (this.game.player && this.game.gameState === GAME_STATES.PLAYING) {
            // Update score based on distance traveled
            const memoryMazeState = this.game.memoryMazeState;
            const distanceScore = memoryMazeState && memoryMazeState.distanceCounterDisabled
                ? memoryMazeState.frozenDistanceMeters
                : Math.floor(this.game.player.x / 10);
            this.game.score = distanceScore + this.game.bonusScore;
        }
    }

    /**
     * Update screen shake effect
     */
    updateScreenShake(deltaTime) {
        if (this.game.currentShake.duration > 0) {
            this.game.currentShake.duration -= deltaTime;
            
            if (this.game.currentShake.duration <= 0) {
                // Shake finished
                this.game.currentShake.x = 0;
                this.game.currentShake.y = 0;
                this.game.currentShake.intensity = 0;
            } else {
                // Continue shaking
                const shakeAmount = this.game.currentShake.intensity * this.game.shakeIntensity;
                this.game.currentShake.x = (Math.random() - 0.5) * shakeAmount;
                this.game.currentShake.y = (Math.random() - 0.5) * shakeAmount;
            }
        }
    }

    /**
     * Update adaptive difficulty based on player performance
     */
    updateAdaptiveDifficulty() {
        if (!this.game.adaptiveDifficulty || !this.game.player) return;
        
        const currentTime = Date.now();
        if (currentTime - this.game.lastPerformanceCheck < 5000) return; // Check every 5 seconds
        
        this.game.lastPerformanceCheck = currentTime;
        
        // Analyze player performance
        const survivalTime = (currentTime - this.game.startTime) / 1000;
        const currentScore = this.game.score;
        const recentDamage = this.game.player.lastDamageTime && (currentTime - this.game.player.lastDamageTime) < 10000;
        
        // Performance metrics
        const scoreRate = survivalTime > 0 ? currentScore / survivalTime : 0;
        const expectedScoreRate = this.getExpectedScoreRate();
        const performanceRatio = scoreRate / expectedScoreRate;
        
        // Record performance
        this.game.playerPerformanceHistory.push(performanceRatio);
        if (this.game.playerPerformanceHistory.length > 10) {
            this.game.playerPerformanceHistory.shift(); // Keep only last 10 entries
        }
        
        // Calculate average performance
        const avgPerformance = this.game.playerPerformanceHistory.reduce((a, b) => a + b, 0) / this.game.playerPerformanceHistory.length;
        
        // Adjust difficulty based on performance
        if (avgPerformance > 1.2) { // Player performing well
            this.game.consecutiveSuccesses++;
            this.game.consecutiveFailures = 0;
            if (this.game.consecutiveSuccesses >= 3) {
                this.game.adaptiveDifficultyMultiplier = Math.min(1.5, this.game.adaptiveDifficultyMultiplier + 0.1);
                this.game.consecutiveSuccesses = 0;
                 (`🎮 Adaptive difficulty increased: ${this.game.adaptiveDifficultyMultiplier.toFixed(2)}x`);
            }
        } else if (avgPerformance < 0.8 || recentDamage) { // Player struggling
            this.game.consecutiveFailures++;
            this.game.consecutiveSuccesses = 0;
            if (this.game.consecutiveFailures >= 2) {
                this.game.adaptiveDifficultyMultiplier = Math.max(0.7, this.game.adaptiveDifficultyMultiplier - 0.1);
                this.game.consecutiveFailures = 0;
                 (`🎮 Adaptive difficulty decreased: ${this.game.adaptiveDifficultyMultiplier.toFixed(2)}x`);
            }
        }
    }

    /**
     * Get expected score rate for current difficulty
     */
    getExpectedScoreRate() {
        const difficultyConfig = DIFFICULTY_LEVELS[this.game.selectedDifficulty];
        if (!difficultyConfig) return 100; // Default expected rate
        
        // Base expected score rate varies by difficulty
        const baseRates = {
            'EASY': 150,
            'MEDIUM': 120,
            'HARD': 100,
            'EXTREME': 80,
            'IMPOSSIBLE': 60
        };
        
        return baseRates[this.game.selectedDifficulty] || 100;
    }

    /**
     * Check and apply adaptive performance optimizations
     */
    checkAndApplyAdaptiveOptimizations() {
        const currentTime = performance.now();
        
        // Only check every 2 seconds
        if (currentTime - this.game.performanceMetrics.lastOptimizationCheck < 2000) return;
        this.game.performanceMetrics.lastOptimizationCheck = currentTime;
        
        // Calculate average FPS over last few frames
        const recentFps = this.game.performanceMetrics.fpsHistory.slice(-10);
        if (recentFps.length === 0) return;
        
        const avgFps = recentFps.reduce((a, b) => a + b, 0) / recentFps.length;
        
        // Detect low FPS
        if (avgFps < 50) {
            this.game.performanceMetrics.lowFpsCounter++;
            
            // If we've had low FPS for several checks, apply optimizations
            if (this.game.performanceMetrics.lowFpsCounter >= 3) {
                this.applyPerformanceOptimizations();
                this.game.performanceMetrics.lowFpsCounter = 0; // Reset counter
            }
        } else {
            // Reset low FPS counter if performance is good
            this.game.performanceMetrics.lowFpsCounter = 0;
            
            // Potentially restore quality if performance has been good for a while
            if (avgFps > 55 && this.game.performanceMetrics.adaptiveOptimizationLevel > 0) {
                this.restorePerformanceOptimizations();
            }
        }
    }

    /**
     * Apply performance optimizations to maintain FPS
     */
    applyPerformanceOptimizations() {
        if (this.game.performanceMetrics.adaptiveOptimizationLevel >= 3) return; // Max optimizations already applied
        
        this.game.performanceMetrics.adaptiveOptimizationLevel++;
        
         (`⚡ Applying performance optimization level ${this.game.performanceMetrics.adaptiveOptimizationLevel}`);
        
        switch (this.game.performanceMetrics.adaptiveOptimizationLevel) {
            case 1:
                // Level 1: Reduce particle count
                if (this.game.world) {
                    this.game.world.particleCount *= 0.7;
                }
                break;
                
            case 2:
                // Level 2: Disable background particles
                this.game.backgroundParticles = false;
                break;
                
            case 3:
                // Level 3: Reduce graphics quality
                this.game.graphicsQuality = 'low';
                this.game.applyGraphicsQuality();
                break;
        }
    }

    /**
     * Restore performance optimizations when FPS is good
     */
    restorePerformanceOptimizations() {
        if (this.game.performanceMetrics.adaptiveOptimizationLevel <= 0) return; // No optimizations to restore
        
         (`⚡ Restoring performance optimization level ${this.game.performanceMetrics.adaptiveOptimizationLevel}`);
        
        switch (this.game.performanceMetrics.adaptiveOptimizationLevel) {
            case 1:
                // Restore particle count
                if (this.game.world) {
                    this.game.world.particleCount /= 0.7;
                }
                break;
                
            case 2:
                // Restore background particles
                this.game.backgroundParticles = true;
                break;
                
            case 3:
                // Restore graphics quality
                if (window.generalSettings) {
                    this.game.graphicsQuality = window.generalSettings.getGraphicsQuality();
                } else {
                    this.game.graphicsQuality = 'medium';
                }
                this.game.applyGraphicsQuality();
                break;
        }
        
        this.game.performanceMetrics.adaptiveOptimizationLevel--;
    }

    /**
     * Trigger screen shake effect
     */
    triggerScreenShake(intensity, duration) {
        if (!this.game.screenShake) return;
        
        this.game.currentShake.intensity = intensity;
        this.game.currentShake.duration = duration;
    }

    /**
     * Update visual effects
     */
    updateVisualEffects(deltaTime) {
        // Update milestone effects
        for (let i = this.game.milestoneEffects.length - 1; i >= 0; i--) {
            const effect = this.game.milestoneEffects[i];
            effect.life -= deltaTime;
            
            if (effect.life <= 0) {
                // Return effect to pool
                if (this.game.effectPool.milestone.length < this.game.maxPoolSize) {
                    this.game.effectPool.milestone.push(effect);
                }
                this.game.milestoneEffects.splice(i, 1);
            } else {
                // Update effect
                effect.y -= effect.speed * deltaTime;
                effect.alpha = effect.life / effect.maxLife;
            }
        }
        
        // Update speed penalty effects
        for (let i = this.game.speedPenaltyEffects.length - 1; i >= 0; i--) {
            const effect = this.game.speedPenaltyEffects[i];
            effect.life -= deltaTime;
            
            if (effect.life <= 0) {
                // Return effect to pool
                if (this.game.effectPool.speedPenalty.length < this.game.maxPoolSize) {
                    this.game.effectPool.speedPenalty.push(effect);
                }
                this.game.speedPenaltyEffects.splice(i, 1);
            } else {
                // Update effect
                effect.y -= effect.speed * deltaTime;
                effect.alpha = effect.life / effect.maxLife;
            }
        }
    }

    /**
     * Create milestone effect
     */
    createMilestoneEffect(x, y, text) {
        let effect = null;
        
        // Try to get from pool first
        if (this.game.effectPool.milestone.length > 0) {
            effect = this.game.effectPool.milestone.pop();
        } else {
            effect = {};
        }
        
        // Configure effect
        effect.x = x;
        effect.y = y;
        effect.text = text;
        effect.life = 2000; // 2 seconds
        effect.maxLife = 2000;
        effect.speed = 50; // pixels per second
        effect.alpha = 1.0;
        effect.color = '#00ff00';
        
        this.game.milestoneEffects.push(effect);
    }

    /**
     * Create speed penalty effect
     */
    createSpeedPenaltyEffect(x, y, penalty) {
        let effect = null;
        
        // Try to get from pool first
        if (this.game.effectPool.speedPenalty.length > 0) {
            effect = this.game.effectPool.speedPenalty.pop();
        } else {
            effect = {};
        }
        
        // Configure effect
        effect.x = x;
        effect.y = y;
        effect.text = `-${penalty}`;
        effect.life = 1500; // 1.5 seconds
        effect.maxLife = 1500;
        effect.speed = 60; // pixels per second
        effect.alpha = 1.0;
        effect.color = '#ff4444';
        
        this.game.speedPenaltyEffects.push(effect);
    }
}
