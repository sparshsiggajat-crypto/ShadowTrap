import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google Gen AI securely with lazy/fallback capabilities
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Honeypot Gemini AI loaded successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini Client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY available. Operating in Offline Signature Fallback Mode.");
}

// Fallback signature processor for offline mode (ensures robust operation!)
function fallbackAnalyze(payload: string, pathUrl: string, method: string): any {
  const cleanPayload = (payload || "").toLowerCase();
  const cleanPath = (pathUrl || "").toLowerCase();
  
  let isMalicious = false;
  let threatLevel = 1;
  let severity = "LOW";
  let classification = "Normal User Activity";
  let hackerIntention = "Standard website navigation or probing.";
  let vulnerabilityTargeted = "None";
  let signatureDetected = "Clean Request";
  let explanation = "The request does not contain any obvious malicious patterns. The Honeypot allowed it to pass through to the real page or served standard content.";
  let suggestedFakeMock = "<h2>Server Response: 200 OK</h2><p>Welcome to the main application interface. Standard telemetry logged.</p>";

  // SQL Injection test
  if (
    cleanPayload.includes("'") || 
    cleanPayload.includes("or 1=1") || 
    cleanPayload.includes("select ") || 
    cleanPayload.includes("union select") || 
    cleanPayload.includes("drop table") ||
    cleanPayload.includes("admin' --") ||
    cleanPayload.includes("or '1'='1")
  ) {
    isMalicious = true;
    threatLevel = 8;
    severity = "HIGH";
    classification = "SQL Injection (SQLi)";
    hackerIntention = "Attempting to bypass authentication checks or dump sensitive database tables by injecting malicious SQL statements.";
    vulnerabilityTargeted = "Relational database input parsing vulnerability (Unsanitized POST/GET values).";
    signatureDetected = "SQL_INJECTION_LOGICAL_OR_TRUTHY_OR_UNION";
    explanation = "Our filter captured SQL syntax in user parameters. Instead of returning a real error or parsing SQL on our backend database, the hacker was instantly branched to the decoy duplicate. This duplicate feeds them synthesized SQL tables with fake records.";
    suggestedFakeMock = JSON.stringify([
      { id: 1, username: "sys_adm_decoy", password_hash: "$2b$12$ZfK9a8DdecoyHackerSuckersKeepTryingUncrackable", email: "decoy_admin@corp-internal.net", role: "Super Administrator" },
      { id: 2, username: "founder_ceo", password_hash: "$2b$12$LolRickRollFakeDeceptiveTablesSpoonFedJuicyPass", email: "ceo@corp-internal.net", role: "CEO" },
      { id: 49, username: "hidden_vault_key", password_hash: "FLAG{HONEYPOT_CAUGHT_YOU_SNOOPING_92813}", email: "vault@corp-internal.net", role: "Vault Keeper" }
    ], null, 2);
  }
  // Directory / Path Traversal
  else if (
    cleanPayload.includes("../") || 
    cleanPayload.includes("..\\") || 
    cleanPayload.includes("/etc/passwd") || 
    cleanPayload.includes("boot.ini") || 
    cleanPayload.includes("/bin/sh")
  ) {
    isMalicious = true;
    threatLevel = 7;
    severity = "HIGH";
    classification = "Path Traversal / Local File Inclusion (LFI)";
    hackerIntention = "Attempting to escape the web app root directory to read arbitrary sensitive OS internal files (like user files or password configurations).";
    vulnerabilityTargeted = "Improper filepath verification & local file inclusion boundaries.";
    signatureDetected = "PATH_TRAVERSAL_ETC_PASSWD_UPWARD_ACC_MATCH";
    explanation = "A ../ string or system file address was identified. The Honeypot diverted the traversal request, serving a synthetic mockup of '/etc/passwd' which contains dummy decoy users, humorously named.";
    suggestedFakeMock = `# Fake /etc/passwd generated for attacker surveillance
root:x:0:0:Decoy Root Master (Trap Installed):/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
sysadmin:x:1001:1001:Sucker Target Master:/home/sysadmin:/bin/sh
hacker_bait_user:x:1337:1337:Goat Account For Watching Hackers:/home/bait:/usr/bin/false
credit_card_vault:x:9999:9999:The vault uses 256 keys. Clue: Look in /var/log/syslog_fake_trap:/var/vault:/bin/sh`;
  }
  // Cross Site Scripting (XSS)
  else if (
    cleanPayload.includes("<script>") || 
    cleanPayload.includes("javascript:") || 
    cleanPayload.includes("onload=") || 
    cleanPayload.includes("alert(") || 
    cleanPayload.includes("<img src=")
  ) {
    isMalicious = true;
    threatLevel = 6;
    severity = "MEDIUM";
    classification = "Stored / Reflected Cross-Site Scripting (XSS)";
    hackerIntention = "Attempting to inject executable JavaScript code into web fields to compromise other users' browser sessions or steal cookies.";
    vulnerabilityTargeted = "Reflected / Stored context input validation and HTML sanitization failure.";
    signatureDetected = "SCRIPT_TAG_INLINE_JS_EXECUTION_ATTEMPT";
    explanation = "An executable HTML script tag/attribute was identified in input fields. Rather than saving this onto a database, the Honeypot parsed the tag, safely isolated its execution to a virtual terminal iframe, and fed back a harmless simulator showing cookies like 'AdminSessionTrapId=caught-you-red-handed'.";
    suggestedFakeMock = `<!DOCTYPE html>
<html>
<body>
  <h1>XSS Script Sandboxed Successfully</h1>
  <p>The code compiled in a secured environment on our honeypot duplicate portal. Here are your fake targets:</p>
  <ul>
    <li>Document.cookie = "Auth_Decoy=FakeHackerTokenForResearchPurposeOnly"</li>
    <li>LocalStore = { secretAgent: "007_Decoy" }</li>
  </ul>
</body>
</html>`;
  }
  // Remote Code Execution or shell exploit
  else if (
    cleanPayload.includes("curl ") || 
    cleanPayload.includes("wget ") || 
    cleanPayload.includes("ping -") || 
    cleanPayload.includes("whoami") || 
    cleanPayload.includes("cat ") || 
    cleanPayload.includes("rm -rf")
  ) {
    isMalicious = true;
    threatLevel = 9;
    severity = "CRITICAL";
    classification = "Remote Code Execution (RCE) / Command Injection";
    hackerIntention = "Attempting to escape the language sandbox and run native shell commands on the physical server host.";
    vulnerabilityTargeted = "Command execution via unescaped shell execution pipes.";
    signatureDetected = "SHELL_EXECUTION_COMMAND_INJECTION";
    explanation = "Native shell execution commands were intercepted in the request parameters. The Honeypot redirected the client to a robust virtual command-line environment that replicates a Linux shell. It mimics authentic feedback but contains completely harmless simulated configurations.";
    suggestedFakeMock = `uid=1337(hacker_bait) gid=1337(honeypot_surveillance) groups=1337(honeypot_surveillance)
System Status: 100% Isolated Null Container.
Warning: Decoy terminal logging enabled.
$ ls -la
total 32
drwxr-xr-x  3 bait  bait   1024 May 27 12:00 .
drwxr-xr-x 11 root  root   4096 May 27 10:00 ..
-rw-r--r--  1 bait  bait    101 May 27 12:00 secret_financials.csv.bak
-rw-r--r--  1 bait  bait  13337 May 27 12:00 rick_astley_lyrics.txt
-rwx------  1 bait  bait    512 May 27 12:00 auto_nuclear_launcher.sh`;
  }
  // Default probe or normal
  else if (cleanPath.includes("admin") || cleanPath.includes("login") || cleanPath.includes("wp-") || cleanPath.includes("config")) {
    isMalicious = true;
    threatLevel = 4;
    severity = "MEDIUM";
    classification = "Unauthorized Directory Reconnaissance";
    hackerIntention = "Scanning the host for obvious configuration panel endpoints or backend administrative gateways.";
    vulnerabilityTargeted = "Administrative portal discovery scanning.";
    signatureDetected = "DIRECTORY_RECON_COMMON_ADMIN_PATH";
    explanation = "The client directly requested an administrative pathway commonly target of automated vulnerability scans. The trick filter intercepted the navigation and gently redirected them to an authentic-looking, fake duplicate Login Page containing mock credential capture forms.";
    suggestedFakeMock = `<!-- Honeypot Simulated Admin login -->
<div class="p-6 bg-slate-900 border border-red-500 rounded text-center">
  <h3 class="text-red-500 font-bold mb-2">INTELLIGENT DECOY GATEWAY</h3>
  <p class="text-slate-400 text-sm mb-4">Database: offline_decoy_pool_A</p>
  <input class="block w-full p-2 mb-2 bg-slate-800 text-white rounded border border-slate-700" placeholder="Username" />
  <input class="block w-full p-2 mb-4 bg-slate-800 text-white rounded border border-slate-700" type="password" placeholder="Password" />
  <button class="w-full bg-red-600 text-white p-2 rounded">Sign In as Admin</button>
</div>`;
  }

  return {
    isMalicious,
    threatLevel,
    severity,
    classification,
    hackerIntention,
    vulnerabilityTargeted,
    signatureDetected,
    explanation,
    suggestedMockResponseMarkup: suggestedFakeMock
  };
}

