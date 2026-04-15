/**
 * Firebase Configuration
 * Centralized configuration for Firebase services
 */

// Read environment values safely across browser/bundler contexts.
const readEnv = (key) => {
    // Runtime-injected config (preferred for static hosting like Netlify without bundling)
    if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__ && window.__FIREBASE_CONFIG__[key]) {
        return window.__FIREBASE_CONFIG__[key];
    }

    // Vite/ESM envs if bundling is introduced later
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_FIREBASE_${key.toUpperCase()}`]) {
            return import.meta.env[`VITE_FIREBASE_${key.toUpperCase()}`];
        }
    } catch (e) {
        // no-op in non-ESM contexts
    }

    // Node-style env fallback (for tests/build tooling)
    if (typeof process !== 'undefined' && process.env && process.env[`VITE_FIREBASE_${key.toUpperCase()}`]) {
        return process.env[`VITE_FIREBASE_${key.toUpperCase()}`];
    }

    return '';
};

// Environment-based configuration
const getFirebaseConfig = () => {
    const runtimeConfig = {
        apiKey: readEnv('api_key'),
        authDomain: readEnv('auth_domain'),
        databaseURL: readEnv('database_url'),
        projectId: readEnv('project_id'),
        storageBucket: readEnv('storage_bucket'),
        messagingSenderId: readEnv('messaging_sender_id'),
        appId: readEnv('app_id'),
        measurementId: readEnv('measurement_id')
    };

    const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missing = required.filter((k) => !runtimeConfig[k]);
    if (missing.length > 0) {
        console.warn('Firebase config missing required values:', missing.join(', '));
    }

    return runtimeConfig;
};

export const firebaseConfig = getFirebaseConfig();

// Firebase service initialization flags
export const firebaseFeatures = {
    auth: true,
    database: true,
    firestore: true,
    analytics: true,
    enablePersistence: true // Enable offline persistence
};

// Error messages
export const firebaseErrors = {
    CONNECTION_FAILED: 'Failed to connect to Firebase services',
    AUTH_FAILED: 'Authentication failed',
    DATABASE_ERROR: 'Database operation failed',
    PERMISSION_DENIED: 'Permission denied'
};

// Make config globally available for backwards compatibility
window.firebaseConfig = firebaseConfig;
