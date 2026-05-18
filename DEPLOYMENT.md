# 🚀 Flexo Deployment Guide

## ⚠️ Why Snack.expo.dev Doesn't Work

Snack.expo.dev **cannot** run this project because:
- ❌ MediaPipe requires native modules
- ❌ Camera processing needs device hardware
- ❌ Custom dependencies not supported in Snack
- ❌ File size too large for Snack

---

## ✅ How to Share Flexo with Your Friend

### Option 1: GitHub Clone (Recommended) 🌟

**Send your friend this link:**
```
https://github.com/samarabdelhameed/flexo-
```

**Instructions for them:**
```bash
# 1. Clone the repository
git clone https://github.com/samarabdelhameed/flexo-.git
cd flexo-

# 2. Install dependencies
npm install

# 3. Start the app
npx expo start --tunnel

# 4. Scan QR code with Expo Go app
```

---

### Option 2: Expo Tunnel (Direct Access) 🔗

**If you're running the app right now:**

1. Start the app with tunnel:
   ```bash
   cd flexo
   npx expo start --tunnel
   ```

2. You'll get a URL like:
   ```
   exp://xxxxx-anonymous-8081.exp.direct
   ```

3. Send this URL to your friend

4. They open Expo Go → "Enter URL manually" → Paste URL

**⚠️ Note:** Tunnel URL only works while your app is running!

---

### Option 3: Build Standalone App (Production) 📦

For a **real app** that works without Expo Go:

#### Build for Android (APK):
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

#### Build for iOS (IPA):
```bash
# Build for iOS (requires Apple Developer account)
eas build --platform ios --profile preview
```

After build completes, you'll get a download link to share!

---

## 📱 Quick Test Instructions for Your Friend

### Using Expo Go:

1. **Install Expo Go**
   - iOS: App Store
   - Android: Google Play

2. **Clone & Run:**
   ```bash
   git clone https://github.com/samarabdelhameed/flexo-.git
   cd flexo-
   npm install
   npx expo start --tunnel
   ```

3. **Scan QR Code** with Expo Go

4. **Grant Permissions:**
   - Camera access ✅
   - Microphone access ✅
   - Notifications ✅

---

## 🎯 What They'll Experience:

1. ✅ Welcome screen with Lottie animation
2. ✅ Voice conversation: "Good to see you! I'm Flexo"
3. ✅ Exercise selection (Finger Spread, Wrist Circles, Thumb Stretch)
4. ✅ Camera view with hand tracking
5. ✅ Real-time voice feedback
6. ✅ Progress reports

---

## 🔧 Alternative: Create Demo Video

If sharing the code is difficult, create a demo:

```bash
# Record your screen while using the app
# Then upload to:
- YouTube
- Google Drive
- Loom
```

---

## 📊 Project Stats:

- **Platform:** React Native + Expo SDK 54
- **Dependencies:** 20+ packages
- **Features:** Camera, Voice, Animations, Sensors
- **Size:** ~50MB (with node_modules)
- **Requires:** Node.js 20.19+, npm/yarn

---

## 💡 Best Sharing Method:

**For Quick Demo:** Use Expo Tunnel (Option 2)
**For Full Testing:** Use GitHub Clone (Option 1)
**For Production:** Build APK/IPA (Option 3)

---

## 🐛 Common Issues:

### "Project is incompatible with Expo Go"
- Update Expo Go to latest version
- Make sure using SDK 54 (not 55)

### "Tunnel connection failed"
- Check internet connection
- Try `npx expo start --tunnel --clear`
- Restart Expo Go app

### "Camera not working"
- Grant camera permissions
- Test on real device (not simulator)
- Check camera is not used by another app

---

**Need help? Check the GitHub repo for updates!**
https://github.com/samarabdelhameed/flexo-
