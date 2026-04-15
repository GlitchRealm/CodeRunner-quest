# Firebase Realtime Database Setup

## Current Status
- Your UserProfileSystem has been converted from Firestore to Realtime Database
- Database security rules have been created in `database.rules.json`

## To Deploy the Rules

### Option 1: Using Firebase Console
1. Go to the Firebase Console for your project
2. Navigate to "Realtime Database" in the sidebar
3. Click on the "Rules" tab
4. Replace the existing rules with the content from `database.rules.json`
5. Click "Publish"

### Option 2: Using Firebase CLI
If you have Firebase CLI installed:
```bash
firebase deploy --only database
```

## What Changed
- All Firestore references (`.collection()`, `.doc()`) converted to Realtime Database (`.ref()`, `.once('value')`)
- User profiles now stored at path: `/userProfiles/{uid}`
- Game settings stored at path: `/users/{uid}/gameSettings`
- Security rules ensure users can only access their own data

## Testing
1. Deploy the rules
2. Sign in to your app
3. Try saving/loading user profiles - should work without permission errors

The "Missing or insufficient permissions" error should now be resolved.
