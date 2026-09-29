// controllers/ResetPassword.js
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mailSender = require("../utils/mailSender");
const User = require("../models/User");
const { passwordUpdated } = require("../mail/template/passwordUpdate");

// Short token expiry for security (15 minutes default)
const RESET_TOKEN_EXPIRY_MIN = Number(process.env.RESET_TOKEN_EXPIRY_MIN || 15);

function makeToken() {
  return crypto.randomBytes(32).toString("hex"); // 64-char hex raw token sent only via email
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex"); // SHA-256 stored in DB
}

function sanitizeBaseUrl(value) {
  if (!value || typeof value !== "string") return "";
  return value.trim().replace(/\/+$/, "");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findUserByEmailInsensitive(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  let user = await User.findOne({ email: normalized });
  if (user) return user;

  return User.findOne({
    email: { $regex: `^${escapeRegex(normalized)}$`, $options: "i" },
  });
}

function isValidHttpUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function deriveFrontendBase(req) {
  const envBase = sanitizeBaseUrl(
    process.env.FRONTEND_URL || process.env.CLIENT_URL || process.env.APP_URL
  );
  const requestOrigin = sanitizeBaseUrl(
    typeof req?.get === "function" ? req.get("origin") : req?.headers?.origin
  );

  if (isValidHttpUrl(envBase)) return envBase;
  if (isValidHttpUrl(requestOrigin)) return requestOrigin;

  return "http://localhost:3000";
}

// 1. Request Password Reset Token (Out-of-band email delivery only)
exports.resetPasswordToken = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const user = await findUserByEmailInsensitive(email);

    // Prevent account enumeration: return identical generic message if user doesn't exist
    if (!user) {
      console.warn(`[resetPasswordToken] Non-existent email requested: ${email}`);
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, password reset instructions have been sent.",
      });
    }

    // Generate cryptographically secure token & SHA-256 hash for database
    const rawToken = makeToken();
    const hashed = hashToken(rawToken);
    const expiresAt = Date.now() + RESET_TOKEN_EXPIRY_MIN * 60 * 1000;

    user.token = hashed;
    user.resetPasswordExpires = new Date(expiresAt);
    await user.save();

    const recipientEmail = normalizeEmail(user.email) || email;
    const frontendBase = deriveFrontendBase(req);
    const resetLink = `${frontendBase}/update-password/${rawToken}`;

    const userName = user.firstName
      ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
      : "there";

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Reset Your Password</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 24px;
                text-align: center;
            }
            .logo {
                max-width: 180px;
                margin-bottom: 24px;
            }
            .message {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 16px;
                color: #000814;
            }
            .body {
                font-size: 15px;
                margin-bottom: 24px;
                color: #424854;
                text-align: left;
            }
            .cta-container {
                text-align: center;
                margin: 28px 0;
            }
            .cta-button {
                display: inline-block;
                padding: 12px 28px;
                background-color: #FFD60A;
                color: #000814;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                font-size: 15px;
            }
            .link-fallback {
                word-break: break-all;
                background: #f4f4f5;
                padding: 12px;
                border-radius: 6px;
                font-size: 12px;
                color: #666;
                margin-top: 16px;
            }
            .support {
                font-size: 13px;
                color: #888888;
                margin-top: 32px;
                border-top: 1px solid #eeeeee;
                padding-top: 16px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 style="color: #000814; margin-top: 0;">StudyNotion</h2>
            <div class="message">Password Reset Request</div>
            <div class="body">
                <p>Hello ${userName},</p>
                <p>We received a request to reset the password for your StudyNotion account (<strong>${recipientEmail}</strong>).</p>
                <p>To choose a new password, click the button below. This link is single-use and will expire in <strong>${RESET_TOKEN_EXPIRY_MIN} minutes</strong>.</p>
                <div class="cta-container">
                    <a href="${resetLink}" class="cta-button">Reset My Password</a>
                </div>
                <div class="link-fallback">
                    If the button above does not work, copy and paste this link into your browser:<br/>
                    <a href="${resetLink}" style="color: #118AB2;">${resetLink}</a>
                </div>
                <p style="margin-top: 20px; font-size: 13px; color: #777;">
                    If you did not request this password reset, please ignore this email or contact support if you suspect unauthorized access. Your password remains unchanged.
                </p>
            </div>
            <div class="support">
                StudyNotion Security Team
            </div>
        </div>
    </body>
    </html>`;

    const mailResult = await mailSender(
      recipientEmail,
      "StudyNotion — Password Reset Request",
      html
    );

    if (!mailResult?.success) {
      console.error(
        `[resetPasswordToken] Mail delivery failed for ${recipientEmail}:`,
        mailResult?.error?.message || mailResult
      );
      // Strictly fail-secure: NEVER return tokens or links to the client
      return res.status(500).json({
        success: false,
        message:
          "Unable to send password reset email at this moment. Please check your email configuration or try again shortly.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, password reset instructions have been sent.",
    });
  } catch (err) {
    console.error("[resetPasswordToken] error:", err);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// 2. Pre-verify Reset Token Validity before rendering reset form
exports.verifyResetToken = async (req, res) => {
  try {
    const rawToken = req.body?.token || req.query?.token || req.params?.token;
    const token = String(rawToken || "").trim();

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token format.",
      });
    }

    const hashed = hashToken(token);
    const user = await User.findOne({ token: hashed });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "This password reset link is invalid or has already been used.",
      });
    }

    if (
      !user.resetPasswordExpires ||
      new Date(user.resetPasswordExpires).getTime() < Date.now()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This password reset link has expired. Please request a new one.",
      });
    }

    // Mask email for user display reassurance (e.g. a***n@gmail.com)
    const emailParts = user.email.split("@");
    const maskedEmail =
      emailParts[0].length > 2
        ? `${emailParts[0][0]}***${emailParts[0].slice(-1)}@${emailParts[1]}`
        : `***@${emailParts[1]}`;

    return res.status(200).json({
      success: true,
      message: "Token is valid.",
      email: maskedEmail,
    });
  } catch (error) {
    console.error("[verifyResetToken] error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying token.",
    });
  }
};

// 3. Reset Password (Atomic token verification, password update, and single-use invalidation)
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token: rawToken } = req.body;
    const token = String(rawToken || "").trim();

    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long.",
      });
    }

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token format.",
      });
    }

    const hashed = hashToken(token);
    const user = await User.findOne({ token: hashed });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "This password reset link is invalid or has already been used.",
      });
    }

    if (
      !user.resetPasswordExpires ||
      new Date(user.resetPasswordExpires).getTime() < Date.now()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This password reset link has expired. Please request a new one.",
      });
    }

    // Check if new password is identical to the current password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password cannot be identical to your current password. Please choose a different password.",
      });
    }

    // Hash new password with 10 salt rounds
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Atomically update password and invalidate the reset token immediately
    user.password = encryptedPassword;
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation security notification email
    try {
      const userName = user.firstName
        ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
        : "Student";
      const confirmHtml = passwordUpdated(
        user.email,
        `Hello ${userName},<br><br>Your StudyNotion account password has been successfully reset. If you did not perform this action, please contact our security team immediately at support@studynotion.com.<br><br>Regards,<br>Team StudyNotion`
      );
      mailSender(
        user.email,
        "StudyNotion — Your Password Has Been Reset",
        confirmHtml
      ).catch((err) =>
        console.warn("[resetPassword] confirmation email notice:", err.message)
      );
    } catch (emailErr) {
      console.warn("[resetPassword] confirmation email warning:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (err) {
    console.error("[resetPassword] error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password. Please try again.",
    });
  }
};
