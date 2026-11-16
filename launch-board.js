"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const net = require("node:net");
const os = require("node:os");
const { spawn, execFileSync } = require("node:child_process");

const ROOT_DIR = path.resolve(__dirname);
const APP_ID = "english-visualization-board";
const SERVER_VERSION = 3;
const HOST = "127.0.0.1";
const PORT_START = 5510;
const PORT_END = 5519;
const MAX_JSON_BODY_BYTES = 120 * 1024 * 1024;

const GIT_DIR = path.join(ROOT_DIR, ".git");
const STATE_FILE = fs.existsSync(GIT_DIR)
  ? path.join(GIT_DIR, "whiteboard-picker-state.json")
  : path.join(os.tmpdir(), "whiteboard-picker-state.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff"
};

const allowedFilePaths = new Set();
let isDialogOpen = false;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

function isPathInsideRoot(targetPath) {
  const resolved = path.resolve(targetPath);
  return resolved === ROOT_DIR || resolved.startsWith(ROOT_DIR + path.sep);
}

function readPickerState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return {};
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_err) {
    return {};
  }
}

function saveLastDirectory(dirPath) {
  try {
    if (!dirPath) return;
    const resolvedDir = path.resolve(dirPath);
    if (!fs.existsSync(resolvedDir)) return;
    const prev = readPickerState();
    const next = {
      ...prev,
      lastDirectory: resolvedDir,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(next, null, 2), "utf8");
  } catch (_err) {
    // 상태 파일 저장 실패는 무시
  }
}

function getLastDirectory() {
  const state = readPickerState();
  if (typeof state.lastDirectory === "string" && state.lastDirectory.trim()) {
    try {
      const candidate = path.resolve(state.lastDirectory);
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        return candidate;
      }
    } catch (_err) {
      // ignore invalid directory
    }
  }
  const txtsDir = path.join(ROOT_DIR, "txts");
  try {
    if (fs.existsSync(txtsDir) && fs.statSync(txtsDir).isDirectory()) {
      return txtsDir;
    }
  } catch (_err) {
    // ignore
  }
  return ROOT_DIR;
}

function sendJson(res, statusCode, payload, extraHeaders = {}) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders
  });
  res.end(body);
}

function isTrustedLocalApiRequest(req) {
  if (req.headers["x-whiteboard-local"] !== "1") {
    return false;
  }
  const origin = req.headers.origin;
  if (origin) {
    if (
      !/^http:\/\/127\.0\.0\.1(?::\d+)?$/i.test(origin) &&
      !/^http:\/\/localhost(?::\d+)?$/i.test(origin)
    ) {
      return false;
    }
  }
  const remote = req.socket?.remoteAddress || "";
  if (remote && remote !== "127.0.0.1" && remote !== "::ffff:127.0.0.1" && remote !== "::1") {
    return false;
  }
  return true;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;
    let settled = false;

    req.on("data", (chunk) => {
      if (settled) return;
      totalBytes += chunk.length;
      if (totalBytes > MAX_JSON_BODY_BYTES) {
        settled = true;
        reject(Object.assign(new Error("요청 데이터 크기가 너무 큽니다."), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (settled) return;
      settled = true;
      try {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve(text ? JSON.parse(text) : {});
      } catch (_err) {
        reject(Object.assign(new Error("잘못된 JSON 요청입니다."), { statusCode: 400 }));
      }
    });

    req.on("error", (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    });
  });
}

async function writeFileWithRetry(filePath, content) {
  const retryDelaysMs = [150, 350, 650, 1000];
  let lastError = null;
  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      await fs.promises.writeFile(filePath, content, "utf8");
      return;
    } catch (error) {
      lastError = error;
      if (attempt < retryDelaysMs.length) {
        await new Promise((resolve) => setTimeout(resolve, retryDelaysMs[attempt]));
      }
    }
  }
  throw lastError || new Error("파일 쓰기에 실패했습니다.");
}

