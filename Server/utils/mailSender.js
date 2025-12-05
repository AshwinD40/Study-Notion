// utils/mailSender.js
const nodemailer = require('nodemailer');

const host = process.env.MAIL_HOST;
const port = Number(process.env.MAIL_PORT || 587);
const secure = process.env.MAIL_SECURE === 'true' || port === 465;
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

if (!host || !user || !pass) {
  console.warn('Mail config incomplete: MAIL_HOST/MAIL_USER/MAIL_PASS required');
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 5000, // 5s to establish TCP
  greetingTimeout: 5000,   // 5s for SMTP greeting
  socketTimeout: 10000,    // overall socket timeout per email
  tls: { rejectUnauthorized: process.env.NODE_ENV === 'production' },
  logger: false,
  debug: false
});

// verify once on startup
(async () => {
  try {
    await transporter.verify();
    console.log('[mailSender] transporter verified');
  } catch (err) {
    console.warn('[mailSender] verify failed at startup:', err && err.message);
  }
})();

async function mailSender(to, subject, html) {
  try {
    // Send, but also guard against extremely slow send using Promise.race
    const sendPromise = transporter.sendMail({
      from: `"StudyNotion" <${user}>`,
      to,
      subject,
      html,
    });

    // safety timeout (ms) for sendMail itself (in case provider stalls)
    const SAFETY_MS = 10000; // 10s
    const result = await Promise.race([
      sendPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('MAIL_SEND_TIMEOUT')), SAFETY_MS))
    ]);

    return { success: true, info: result };
  } catch (err) {
    console.error('[mailSender] send error:', err && (err.stack || err.message));
    const normalized = {
      message: err?.message || 'Unknown mail error',
      code: err?.code || null,
      detail: err?.response ? (err.response.data || err.response) : undefined
    };
    return { success: false, error: normalized };
  }
}

module.exports = mailSender;
