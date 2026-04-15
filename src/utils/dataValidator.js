/**
 * Data Validation Utilities - Ensures data integrity for save/load operations
 */

export class DataValidator {
    /**
     * Validate upgrade system data
     */
    static validateUpgradeData(data) {
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                error: 'Upgrade data must be an object',
                sanitized: DataValidator.getDefaultUpgradeData()
            };
        }

        const sanitized = {
            dataPackets: Math.max(0, Math.floor(data.dataPackets || 0)),
            jumpHeightLevel: Math.max(0, Math.min(5, Math.floor(data.jumpHeightLevel || 0))),
            scoreMultiplierLevel: Math.max(0, Math.min(5, Math.floor(data.scoreMultiplierLevel || 0))),
            powerUpDurationLevel: Math.max(0, Math.min(5, Math.floor(data.powerUpDurationLevel || 0))),
            jumpHeightBonus: Math.max(0, parseFloat(data.jumpHeightBonus || 0)),
            scoreMultiplierBonus: Math.max(0, parseFloat(data.scoreMultiplierBonus || 0)),
            powerUpDurationBonus: Math.max(0, parseFloat(data.powerUpDurationBonus || 0)),
            timestamp: data.timestamp || Date.now()
        };

        // Validate bonus consistency with levels
        const errors = [];
        if (sanitized.jumpHeightLevel > 5) errors.push('Jump height level exceeds maximum');
        if (sanitized.scoreMultiplierLevel > 5) errors.push('Score multiplier level exceeds maximum');
        if (sanitized.powerUpDurationLevel > 5) errors.push('Power-up duration level exceeds maximum');

        return {
            isValid: errors.length === 0,
            errors,
            sanitized
        };
    }

    /**
     * Validate shop upgrades data
     */
    static validateShopData(data) {
        if (!Array.isArray(data)) {
            return {
                isValid: false,
                error: 'Shop upgrades must be an array',
                sanitized: []
            };
        }

        const validUpgradeIds = new Set([
            'speed-boost', 'double-jump', 'air-boost-1', 'air-boost-2',
            'dash', 'dash-module-1', 'dash-module-2', 'dash-module-3',
            'health-upgrade', 'sprite-cosmic', 'sprite-shadow', 'sprite-flame',
            'sprite-ice', 'sprite-electric', 'quantum-dash', 'firewall-shield',
            'coin-magnetizer', 'shield', 'magnet', 'slow-motion', 'double-jump',
            'size-change', 'speed-boost', 'score-multiplier'
        ]);

        const sanitized = data.filter(id => 
            typeof id === 'string' && validUpgradeIds.has(id)
        );

        const invalidIds = data.filter(id => 
            typeof id !== 'string' || !validUpgradeIds.has(id)
        );

        return {
            isValid: invalidIds.length === 0,
            errors: invalidIds.length > 0 ? [`Invalid upgrade IDs: ${invalidIds.join(', ')}`] : [],
            sanitized
        };
    }

    /**
     * Validate best scores data
     */
    static validateBestScores(data) {
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                error: 'Best scores must be an object',
                sanitized: {}
            };
        }

        const validDifficulties = ['easy', 'medium', 'hard', 'extreme'];
        const sanitized = {};

        for (const [difficulty, score] of Object.entries(data)) {
            if (validDifficulties.includes(difficulty) && 
                typeof score === 'number' && 
                score >= 0 && 
                score < Number.MAX_SAFE_INTEGER) {
                sanitized[difficulty] = Math.floor(score);
            }
        }

        return {
            isValid: true,
            errors: [],
            sanitized
        };
    }

    /**
     * Validate full game data
     */
    static validateGameData(data) {
        if (!data || typeof data !== 'object') {
            return {
                isValid: false,
                error: 'Game data must be an object',
                sanitized: DataValidator.getDefaultGameData()
            };
        }

        const results = {
            upgradeData: DataValidator.validateUpgradeData({
                dataPackets: data.dataPackets,
                ...data.upgradeSystemData
            }),
            shopData: DataValidator.validateShopData(data.ownedUpgrades),
            scoresData: DataValidator.validateBestScores(data.bestScores)
        };

        const allErrors = [
            ...results.upgradeData.errors || [],
            ...results.shopData.errors || [],
            ...results.scoresData.errors || []
        ];

        const sanitized = {
            dataPackets: results.upgradeData.sanitized.dataPackets,
            upgradeSystemData: {
                jumpHeightLevel: results.upgradeData.sanitized.jumpHeightLevel,
                scoreMultiplierLevel: results.upgradeData.sanitized.scoreMultiplierLevel,
                powerUpDurationLevel: results.upgradeData.sanitized.powerUpDurationLevel,
                jumpHeightBonus: results.upgradeData.sanitized.jumpHeightBonus,
                scoreMultiplierBonus: results.upgradeData.sanitized.scoreMultiplierBonus,
                powerUpDurationBonus: results.upgradeData.sanitized.powerUpDurationBonus
            },
            ownedUpgrades: results.shopData.sanitized,
            bestScores: results.scoresData.sanitized,
            timestamp: data.timestamp || Date.now(),
            version: data.version || '1.5.0'
        };

        // Preserve other valid fields
        if (data.achievementData) sanitized.achievementData = data.achievementData;
        if (data.settingsData) sanitized.settingsData = data.settingsData;
        if (data.profileData) sanitized.profileData = data.profileData;
        if (data.audioSettings) sanitized.audioSettings = data.audioSettings;
        if (data.leaderboardData) sanitized.leaderboardData = data.leaderboardData;
        if (data.userStats) sanitized.userStats = data.userStats;

        return {
            isValid: allErrors.length === 0,
            errors: allErrors,
            sanitized
        };
    }

    /**
     * Get default upgrade data
     */
    static getDefaultUpgradeData() {
        return {
            dataPackets: 0,
            jumpHeightLevel: 0,
            scoreMultiplierLevel: 0,
            powerUpDurationLevel: 0,
            jumpHeightBonus: 0,
            scoreMultiplierBonus: 0,
            powerUpDurationBonus: 0,
            timestamp: Date.now()
        };
    }

    /**
     * Get default game data
     */
    static getDefaultGameData() {
        return {
            dataPackets: 0,
            upgradeSystemData: {
                jumpHeightLevel: 0,
                scoreMultiplierLevel: 0,
                powerUpDurationLevel: 0,
                jumpHeightBonus: 0,
                scoreMultiplierBonus: 0,
                powerUpDurationBonus: 0
            },
            ownedUpgrades: [],
            bestScores: {},
            timestamp: Date.now(),
            version: '1.5.0'
        };
    }

    /**
     * Check for data corruption indicators
     */
    static detectDataCorruption(data) {
        const issues = [];

        if (!data) {
            issues.push('Data is null or undefined');
            return issues;
        }

        // Check for impossible values
        if (data.dataPackets && (data.dataPackets < 0 || data.dataPackets > 1000000)) {
            issues.push('Data packets value is unrealistic');
        }

        if (data.upgradeSystemData) {
            const { jumpHeightLevel, scoreMultiplierLevel, powerUpDurationLevel } = data.upgradeSystemData;
            if (jumpHeightLevel > 5 || scoreMultiplierLevel > 5 || powerUpDurationLevel > 5) {
                issues.push('Upgrade levels exceed maximum');
            }
        }

        // Check timestamp validity
        if (data.timestamp) {
            const now = Date.now();
            const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
            const oneYearForward = now + (365 * 24 * 60 * 60 * 1000);
            
            if (data.timestamp < oneYearAgo || data.timestamp > oneYearForward) {
                issues.push('Timestamp is outside reasonable range');
            }
        }

        return issues;
    }
}
