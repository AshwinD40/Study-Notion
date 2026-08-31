const { contactUsEmail } = require("../mail/template/contactFormRes");
const mailSender = require("../utils/mailSender");

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

exports.contactUsController = async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const firstname = String(req.body?.firstname || "").trim();
    const lastname = String(req.body?.lastname || "").trim();
    const message = String(req.body?.message || "").trim();
    const phoneNo = String(req.body?.phoneNo || "").trim();
    const countrycode = String(req.body?.countrycode || "").trim();

    if (!email || !firstname || !message || !phoneNo || !countrycode) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    const userMail = await mailSender(
      email,
      "We received your message",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    if (!userMail.success) {
      console.error("[contactUs] acknowledgment email failed:", userMail.error);
      return res.status(502).json({
        success: false,
        message: "Failed to send confirmation email",
      });
    }

    // Optional internal copy to support inbox (defaults to configured sender account).
    const supportInbox = String(
      process.env.CONTACT_US_RECEIVER_EMAIL || process.env.MAIL_USER || ""
    )
      .trim()
      .toLowerCase();

    if (supportInbox && supportInbox !== email) {
      const safeName = `${escapeHtml(firstname)} ${escapeHtml(lastname)}`.trim();
      const adminHtml = `
        <h2>New Contact Us Submission</h2>
        <p><strong>Name:</strong> ${safeName || "N/A"}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(countrycode)} ${escapeHtml(
        phoneNo
      )}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
      `;

      const supportMail = await mailSender(
        supportInbox,
        `New contact request from ${firstname}${lastname ? ` ${lastname}` : ""}`,
        adminHtml
      );

      if (!supportMail.success) {
        console.warn("[contactUs] support copy failed:", supportMail.error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("[contactUs] error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message",
    });
  }
};
