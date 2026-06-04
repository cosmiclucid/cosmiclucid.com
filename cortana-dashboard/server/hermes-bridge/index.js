const express = require("express");
const { execFile } = require("child_process");

const HOST = "127.0.0.1";
const PORT = Number.parseInt(process.env.HERMES_BRIDGE_PORT || "8001", 10);
const HERMES_COMMAND_PATH = process.env.HERMES_COMMAND_PATH || "hermes";
const MAX_MESSAGE_LENGTH = 2_000;
const HERMES_TIMEOUT_MS = 45_000;

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));

app.use((request, _response, next) => {
  const startedAt = Date.now();

  _response.on("finish", () => {
    const duration = Date.now() - startedAt;
    console.info(
      JSON.stringify({
        at: new Date().toISOString(),
        method: request.method,
        path: request.path,
        statusCode: _response.statusCode,
        remoteAddress: request.socket.remoteAddress,
        durationMs: duration,
      }),
    );
  });

  next();
});

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "hermes-bridge" });
});

app.post("/chat", async (request, response) => {
  const message = extractMessage(request.body);

  if (!message) {
    return response.status(400).json({ reply: "Message is required." });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return response.status(413).json({
      reply: `Message is too long. Keep it under ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  try {
    const reply = await runHermes(message);
    return response.json({ reply });
  } catch (error) {
    const status = error.code === "ETIMEDOUT" ? 504 : 502;
    const reason = status === 504 ? "Hermes timed out." : "Hermes command failed.";

    console.error(
      JSON.stringify({
        at: new Date().toISOString(),
        error: reason,
        details: error.message,
      }),
    );

    return response.status(status).json({ reply: reason });
  }
});

app.use((error, _request, response, _next) => {
  console.error(
    JSON.stringify({
      at: new Date().toISOString(),
      error: "Bridge request failed.",
      details: error.message,
    }),
  );
  response.status(400).json({ reply: "Invalid bridge request." });
});

app.listen(PORT, HOST, () => {
  console.info(
    JSON.stringify({
      at: new Date().toISOString(),
      service: "hermes-bridge",
      url: `http://${HOST}:${PORT}`,
      hermesCommandPath: HERMES_COMMAND_PATH,
    }),
  );
});

function extractMessage(body) {
  if (!body || typeof body !== "object" || typeof body.message !== "string") {
    return null;
  }

  return body.message.trim();
}

function runHermes(message) {
  return new Promise((resolve, reject) => {
    const child = execFile(
      HERMES_COMMAND_PATH,
      ["-z", message],
      {
        timeout: HERMES_TIMEOUT_MS,
        maxBuffer: 1024 * 1024,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error) {
          error.message = stderr?.trim() || error.message;
          reject(error);
          return;
        }

        const reply = stdout.trim();

        if (!reply) {
          reject(new Error(stderr?.trim() || "Hermes returned an empty response."));
          return;
        }

        resolve(reply);
      },
    );

    child.stdin?.end();
  });
}

// TODO: Add streaming support when Hermes exposes incremental output.
// TODO: Add websocket mode for live dashboard sessions.
// TODO: Add memory sync events after Hermes memory storage is finalized.
// TODO: Add voice support for ElevenLabs/Hermes audio handoff.
