# StarLight Anticheat v5 for Webgames
**How to setup for my webgame**

Welcome to the **StarLight Anticheat v5 Main User Guide**! This document provides a complete overview for webgame developers on how to integrate, configure, and maintain StarLightAC on their websites.

---

## **1️⃣ Overview**

StarLightAC Web is a **web-based anticheat system** designed to detect and prevent cheating in browser games. It features:

* DevTools detection and optional blocking
* Console code execution detection
* DOM, canvas, and WebGL tamper detection
* Clipboard monitoring
* Persistent bans stored in MongoDB
* Discord webhook notifications
* Fully configurable by the site owner

StarLightAC is intended to run with a **Vercel-hosted backend**, ensuring bans persist across sessions and cannot be bypassed by page reloads.

---

## **2️⃣ Integration Steps**

### **Step 1: Include StarLightAC Script**

1. Download the `starlight_anticheat.js` file via the green "Code" button at the top right.
2. Insert the file into your webpages main folder (where your main game is located)
3. Add the following script tag to your HTML before your main game code:

```html
<script src="starlight_anticheat.js"></script>
```

### **Step 2: Initialize and Configure**

1. At the top of the `starlight_anticheat.js`, find the settings like shown below.
2. Configure the settings to your liking.
   
```html
this.settings = Object.assign({
        blockDevTools: true,          // true = block F12 / shortcuts
        banOnConsoleExec: true,       // true = ban user on console tamper, false = warn
        detectConsoleExec: true,
        detectDevTools: true,
        detectKeybinds: true,
        detectClipboard: true,
        detectCanvasWebGL: true,
        detectDOMMutation: true,
        detectTiming: true,
        detectionInterval: 1000,
        banDurationMs: 48*60*60*1000,
        telemetryFlushInterval: 5000,
        serverBase: '/',              // Vercel base URL
        webhookURL: null      
```

### **Step 3: Test Detection**

* Open your game.
* Try opening DevTools or pasting code in the console.
* Check that banned users are redirected to the ban overlay.
* Verify that Discord webhook receives notifications on bans. (If you have enabled webhook logs)

---

## **3️⃣ Configuration Options**

Site owners can adjust the following settings when initializing StarLightAC:

* **serverBase**: Your Vercel deployment URL.
* **webhookURL**: Discord webhook for notifications.
* **banOnConsoleExec**: Ban or warn users when code is detected in the console.
* **blockDevTools**: Enable or disable DevTools blocking.
* **detectConsoleExec**: Enable console tampering detection.
* **detectDevTools**: Detect DevTools opening.
* **detectKeybinds**: Detect suspicious key combinations (e.g., Ctrl+U).
* **detectClipboard**: Monitor copy and paste events.
* **detectCanvasWebGL**: Detect tampering with canvas or WebGL.
* **detectDOMMutation**: Detect suspicious DOM modifications.
* **detectTiming**: Detect anomalies in execution timing.
* **detectionInterval**: Interval in ms for running detection checks.
* **banDurationMs**: Duration of bans in milliseconds.
* **telemetryFlushInterval**: Interval in ms to flush detection reports.

---

## **4️⃣ Ban Behavior**

* **Ban Overlay**: Users who are banned see a full-screen, animated overlay with the reason and expiration time.
* **Persistent Bans**: Bans are stored in MongoDB via Vercel APIs and persist across reloads.
* **Webhook Notifications**: Sends IP, Client ID, reason, and ban duration to Discord if configured.

---

## **5️⃣ Recommended Practices**

* **Keep your webhook secure**: Only share with trusted staff.
* **Adjust detection settings** based on your game’s vulnerability and type.
* **Regularly monitor** ban logs and webhook notifications.
* **Test in staging** before going live.
* **Update the script** from GitHub to ensure you have the latest fixes.

---

## **6️⃣ Troubleshooting**

* **Bans not persisting**: Check that your MongoDB connection string is correct and set in Vercel environment variables.
* **Webhook not triggering**: Ensure your Discord webhook URL is correct and publicly accessible.
* **DevTools not blocked**: Ensure `blockDevTools: true` is set in your configuration.

---

**Congratulations!** 🎉
Your webgame is now protected with StarLight Anticheat v5. Users attempting to cheat will be detected, banned, and reported automatically.

**© 2025 Aztherix Software - All rights reserved**
