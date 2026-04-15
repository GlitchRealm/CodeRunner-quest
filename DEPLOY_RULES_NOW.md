# URGENT: Deploy Firebase Database Rules

## ⚠️ Current Issue
You're getting permission denied errors because the database security rules haven't been deployed yet.

## 🚀 Quick Fix

### Method 1: Firebase Console (Easiest)
1. Go to https://console.firebase.google.com/
2. Select your project "coderunner-24a94"
3. Click "Realtime Database" in the left sidebar
4. Click the "Rules" tab
5. Replace ALL existing rules with this:

```json
{
  "rules": {
    "userProfiles": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

6. Click "Publish"

### Method 2: Temporary Open Rules (For Testing Only)
If the above doesn't work immediately, use these TEMPORARY rules (INSECURE - for testing only):

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

This allows any authenticated user to read/write everything. **Use only for testing!**

## 🔧 Verification Steps
1. Deploy the rules
2. Refresh your app
3. Sign in
4. Check browser console - permission errors should be gone

## 📞 If Still Not Working
- Make sure you're in the "Realtime Database" section (not Firestore)
- Verify the rules are published (there should be a green checkmark)
- Try signing out and back in to your app
