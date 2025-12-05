// controllers/ResetPassword.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mailSender = require('../utils/mailSender');
const User = require('../models/User');

const RESET_TOKEN_EXPIRY_MIN = Number(process.env.RESET_TOKEN_EXPIRY_MIN || 60); // minutes

function makeToken() {
  return crypto.randomBytes(32).toString('hex'); // raw token to email
}
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex'); // stored in DB
}

exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const user = await User.findOne({ email });

    // Always respond the same to avoid account enumeration
    res.status(202).json({ success: true, message: 'If that email exists, a reset link will be sent.' });

    if (!user) {
      console.warn(`[resetPasswordToken] no user for ${email}`);
      return; // don't proceed further
    }

    // create token and hashed version for DB
    const rawToken = makeToken();
    const hashed = hashToken(rawToken);
    const expiresAt = Date.now() + RESET_TOKEN_EXPIRY_MIN * 60 * 1000;

    // persist hashed token and expiry
    user.token = hashed;
    user.resetPasswordExpires = new Date(expiresAt);
    await user.save();

    // prepare reset link (frontend reads token from query)
    const frontendBase = process.env.FRONTEND_URL || 'https://your-frontend.example';
    const resetLink = `${frontendBase}/update-password/${rawToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width:600px; margin:auto;">
        <h2 style="color:#2e6c80">Reset Your Password</h2>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <div style="text-align:center;margin:20px 0;">
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background-color:#007BFF;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy & paste this link into your browser:</p>
        <p style="word-break:break-all;background:#f2f2f2;padding:10px;border-radius:4px;">${resetLink}</p>
        <p>If you did not request this, ignore this email.</p>
        <br/><p>Thanks,<br/>Support Team</p>
      </div>
    `;

    // send email in background so we don't block the response
    setImmediate(async () => {
      try {
        const mailResult = await mailSender(email, 'Reset Your Password - Action Required', html);
        if (mailResult && mailResult.success) {
          console.log(`[resetPasswordToken] mail sent to ${email} id=${mailResult.info?.messageId}`);
        } else {
          console.error(`[resetPasswordToken] mail failed for ${email}`, mailResult && mailResult.error ? mailResult.error.message : mailResult);
          // TODO: optionally persist failed send to DB/queue for retry
        }
      } catch (err) {
        console.error('[resetPasswordToken] unexpected error sending mail:', err);
      }
    });

  } catch (err) {
    console.error('[resetPasswordToken] error:', err);
    // If we already responded, nothing to do; otherwise respond 500:
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and confirm password do not match' });
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

    return res.status(200).json({ success: true, message: 'Password reset successfully.' });

  } catch (err) {
    console.error('[resetPassword] error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