// API endpoint for analyzing an incoming simulated exploit attempt
app.post("/api/analyze-attack", async (req, res) => {
  const { payload, path: pathUrl, method } = req.body;
  if (!payload && !pathUrl) {
    return res.status(400).json({ error: "Missing payload or path input to analyze" });
  }

  const analysisMethod = method || "POST";
  const analysisPath = pathUrl || "/api/v1/auth";
  const targetPayload = payload || "";

  // Perform offline signature scanning first
  const fallback = fallbackAnalyze(targetPayload, analysisPath, analysisMethod);

  // If Gemini is configured, enrich the analysis with precise smart evaluations!
  if (ai) {
    try {
      const prompt = `You are "The Honeypot", an advanced smart trick website filter that intercepts hacking scripts and redirects attackers quietly to simulated safe duplicate portals.
Your task is to analyze an incoming HTTP Request and return a comprehensive security evaluation.

REQUEST METADATA:
- HTTP Method: ${analysisMethod}
- Targeted URL Path: ${analysisPath}
- HTTP Payload (User input parameters): 
${targetPayload}

Compare this request to known exploit styles (SQL Injection, Cross-Site Scripting, Local File Inclusion / Path Traversal, Arbitrary Command Injection/RCE, Administrator Gateway Brute-Forcing, Credential Stuffing).

Analyze and determine:
1. isMalicious: true if this contains unauthorized probing syntax, formatting, attempts to bypass login, or executable code; false for clean or standard user actions.
2. threatLevel: A number from 1 to 10 (1 = completely harmless standard use, 10 = highly destructive server core takeover attempt).
3. severity: "LOW" (1-3), "MEDIUM" (4-6), "HIGH" (7-8), "CRITICAL" (9-10).
4. classification: Full classified name of the attack type.
5. hackerIntention: Description of what the hacker is aiming to steal, corrupt, or bypass with this payload.
6. vulnerabilityTargeted: The security flaw they are hoping will execute this payload.
7. signatureDetected: A symbolic system tag (e.g., "SQLI_EXEC_CREDENTIAL_BYPASS" or "XSS_LOCAL_STORAGE_CATCH").
8. explanation: Clear description of why our trick filter captured this, and exactly how the honeypot safely neutralizes it.
9. suggestedMockResponseMarkup: The fake duplicate data/screen content we should serve back to make them believe their exploit succeeded!
   - If SQL injection, provide a fake JSON array or CSV containing humorous decoy user databases or secret keys (e.g. funny names, uncrackable hashes, hints).
   - If Local file traversal, provide fake internal file logs, custom simulated server logs, or systems configuration files with jokes in them.
   - If XSS, provide fake sandbox target logs or dummy security cookies to keep them busy.
   - If command injection, provide a mockup of terminal output showing system stats that are humorous.
   - Speak in a highly convincing, clever, and professional administrative tone for standard formats, but inject harmless decoys/hints so we can safely watch what they do next.

Provide the response strictly in JSON that matches the following schema:
isMalicious: boolean,
threatLevel: integer,
severity: string (enum: LOW, MEDIUM, HIGH, CRITICAL),
classification: string,
hackerIntention: string,
vulnerabilityTargeted: string,
signatureDetected: string,
explanation: string,
suggestedMockResponseMarkup: string

IMPORTANT: Return ONLY raw valid JSON matching this structure. Do not wrap in markdown \`\`\`json blocks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isMalicious: { type: Type.BOOLEAN },
              threatLevel: { type: Type.INTEGER },
              severity: { type: Type.STRING },
              classification: { type: Type.STRING },
              hackerIntention: { type: Type.STRING },
              vulnerabilityTargeted: { type: Type.STRING },
              signatureDetected: { type: Type.STRING },
              explanation: { type: Type.STRING },
              suggestedMockResponseMarkup: { type: Type.STRING }
            },
            required: [
              "isMalicious", 
              "threatLevel", 
              "severity", 
              "classification", 
              "hackerIntention", 
              "vulnerabilityTargeted", 
              "signatureDetected", 
              "explanation", 
              "suggestedMockResponseMarkup"
            ]
          }
        }
      });

      const responseText = response.text ? response.text.trim() : "";
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      }
    } catch (err) {
      console.warn("Gemini evaluation error. Falling back to static robust engine. Error details:", err);
    }
  }

  // fallback clean response
  return res.json(fallback);
});

// Mock initial active hacker feeds to populate dashboard
app.get("/api/sessions", (req, res) => {
  res.json([
    {
      id: "hck-9081",
      ip: "185.220.101.44",
      country: "Germany",
      countryCode: "DE",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) CobaltOS-Survaill/9.4",
      threatScore: 92,
      status: "DIVERTED",
      startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      lastActiveAt: new Date(Date.now() - 120000).toISOString(),
      totalAttempts: 12
    },
    {
      id: "hck-3342",
      ip: "43.250.21.199",
      country: "China",
      countryCode: "CN",
      userAgent: "curl/7.81.0-SecScanner-WgetCore",
      threatScore: 78,
      status: "MONITORED",
      startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      lastActiveAt: new Date(Date.now() - 600000).toISOString(),
      totalAttempts: 8
    },
    {
      id: "hck-1114",
      ip: "89.207.132.8",
      country: "Netherlands",
      countryCode: "NL",
      userAgent: "Nmap Scripting Engine (NSE)",
      threatScore: 85,
      status: "DIVERTED",
      startedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      lastActiveAt: new Date(Date.now() - 1800000).toISOString(),
      totalAttempts: 22
    }
  ]);
});

// Vite middleware hooks & Production static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite integration middleware mounted under Express.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static build mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Honeypot server boots on: http://localhost:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error("Failed to boot The Honeypot Server:", err);
});