function showWindowsFileDialog(mode, suggestedName = "") {
  const psScript = [
    "Add-Type -AssemblyName System.Windows.Forms",
    "Add-Type -AssemblyName System.Drawing",
    "[System.Windows.Forms.Application]::EnableVisualStyles()",
    "$owner = New-Object System.Windows.Forms.Form",
    "$owner.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual",
    "$owner.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None",
    "$owner.ShowInTaskbar = $false",
    "$owner.TopMost = $true",
    "$owner.Opacity = 0.01",
    "$owner.Size = New-Object System.Drawing.Size(1, 1)",
    "$screen = [System.Windows.Forms.Screen]::FromPoint([System.Windows.Forms.Cursor]::Position)",
    "$area = $screen.WorkingArea",
    "$owner.Location = New-Object System.Drawing.Point(($area.Left + [int]($area.Width / 2)), ($area.Top + [int]($area.Height / 2)))",
    "$owner.Show()",
    "$owner.Activate()",
    "if ($env:WB_MODE -eq 'save') {",
    "  $dlg = New-Object System.Windows.Forms.SaveFileDialog",
    "  $dlg.Title = '다른 이름으로 TXT 저장'",
    "  $dlg.Filter = 'Text files (*.txt)|*.txt|All files (*.*)|*.*'",
    "  $dlg.DefaultExt = 'txt'",
    "  $dlg.AddExtension = $true",
    "  $dlg.OverwritePrompt = $true",
    "  if ($env:WB_SUGGESTED_NAME) { $dlg.FileName = $env:WB_SUGGESTED_NAME }",
    "} else {",
    "  $dlg = New-Object System.Windows.Forms.OpenFileDialog",
    "  $dlg.Title = 'TXT 파일 불러오기'",
    "  $dlg.Filter = 'Text files (*.txt)|*.txt|All files (*.*)|*.*'",
    "  $dlg.CheckFileExists = $true",
    "}",
    "if ($env:WB_INITIAL_DIR -and (Test-Path -LiteralPath $env:WB_INITIAL_DIR -PathType Container)) {",
    "  $dlg.InitialDirectory = $env:WB_INITIAL_DIR",
    "}",
    "$result = $dlg.ShowDialog($owner)",
    "$owner.Close()",
    "$owner.Dispose()",
    "if ($result -eq [System.Windows.Forms.DialogResult]::OK -and $dlg.FileName) {",
    "  $bytes = [System.Text.Encoding]::UTF8.GetBytes($dlg.FileName)",
    "  [Console]::Out.WriteLine(('WB_OK:' + [Convert]::ToBase64String($bytes)))",
    "} else {",
    "  [Console]::Out.WriteLine('WB_CANCEL')",
    "}"
  ].join("\n");

  const encodedCommand = Buffer.from(psScript, "utf16le").toString("base64");
  const initialDir = getLastDirectory();
  const childEnv = {
    ...process.env,
    WB_MODE: mode === "save" ? "save" : "open",
    WB_INITIAL_DIR: initialDir,
    WB_SUGGESTED_NAME: String(suggestedName || "")
  };

  return new Promise((resolve, reject) => {
    const child = spawn(
      "powershell.exe",
      ["-NoProfile", "-STA", "-EncodedCommand", encodedCommand],
      {
        env: childEnv,
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"]
      }
    );

    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", (err) => {
      reject(err);
    });
    child.on("close", (code) => {
      const lines = stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const okLine = lines.find((line) => line.startsWith("WB_OK:"));
      if (okLine) {
        try {
          const b64 = okLine.slice("WB_OK:".length);
          const chosenPath = Buffer.from(b64, "base64").toString("utf8");
          resolve({ cancelled: false, filePath: path.resolve(chosenPath) });
          return;
        } catch (decodeErr) {
          reject(decodeErr);
          return;
        }
      }
      if (lines.includes("WB_CANCEL") || code === 0) {
        resolve({ cancelled: true, filePath: null });
        return;
      }
      reject(new Error(stderr.trim() || `파일 선택 창 실행 실패 (exit code ${code})`));
    });
  });
}

