# 🛡️ ShadowTrap

> **AI-powered adaptive honeypot system for cyber threat deception and real-time monitoring.**

---

## 📖 Project Overview

**ShadowTrap** is an advanced, high-fidelity corporate cyber-deception and honeynet surveillance cockpit. Traditional web firewalls block intrusion traffic outright, which leaks protective strategies to hackers and triggers immediate adjustments to their attack patterns. 

**ShadowTrap** shifts the paradigm. Instead of rejecting suspicious traffic, it leverages a real-time logical filtering proxy system. Sophisticated threat vectors (SQL Injections, Cross-Site Scripting, Directory Transversals, and Command Injections) are instantly detected, disarmed, and **silently routed directly into realistic, isolated deception sandboxes (Honeypots)**. Adversaries run queries, inspect tables, and try to break the portal completely, unaware that they are interacting with live-synthesized mock records under active surveillance.

---

## ✨ Features

- **🌐 Live Attack Redirect Gate**: Intrusive vectors are identified natively inside the security gates. Clean user identities (e.g., standard operator access) route straight to the real console, while threats are branched without triggering any alarms or errors.
- **🎨 Interactive Cyber Deception Cockpit**: A beautiful, glowing, high-contrast dark mode canvas providing deep visual telemetry.
- **🗺️ Geotracker Heatmap**: Pinpoints attacking hosts’ latitude/longitude on an interactive vector tracker map in real-time.
- **💻 Decoy Sandbox Browser**: Allows security experts to see exactly what "site version" is being spoon-fed to the isolated intruder (Fictional billing databases, sarcastic rickrolls, infinite loading stalls, etc.).
- **⚙️ Live Active Posture Control**: Dynamically calibrate bait aggression levels, lie injection frequencies, and deception modes (Observation, Active Deception, or pure Sarcastic Chaos).
- **📊 Simulated Attack Workbench (Demos)**: Enables non-technical reviewers or pitch judges to trigger preset SQLi, XSS, or RCE queries with a single click and watch the pipeline isolate them instantly.
- **💬 Real-Time SIEM Forensic Logging**: Decodes hacker intentions, target vulnerabilities, signature matches, and response telemetry under easy-to-read human labels.

---

## 📸 Screenshots Section

*Below are interactive UI areas mapped during deep threat intercepts:*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SHADOWTRAP MONITORED GATE                       │
├────────────────────────────────────────────────────────────────────────┤
│  [  User Identity Input  ]  ──► (Checks Attack Signatures)            │
│                                            │                           │
│                      ┌─────────────────────┴─────────────────────┐     │
│                      ▼ (Malicious payload)                       ▼     │
│             ┌─────────────────┐                        ┌─────────────┐ │
│             │ DECOY HONEYPOT  │                        │ REAL SYSTEM │ │
│             │  Active Spoof   │                        │ Secure Logs │ │
│             └─────────────────┘                        └─────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```
*(Dynamic previews are fully accessible inside the deployment iframe environment.)*

---

## 🛠️ Tech Stack

**ShadowTrap** boasts a modular, extremely fast, modern full-stack architecture:

- **Frontend Core**: React 19 (using modern Functional Components and Hooks)
- **Styling & Themeing**: Tailwind CSS v4 (with fluid responsive layouts, custom neon bounding glows, and Space Grotesk/Inter typography)
- **Animations Engine**: `motion` (by Motion for React) for smooth, high-fidelity state transitions
- **Backend Proxy Server**: Express (coupled with server-side API proxying to securely handle Gemini AI and forensic routines)
- **State Architecture**: Standard Node.js `tsx` running standalone ESM-CJS bundle configurations (using `esbuild` for ultra-fast container boots)
- **Vector Graphics**: `lucide-react` icons


---



## 🔮 Future Scope

- **🤖 Autonomous AI Counter-Measures**: Integrate deep Gemini agents that analyze custom raw hacker keylogger streams on-the-fly, generating custom database schemas tailored specifically to whatever industry they are attempting to exploit.
- **🔐 Active Web-Shell Sandbox**: Provide a pseudo-shell that can simulate a compromised Linux shell terminal, feeding realistic false directory files of confidential project specifications.
- **📡 Multi-Node SIEM Interoperability**: Support distributed decoy nodes scattered across global cloud regions, transmitting logs via decentralized websockets to a unified single dashboard.

---

## 🏆 Hackathon Presentation Summary

- **The Core Problem**: Standard cybersecurity products focus on strict blocking rules. Security logs show millions of boring alerts daily, but fail to confuse attackers or gain advanced forensics on what they wanted to steal.
- **Our Innovative Solution**: **ShadowTrap** acts as a giant web of false promises. By blending beautiful cyber metrics with instant mock-data generation, security managers get 100% full intelligence on exploit techniques *and* block any leakage of confidential corporate databases, all while maintaining perfect administrative calm.
- **Demo Viability**: The application runs completely server-side, leverages fully animated flows, and features custom manual injectors to let judges breach the system safe and live during pitches.

---

App Demo Link
https://the-honeypot-195010458417.asia-southeast1.run.app

---
*Coded with precision for ShadowTrap hackathon presentation. All components complied with strict type safety.*
