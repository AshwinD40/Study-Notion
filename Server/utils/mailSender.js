// utils/mailSender.js
const nodemailer = require("nodemailer");

const host = process.env.MAIL_HOST || "smtp.gmail.com";
const port = Number(process.env.MAIL_PORT || 587);
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

if (!user || !pass) {
  console.error("[mailSender] MAIL_USER / MAIL_PASS missing");
}

console.log(`[mailSender] Config - Host: ${host}, Port: ${port}, User: ${user}`);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // True for 465, false for 587
  auth: { user, pass },
  logger: false,
  debug: false,
});

// verify on startup (optional)
transporter.verify((err, success) => {
  if (err) {
    console.error("[mailSender] verify error:", err.message);
  } else {
    console.log("[mailSender] transporter verified");
  }
});

async function mailSender(to, subject, html) {
  try {
    console.log(`[mailSender] Attempting to send email to: ${to}`);
    const info = await transporter.sendMail({
      from: `"StudyNotion" <${user}>`, // must match MAIL_USER domain
      to,
      subject,
      html,
    });

    console.log(`[mailSender] Email sent successfully. MessageId: ${info.messageId}`);
    return {
      success: true,
      info,
    };
  } catch (err) {
    console.error("[mailSender] send error:", err);
    return {
      success: false,
      error: {
        message: err.message,
        code: err.code || null,
        response: err.response,
      },
    };
  }
}

module.exports = mailSender;
