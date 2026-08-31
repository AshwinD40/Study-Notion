// controllers/ResetPassword.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mailSender = require('../utils/mailSender');
const User = require('../models/User');
const { passwordUpdated } = require('../mail/template/passwordUpdate');

const RESET_TOKEN_EXPIRY_MIN = Number(process.env.RESET_TOKEN_EXPIRY_MIN || 60); // minutes

function makeToken() {
  return crypto.randomBytes(32).toString('hex'); // raw token to email
}
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex'); // stored in DB
}

function sanitizeBaseUrl(value) {
  if (!value || typeof value !== 'string') return '';
  return value.trim().replace(/\/+$/, '');
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
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function deriveFrontendBase(req) {
  const envBase = sanitizeBaseUrl(
    process.env.FRONTEND_URL || process.env.CLIENT_URL || process.env.APP_URL
  );
  const requestOrigin = sanitizeBaseUrl(
    typeof req?.get === 'function' ? req.get('origin') : req?.headers?.origin
  );
  const bodyFrontendUrl = sanitizeBaseUrl(req?.body?.frontendUrl);

  const allowRequestOverride =
    process.env.ALLOW_FRONTEND_URL_OVERRIDE === 'true' ||
    process.env.NODE_ENV !== 'production';

  // For local/dev testing, let request body override the reset URL target.
  if (allowRequestOverride && isValidHttpUrl(bodyFrontendUrl)) {
    return bodyFrontendUrl;
  }

  // In non-production, prefer the caller origin so local frontend gets local links.
  if (process.env.NODE_ENV !== 'production' && isValidHttpUrl(requestOrigin)) {
    return requestOrigin;
  }

  if (isValidHttpUrl(envBase)) return envBase;
  if (isValidHttpUrl(requestOrigin)) return requestOrigin;

  const apiBase = sanitizeBaseUrl(process.env.REACT_APP_BASE_URL);
  if (apiBase) {
    try {
      const parsed = new URL(apiBase);
      return `${parsed.protocol}//${parsed.host}`;
    } catch (_) {
      // ignore parse errors and fall through
    }
  }

  return 'http://localhost:3000';
}

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await findUserByEmailInsensitive(email);

    if (!user) {
      console.warn(`[resetPasswordToken] no user for ${email}`);
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a reset link will be sent.',
      });
    }

    // create token and hashed version for DB
    const rawToken = makeToken();
    const hashed = hashToken(rawToken);
    const expiresAt = Date.now() + RESET_TOKEN_EXPIRY_MIN * 60 * 1000;

    // persist hashed token and expiry
    user.token = hashed;
    user.resetPasswordExpires = new Date(expiresAt);
    await user.save();
    const recipientEmail = normalizeEmail(user.email) || email;

    // prepare reset link
    const frontendBase = deriveFrontendBase(req);
    const resetLink = `${frontendBase}/update-password/${rawToken}`;

    const userName = user.firstName
      ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
      : 'there';

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
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .cta-button {
                display: inline-block;
                padding: 14px 32px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
            }
            .link-fallback {
                word-break: break-all;
                background: #f2f2f2;
                padding: 12px;
                border-radius: 6px;
                font-size: 13px;
                color: #555;
                margin: 16px 0;
            }
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="https://study-notion-ashwin40.vercel.app/">
              <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
            </a>
            <div class="message">Reset Your Password</div>
            <div class="body">
                <p>Hey ${userName},</p>
                <p>We received a request to reset the password for your StudyNotion account associated with <strong>${recipientEmail}</strong>.</p>
                <p>Click the button below to set a new password:</p>
                <a href="${resetLink}" class="cta-button">Reset Password</a>
                <p style="font-size:14px;color:#666;">This link will expire in ${RESET_TOKEN_EXPIRY_MIN} minutes.</p>
                <div class="link-fallback">
                    If the button doesn't work, copy and paste this link into your browser:<br/>
                    ${resetLink}
                </div>
                <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
            </div>
            <div class="support">
                If you have any questions, reach out to us at
                <a href="mailto:ashwinkumarchaudhary950@gmail.com">ashwinkumarchaudhary950@gmail.com</a>. We're here to help!
            </div>
        </div>
    </body>
    </html>`;

    const mailResult = await mailSender(
      recipientEmail,
      'StudyNotion — Reset Your Password',
      html
    );

    const allowDebugResetLink =
      process.env.NODE_ENV !== "production" ||
      process.env.RESET_DEBUG_RESPONSE === "true";

    if (!mailResult?.success) {
      console.error(
        `[resetPasswordToken] mail failed for ${recipientEmail}`,
        mailResult?.error?.message || mailResult
      );
      if (allowDebugResetLink) {
        return res.status(200).json({
          success: true,
          message: 'Email service unavailable. Use debug reset link.',
          debugResetLink: resetLink,
          debugToken: rawToken,
        });
      }
      return res.status(500).json({ success: false, message: 'Failed to send reset email' });
    }

    console.log(`[resetPasswordToken] mail sent to ${recipientEmail} id=${mailResult.info?.messageId}`);
    return res.status(200).json({
      success: true,
      message: 'Reset email sent successfully.',
    });

  } catch (err) {
    console.error('[resetPasswordToken] error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token: rawToken } = req.body;
    const token = String(rawToken || "").trim();

    if (!password || !confirmPassword || !token) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and confirm password do not match' });
    }

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({ success: false, message: 'Invalid reset token format' });
    }

    const hashed = hashToken(token);
    const user = await User.findOne({ token: hashed });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    if (!user.resetPasswordExpires || new Date(user.resetPasswordExpires).getTime() < Date.now()) {
      return res.status(403).json({ success: false, message: 'Token expired. Please request a new reset.' });
    }

    // hash the new password and update user; ensure model doesn't double-hash
    const encryptedPassword = await bcrypt.hash(password, 10);
    user.password = encryptedPassword;
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Send confirmation email so user knows their password was changed
    try {
      const userName = user.firstName
        ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
        : 'User';
      const confirmHtml = passwordUpdated(
        user.email,
        `Hello ${userName},<br><br>Your password has been successfully reset via the forgot-password flow. If you did not perform this action, please contact support immediately.<br><br>Regards,<br>Team StudyNotion`
      );
      const confirmResult = await mailSender(
        user.email,
        'StudyNotion — Your Password Has Been Reset',
        confirmHtml
      );
      if (!confirmResult?.success) {
        console.error('[resetPassword] confirmation email failed:', confirmResult?.error?.message);
      } else {
        console.log('[resetPassword] confirmation email sent to', user.email);
      }
    } catch (emailErr) {
      // Don't fail the reset just because confirmation email failed
      console.error('[resetPassword] confirmation email error:', emailErr.message);
    }

    return res.status(200).json({ success: true, message: 'Password reset successfully.' });

  } catch (err) {
    console.error('[resetPassword] error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