async function handleNativeOpenApi(req, res) {
  if (!isTrustedLocalApiRequest(req)) {
    sendJson(res, 403, { ok: false, error: "Forbidden" });
    return;
  }
  if (isDialogOpen) {
    sendJson(res, 409, { ok: false, busy: true, error: "이미 파일 선택 창이 열려 있습니다." });
    return;
  }

  isDialogOpen = true;
  try {
    const result = await showWindowsFileDialog("open");
    if (result.cancelled || !result.filePath) {
      sendJson(res, 200, { ok: true, cancelled: true });
      return;
    }

    const content = await fs.promises.readFile(result.filePath, "utf8");
    saveLastDirectory(path.dirname(result.filePath));
    allowedFilePaths.add(result.filePath);

    sendJson(res, 200, {
      ok: true,
      cancelled: false,
      filePath: result.filePath,
      fileName: path.basename(result.filePath),
      content
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error?.message || "파일 불러오기 중 오류가 발생했습니다." });
  } finally {
    isDialogOpen = false;
  }
}

async function handleNativeSaveAsApi(req, res) {
  if (!isTrustedLocalApiRequest(req)) {
    sendJson(res, 403, { ok: false, error: "Forbidden" });
    return;
  }
  if (isDialogOpen) {
    sendJson(res, 409, { ok: false, busy: true, error: "이미 저장 창이 열려 있습니다." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    sendJson(res, err.statusCode || 400, { ok: false, error: err.message });
    return;
  }

  const content = typeof body?.content === "string" ? body.content : "";
  const suggestedName = typeof body?.suggestedName === "string" ? path.basename(body.suggestedName.trim()) : "";

  isDialogOpen = true;
  try {
    const result = await showWindowsFileDialog("save", suggestedName);
    if (result.cancelled || !result.filePath) {
      sendJson(res, 200, { ok: true, cancelled: true });
      return;
    }

    await writeFileWithRetry(result.filePath, content);
    saveLastDirectory(path.dirname(result.filePath));
    allowedFilePaths.add(result.filePath);

    sendJson(res, 200, {
      ok: true,
      cancelled: false,
      filePath: result.filePath,
      fileName: path.basename(result.filePath)
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error?.message || "파일 저장 중 오류가 발생했습니다." });
  } finally {
    isDialogOpen = false;
  }
}

async function handleNativeSaveCurrentApi(req, res) {
  if (!isTrustedLocalApiRequest(req)) {
    sendJson(res, 403, { ok: false, error: "Forbidden" });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    sendJson(res, err.statusCode || 400, { ok: false, error: err.message });
    return;
  }

  const rawPath = typeof body?.filePath === "string" ? body.filePath.trim() : "";
  const content = typeof body?.content === "string" ? body.content : "";
  if (!rawPath) {
    sendJson(res, 200, { ok: false, needsSaveAs: true, error: "열린 파일 경로가 없습니다." });
    return;
  }

  const resolvedPath = path.resolve(rawPath);
  if (!allowedFilePaths.has(resolvedPath) || !/\.txt$/i.test(resolvedPath)) {
    sendJson(res, 200, { ok: false, needsSaveAs: true, error: "파일 쓰기 세션을 다시 지정해야 합니다." });
    return;
  }

  try {
    await writeFileWithRetry(resolvedPath, content);
    saveLastDirectory(path.dirname(resolvedPath));
    sendJson(res, 200, {
      ok: true,
      filePath: resolvedPath,
      fileName: path.basename(resolvedPath)
    });
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error?.message || "파일 덮어쓰기에 실패했습니다." });
  }
}

