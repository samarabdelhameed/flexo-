# 📱 How to Try Flexo App

## Option 1: Direct Link (Easiest) ✅

**Share this URL with your friend:**
```
exp://oq7x1ma-anonymous-8081.exp.direct
```

**Steps for your friend:**
1. Install **Expo Go** app from App Store or Google Play
2. Open Expo Go
3. Tap "Enter URL manually"
4. Paste: `exp://oq7x1ma-anonymous-8081.exp.direct`
5. Tap "Connect"

---

## Option 2: GitHub + Local Run

**Share the GitHub repo:**
```
https://github.com/samarabdelhameed/flexo-
```

**Steps for your friend:**
1. Clone the repo:
   ```bash
   git clone https://github.com/samarabdelhameed/flexo-.git
   cd flexo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npx expo start --tunnel
   ```

4. Scan the QR code with Expo Go

---

## Option 3: Share via QR Code

When you run `npx expo start --tunnel`, a QR code appears in the terminal.

**Steps:**
1. Take a screenshot of the QR code
2. Send the screenshot to your friend
3. They scan it with Expo Go app

---

## 🎯 What Your Friend Will See:

1. **Welcome Screen** - Lottie animation with greeting
2. **Voice Messages** - "Good to see you! I'm Flexo 🐕"
3. **Exercise Selection** - Choose from 3 exercises
4. **Camera View** - Real-time hand tracking (simulated)
5. **Progress Report** - Stats and achievements

---

## 📊 Features to Test:

- ✅ Voice-guided conversation
- ✅ Exercise selection
- ✅ Camera view with hand skeleton overlay
- ✅ Real-time feedback messages
- ✅ Progress tracking
- ✅ Haptic feedback
- ✅ Lottie animations
- ✅ Settings page

---

## 🔗 Quick Links:

- **GitHub**: https://github.com/samarabdelhameed/flexo-
- **Expo Tunnel**: exp://oq7x1ma-anonymous-8081.exp.direct

---

## 💡 Tips:

- Make sure both devices are connected to internet (tunnel works over internet, not just WiFi)
- If the tunnel URL doesn't work, run `npx expo start --tunnel` again to get a new URL
- The app works best on real devices (not simulators) for camera features

---

## 🐛 Troubleshooting:

**If the app doesn't load:**
1. Make sure Expo Go is updated to latest version
2. Try restarting Expo Go app
3. Check internet connection
4. Try running `npx expo start --tunnel --clear` for a fresh start

**If camera doesn't work:**
- Grant camera permissions when prompted
- The hand tracking is currently simulated for demo purposes
- Real hand tracking requires MediaPipe integration (coming soon)

---

**Built with ❤️ using React Native + Expo**
