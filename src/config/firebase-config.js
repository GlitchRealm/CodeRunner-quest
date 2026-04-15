/**
 * Firebase Configuration
 * Centralized configuration for Firebase services
 */

// Environment-based configuration
const getFirebaseConfig = () => {
    // Check if we're in production, development, or local environment
    const isProduction = window.location.hostname === 'your-production-domain.com';
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Production config
    const productionConfig = {
      apiKey: "AIzaSyC3Sf6r81WojKrRUP-tmirHG9nW5Lytqvc",
      authDomain: "coderunner-9e199.firebaseapp.com",
      databaseURL: "https://coderunner-9e199-default-rtdb.firebaseio.com",
      projectId: "coderunner-9e199",
      storageBucket: "coderunner-9e199.firebasestorage.app",
      messagingSenderId: "593312008496",
      appId: "1:593312008496:web:fc12738c8ff2946138e0f5",
      measurementId: "G-Y547G4S17C"
    };
    
    // Development config (can be same as production or different)
    const developmentConfig = {
        ...productionConfig
        // Override with development-specific settings if needed
    };
    
    // Return appropriate config based on environment
    if (isProduction) {
        return productionConfig;
    } else {
        return developmentConfig;
    }
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