function startStaticServer(port) {
  const server = http.createServer(async (req, res) => {
    const method = (req.method || "GET").toUpperCase();
    const rawUrl = (req.url || "/").split("?")[0];

    if (rawUrl === "/__whiteboard_ping" && (method === "GET" || method === "HEAD")) {
      const payload = JSON.stringify({
        app: APP_ID,
        version: SERVER_VERSION,
        capabilities: ["native-win-dialog"],
        root: ROOT_DIR,
        port
      });
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store"
      });
      if (method === "HEAD") {
        res.end();
      } else {
        res.end(payload);
      }
      return;
    }

    if (method === "POST") {
      if (rawUrl === "/__whiteboard_shutdown") {
        if (!isTrustedLocalApiRequest(req)) {
          sendJson(res, 403, { ok: false, error: "Forbidden" });
          return;
        }
        sendJson(res, 200, { ok: true });
        server.close(() => process.exit(0));
        setTimeout(() => process.exit(0), 250).unref();
        return;
      }
      if (rawUrl === "/__whiteboard_api/open") {
        await handleNativeOpenApi(req, res);
        return;
      }
      if (rawUrl === "/__whiteboard_api/save-as") {
        await handleNativeSaveAsApi(req, res);
        return;
      }
      if (rawUrl === "/__whiteboard_api/save-current") {
        await handleNativeSaveCurrentApi(req, res);
        return;
      }
      sendJson(res, 404, { ok: false, error: "Not Found" });
      return;
    }

    if (method !== "GET" && method !== "HEAD") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method Not Allowed");
      return;
    }

    let decodedPath;
    try {
      decodedPath = decodeURIComponent(rawUrl);
    } catch (_err) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad Request");
      return;
    }

    if (decodedPath === "/") {
      decodedPath = "/index.html";
    }

    const relativePath = decodedPath.replace(/^\/+/, "");
    let targetPath = path.resolve(ROOT_DIR, relativePath);

    if (!isPathInsideRoot(targetPath)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    try {
      let stat = await fs.promises.stat(targetPath);
      if (stat.isDirectory()) {
        targetPath = path.join(targetPath, "index.html");
        stat = await fs.promises.stat(targetPath);
      }
      if (!stat.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
      }

      const data = await fs.promises.readFile(targetPath);
      res.writeHead(200, {
        "Content-Type": getMimeType(targetPath),
        "Cache-Control": "no-store"
      });
      if (method === "HEAD") {
        res.end();
      } else {
        res.end(data);
      }
    } catch (_err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
    }
  });

  server.on("error", (err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });

  server.listen(port, HOST);
}

