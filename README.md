

<div align="center">
  <img src="logo/scsoftware.png" width="100px" alt="SCSoftwareLogo" />
  <h1 style="font-size: 28px; margin: 10px 0;">Starlight Anticheat</h1>
  <p>Advanced Anti-Cheat Framework for Browser Games</p>
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0-blue.svg)](https://github.com/starlight-anticheat/starlight-anticheat)

---

## **Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
   
   * [Client-Side](#client-side)
   * [Server-Side](#server-side)
4. [Architecture & Workflow](#architecture--workflow)
5. [Installation](#installation)
   
   * [Server](#server)
   * [Client](#client)
6. [Telemetry Workflow](#telemetry-workflow)
7. [Configuration](#configuration)
8. [Best Practices & Security](#best-practices--security)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

---

## **Overview**

Starlight Anticheat is a **modular client-server anti-cheat system** tailored for **web-based browser games**. It combines **client-side monitoring** with **server-side validation** to detect cheating patterns in real-time while remaining easy to integrate and configure.

**Key Capabilities:**

* Client-side monitoring for console manipulation, tampering, and gameplay anomalies
* Server-side event validation with verdict scoring: `clean`, `suspicious`, or `cheater`
* Optional real-time WebSocket dashboard for live telemetry
* Modular and configurable to suit different game architectures

---

## **Features**

### **Client-Side**

* Input monitoring (clicks, key presses, mouse/touch movement)
* Developer console detection and warning
* Console paste prevention
* Script hash and integrity verification
* DOM mutation monitoring (script injection, iframe detection)
* Configurable telemetry intervals and thresholds

### **Server-Side**

* Real-time telemetry ingestion
* Event normalization and validation
* Session management and rate limiting
* Verdict engine with risk scoring (`clean`, `suspicious`, `cheater`)
* Logging to file and console
* Optional WebSocket support for live admin dashboards

---

## **Architecture & Workflow**

```
+----------------+       HTTPS / WSS       +---------------------+
|                | ----------------------> |                     |
|  Browser Game  |                         |  Starlight Server   |
|  Client        | <---------------------- |  Node.js Backend    |
|                |       WebSocket (opt)   |                     |
| - Loader       |                         | - Event Normalizer  |
| - Client       |                         | - Session Manager   |
| - Integrity    |                         | - Verdict Engine    |
| - Hooks        |                         | - Logger            |
| - Console      |                         +---------------------+
+----------------+
```

**Workflow:**

1. Client modules collect telemetry & detect anomalies
2. Telemetry is securely signed and sent to the server
3. Server validates, normalizes, and scores events
4. Optional: Live WebSocket dashboard receives real-time updates

---

## **Installation**

### **Server**

1. Clone the repository:

```bash
git clone https://github.com/yourusername/starlight-anticheat.git
cd starlight-anticheat/server
```

2. Install dependencies:

```bash
npm install express ws morgan
```

3. Configure `server/config/server.config.js`:

```js
module.exports = {
  port: 4000,
  allowedOrigins: ["https://yourgame.com"],
  privateSalt: "replace_with_secure_random_string",
  rateLimit: { windowMs: 10000, max: 60 },
  websocketPath: "/ws"
};
```

4. Start the server:

```bash
node index.js
```

### **Client**

1. Include the client folder in your web game project.
2. Import the loader in your HTML:

```html
<script type="module">
  import StarlightLoader from './client/starlight.loader.js';

  StarlightLoader.load({
    gameId: "MY_GAME_ID",
    debug: true
  });
</script>
```

3. Optional: Enable WebSocket for live monitoring:

```js
StarlightLoader.load({
  liveEndpoint: "wss://yourdomain.com/ws",
  debug: true
});
```

---

## **Telemetry Workflow**

```
Client Modules
+-----------------+
| Integrity       |
| Hooks           |
| Console         |
+--------+--------+
         |
         v
  Event Buffer
         |
         v
  Signed Telemetry
         |
         v
+-----------------+
| Starlight Server|
| - Validate      |
| - Normalize     |
| - Verdict       |
+--------+--------+
         |
         v
  Admin Dashboard (WebSocket)
```

* Client collects events and sends them securely
* Server validates & scores events in real time
* Admin dashboard receives live WebSocket telemetry (optional)

---

## **Configuration**

### **Client (`starlight.config.js`)**

```js
{
  gameId: "YOUR_GAME_ID",
  flushIntervalMs: 3000,
  maxEventBuffer: 200,
  integrity: { enabled: true, checkIntervalMs: 2500 },
  console: { warnOnOpen: true, blockConsolePaste: true, watermarkText: "Protected by Starlight" },
  gameplay: { maxClicksPerSecond: 18, maxKeyPressPerSecond: 25 },
  crypto: { clientSalt: "public_salt_not_secret", timestampSkewMs: 15000 },
  liveEndpoint: null,
  debug: false
}
```

### **Server (`server.config.js`)**

```js
{
  port: 4000,
  allowedOrigins: ["https://yourgame.com"],
  privateSalt: "replace_with_secure_random_string",
  rateLimit: { windowMs: 10000, max: 60 },
  websocketPath: "/ws"
}
```

---

## **Best Practices & Security**

* Always use **HTTPS** in production
* Limit `allowedOrigins` to your domain(s)
* Keep `privateSalt` secret on the server
* Don’t rely solely on client-side anti-cheat—server validation is critical
* Enable `debug: true` for integration/testing; disable in production

---

## **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## **License**

MIT License – free for personal and commercial use.
Please retain credit to Starlight Anticheat in your project.

---
