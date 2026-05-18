# 📱 How to Share Flexo App

## ⚠️ Important: Snack.expo.dev DOES NOT WORK

Snack cannot run this app because it uses:
- ❌ Camera (expo-camera)
- ❌ Hand tracking (MediaPipe)
- ❌ Native modules
- ❌ Large dependencies

---

## ✅ Working Methods to Share:

### Method 1: GitHub Clone (Best for Developers) ⭐

**Send this to your friend:**

```
GitHub: https://github.com/samarabdelhameed/flexo-

Steps to run:
1. git clone https://github.com/samarabdelhameed/flexo-.git
2. cd flexo-
3. npm install
4. npx expo start --tunnel
5. Open Expo Go app and scan QR code

Requirements:
- Node.js 20.19+
- npm or yarn
- Expo Go app on phone
```

---

### Method 2: Direct Tunnel URL (If App is Running)

**If you're running the app right now:**

1. Start app: `npx expo start --tunnel`
2. Copy the tunnel URL (looks like: `exp://xxxxx-anonymous-8081.exp.direct`)
3. Send URL to friend
4. They open Expo Go → "Enter URL manually" → Paste URL

⚠️ **Note:** This only works while YOUR app is running!

---

### Method 3: Screen Recording Video 📹

**Easiest for quick demo:**

1. Run the app on your phone
2. Record screen while using it
3. Upload to:
   - YouTube (unlisted)
   - Google Drive
   - Loom
4. Share the link

---

### Method 4: Build Standalone App (Production)

**For a real installable app:**

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build APK (Android)
eas build --platform android --profile preview

# After build completes, you'll get a download link
```

Share the APK download link with your friend!

---

## 🎯 What Your Friend Will Experience:

When they run the app, they'll see:

1. ✅ Welcome screen with Lottie dog animation
2. ✅ Voice conversation: "Good to see you! I'm Flexo 🐕"
3. ✅ Exercise selection (3 exercises)
4. ✅ **Real camera with hand tracking**
5. ✅ Hand skeleton overlay (yellow lines + green dots)
6. ✅ Real-time voice feedback
7. ✅ Progress reports and stats

---

## 📊 Technical Details:

- **Platform:** React Native + Expo SDK 54
- **Hand Tracking:** MediaPipe Hand Landmarker
- **Camera:** expo-camera + real-time processing
- **Voice:** Text-to-speech with ElevenLabs API
- **Animations:** Lottie
- **Size:** ~50MB with dependencies

---

## 🐛 Why Snack Doesn't Work:

Snack.expo.dev is a **web-based preview tool** with limitations:
- ❌ No native modules
- ❌ No camera access
- ❌ No MediaPipe
- ❌ Limited dependencies
- ❌ Web environment only

Our app needs:
- ✅ Real device camera
- ✅ Native processing
- ✅ Hardware sensors
- ✅ Full Expo SDK

**That's why local installation is required!**

---

## 💡 Recommended Sharing Method:

**For developers:** Method 1 (GitHub Clone)
**For quick demo:** Method 3 (Video)
**For production:** Method 4 (Build APK)

---

## 🔗 Links:

- **GitHub:** https://github.com/samarabdelhameed/flexo-
- **Full Documentation:** See README.md in repo
- **Deployment Guide:** See DEPLOYMENT.md in repo

---

**Questions? Check the GitHub repo or run locally to test!** 🚀