function pingInstance(port, timeoutMs = 350) {
  return new Promise((resolve) => {
    const req = http.get(
      {
        host: HOST,
        port,
        path: "/__whiteboard_ping",
        timeout: timeoutMs
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          resolve(null);
          return;
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (_err) {
            resolve(null);
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
    req.on("error", () => {
      resolve(null);
    });
  });
}

function requestGracefulShutdown(port, timeoutMs = 400) {
  return new Promise((resolve) => {
    const req = http.request(
      {
        host: HOST,
        port,
        path: "/__whiteboard_shutdown",
        method: "POST",
        headers: {
          "X-Whiteboard-Local": "1",
          "Content-Length": 0
        },
        timeout: timeoutMs
      },
      (res) => {
        res.resume();
        resolve(res.statusCode === 200);
      }
    );
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
    req.on("error", () => {
      resolve(false);
    });
    req.end();
  });
}

function findListeningPidOnLoopbackPort(port) {
  try {
    const out = execFileSync("netstat", ["-ano", "-p", "tcp"], {
      encoding: "utf8",
      windowsHide: true
    });
    const pattern = new RegExp(`^\\s*TCP\\s+127\\.0\\.0\\.1:${port}\\s+\\S+\\s+LISTENING\\s+(\\d+)`, "i");
    for (const line of out.split(/\r?\n/)) {
      const match = line.match(pattern);
      if (match) {
        const pid = Number(match[1]);
        if (Number.isInteger(pid) && pid > 0 && pid !== process.pid) {
          return pid;
        }
      }
    }
  } catch (_err) {
    // ignore
  }
  return null;
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once("error", () => resolve(false));
    tester.once("listening", () => {
      tester.close(() => resolve(true));
    });
    tester.listen(port, HOST);
  });
}

async function stopServerOnPort(port) {
  await requestGracefulShutdown(port, 400);
  for (let i = 0; i < 4; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (await isPortAvailable(port)) {
      return true;
    }
  }

  const pid = findListeningPidOnLoopbackPort(port);
  if (pid) {
    try {
      process.kill(pid);
    } catch (_err) {
      // ignore if already exited
    }
    for (let i = 0; i < 10; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (await isPortAvailable(port)) {
        return true;
      }
    }
  }
  return await isPortAvailable(port);
}

function findChromeExecutable() {
  const candidates = [
    process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe")
      : null,
    process.env.PROGRAMFILES
      ? path.join(process.env.PROGRAMFILES, "Google", "Chrome", "Application", "chrome.exe")
      : null,
    process.env["PROGRAMFILES(X86)"]
      ? path.join(process.env["PROGRAMFILES(X86)"], "Google", "Chrome", "Application", "chrome.exe")
      : null
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function openBrowserUrl(targetUrl) {
  const chromeExe = findChromeExecutable();
  if (chromeExe) {
    const child = spawn(chromeExe, [targetUrl], {
      detached: true,
      windowsHide: true,
      stdio: "ignore"
    });
    child.unref();
    return;
  }

  const fallback = spawn("cmd.exe", ["/c", "start", "", targetUrl], {
    detached: true,
    windowsHide: true,
    stdio: "ignore"
  });
  fallback.unref();
}

async function waitForServerReady(port, maxWaitMs = 3000) {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    const ping = await pingInstance(port, 300);
    if (
      ping &&
      ping.app === APP_ID &&
      ping.version === SERVER_VERSION &&
      path.resolve(ping.root || "") === ROOT_DIR
    ) {
      return ping;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

async function ensureServerRunning({ forceRestart = false } = {}) {
  for (let port = PORT_START; port <= PORT_END; port += 1) {
    const info = await pingInstance(port, 350);
    if (info && info.app === APP_ID && path.resolve(info.root || "") === ROOT_DIR) {
      if (!forceRestart && info.version === SERVER_VERSION) {
        return port;
      }
      const stopped = await stopServerOnPort(port);
      if (stopped) {
        const serverChild = spawn(process.execPath, [__filename, "--serve", String(port)], {
          cwd: ROOT_DIR,
          detached: true,
          windowsHide: true,
          stdio: "ignore"
        });
        serverChild.unref();
        const ready = await waitForServerReady(port, 3000);
        if (ready) {
          return port;
        }
      }
    }
  }

  let targetPort = null;
  for (let port = PORT_START; port <= PORT_END; port += 1) {
    if (await isPortAvailable(port)) {
      targetPort = port;
      break;
    }
  }

  if (targetPort === null) {
    console.error("사용 가능한 로컬 포트(5510-5519)를 찾지 못했습니다.");
    process.exit(1);
  }

  const serverChild = spawn(process.execPath, [__filename, "--serve", String(targetPort)], {
    cwd: ROOT_DIR,
    detached: true,
    windowsHide: true,
    stdio: "ignore"
  });
  serverChild.unref();

  const ready = await waitForServerReady(targetPort, 3000);
  if (!ready) {
    console.error(`로컬 서버(127.0.0.1:${targetPort}) 시작에 실패했습니다.`);
    process.exit(1);
  }
  return targetPort;
}

async function main() {
  const args = process.argv.slice(2);
  const serveIndex = args.indexOf("--serve");
  if (serveIndex !== -1) {
    const rawPort = Number(args[serveIndex + 1]);
    const port = Number.isInteger(rawPort) && rawPort > 0 && rawPort <= 65535 ? rawPort : PORT_START;
    startStaticServer(port);
    return;
  }

  if (args.includes("--restart-server")) {
    const port = await ensureServerRunning({ forceRestart: true });
    console.log(`Server v${SERVER_VERSION} ready on http://${HOST}:${port}/`);
    return;
  }

  const port = await ensureServerRunning({ forceRestart: false });
  openBrowserUrl(`http://${HOST}:${port}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
