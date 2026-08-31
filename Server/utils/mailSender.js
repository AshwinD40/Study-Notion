const nodemailer = require("nodemailer");

const host = (process.env.MAIL_HOST || "smtp.gmail.com").trim();
const port = Number(process.env.MAIL_PORT || 587);
const user = (process.env.MAIL_USER || "").trim();
const rawPass = process.env.MAIL_PASS || "";
const enableMailLogs = process.env.MAIL_DEBUG === "true";
const verifyTimeoutMs = Number(process.env.MAIL_VERIFY_TIMEOUT_MS || 12000);
const sendTimeoutMs = Number(process.env.MAIL_SEND_TIMEOUT_MS || 15000);
const connectionTimeoutMs = Number(
  process.env.MAIL_CONNECTION_TIMEOUT_MS || 10000
);
const greetingTimeoutMs = Number(process.env.MAIL_GREETING_TIMEOUT_MS || 10000);
const socketTimeoutMs = Number(process.env.MAIL_SOCKET_TIMEOUT_MS || 15000);

function normalizeMailPassword(password, smtpHost) {
  const trimmed = password.trim();
  if (!trimmed) return trimmed;

  // Gmail app-passwords are often copied in 4-char groups separated by spaces.
  if (/gmail|googlemail/i.test(smtpHost)) {
    return trimmed.replace(/\s+/g, "");
  }
  return trimmed;
}

const pass = normalizeMailPassword(rawPass, host);

function withTimeout(promise, timeoutMs, operation) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const timeoutError = new Error(
        `${operation} timed out after ${timeoutMs}ms`
      );
      timeoutError.code = "ETIMEDOUT";
      reject(timeoutError);
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

// Debug logging for email config (remove in production)
console.log("[mailSender] Config:", {
  host,
  port,
  user,
  passLength: pass ? pass.length : 0,
  passConfigured: !!pass,
});

if (!user || !pass) {
  console.error("[mailSender] MAIL_USER / MAIL_PASS missing");
}
if (rawPass && rawPass !== pass) {
  console.warn("[mailSender] MAIL_PASS had whitespace; normalized for SMTP auth.");
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: user && pass ? { user, pass } : undefined,
  pool: true,
  maxConnections: Number(process.env.MAIL_MAX_CONNECTIONS || 3),
  maxMessages: 100,
  logger: enableMailLogs,
  debug: enableMailLogs,
  connectionTimeout: connectionTimeoutMs,
  greetingTimeout: greetingTimeoutMs,
  socketTimeout: socketTimeoutMs,
});

let verifyPromise = null;
function verifyTransporterOnce() {
  if (!verifyPromise) {
    verifyPromise = withTimeout(
      transporter.verify(),
      verifyTimeoutMs,
      "SMTP verify"
    )
      .then(() => true)
      .catch((error) => {
        console.error("[mailSender] verify error:", error.message);
        return { ok: false, error };
      });
  }
  return verifyPromise;
}

async function mailSender(to, subject, html) {
  if (!to || !subject || !html) {
    return {
      success: false,
      error: { message: "Missing required email payload", code: "EINVAL" },
    };
  }

  if (!user || !pass) {
    return {
      success: false,
      error: {
        message: "MAIL_USER / MAIL_PASS is not configured",
        code: "ECONFIG",
      },
    };
  }

  try {
    const verifyState = await verifyTransporterOnce();
    if (verifyState !== true) {
      // Clear failed cache so the next request can retry verify.
      verifyPromise = null;
      return {
        success: false,
        error: {
          message:
            verifyState?.error?.message || "SMTP transporter verification failed",
          code: verifyState?.error?.code || "EAUTH",
          response: verifyState?.error?.response || null,
        },
      };
    }

    const info = await withTimeout(
      transporter.sendMail({
        from: `"StudyNotion" <${user}>`,
        to,
        subject,
        html,
      }),
      sendTimeoutMs,
      "SMTP sendMail"
    );

    return {
      success: true,
      info,
    };
  } catch (err) {
    console.error("[mailSender] send error:", err);
    verifyPromise = null;
    return {
      success: false,
      error: {
        message: err.message,
        code: err.code || null,
        response: err.response || null,
      },
    };
  }
}

module.exports = mailSender;
