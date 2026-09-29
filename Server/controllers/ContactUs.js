const { contactUsEmail } = require("../mail/template/contactFormRes");
const mailSender = require("../utils/mailSender");
const Contact = require("../models/Contact");

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
    const rawName = req.body.name || `${req.body.firstname || ""} ${req.body.lastname || ""}`;
    const name = String(rawName).trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const message = String(req.body?.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields (name, email, and message)",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // 1. Persist the message in MongoDB so no inquiry is ever lost
    const savedContact = await Contact.create({
      name,
      email,
      message,
    });

    // 2. Send acknowledgment email to the submitter
    let userEmailSent = false;
    try {
      const userMail = await mailSender(
        email,
        "We received your message - StudyNotion",
        contactUsEmail(email, name, message)
      );
      userEmailSent = !!userMail?.success;
      if (!userEmailSent) {
        console.warn("[contactUs] User acknowledgment email failed:", userMail?.error?.message || userMail);
      }
    } catch (err) {
      console.warn("[contactUs] User acknowledgment mail error:", err.message);
    }

    // 3. Send notification to admin / support inbox
    const supportInbox = String(
      process.env.CONTACT_US_RECEIVER_EMAIL || process.env.MAIL_USER || ""
    )
      .trim()
      .toLowerCase();

    let adminEmailSent = false;
    if (supportInbox) {
      try {
        const safeName = escapeHtml(name);
        const adminHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
            <h2 style="color: #FFD60A; background: #000814; padding: 12px 16px; border-radius: 6px; margin-top: 0;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
            <p><strong>Message:</strong></p>
            <div style="background: #f4f4f5; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${escapeHtml(message)}</div>
            <p style="font-size: 11px; color: #888; margin-top: 20px;">StudyNotion Platform Notification</p>
          </div>
        `;

        const supportMail = await mailSender(
          supportInbox,
          `New Contact Inquiry from ${name}`,
          adminHtml
        );
        adminEmailSent = !!supportMail?.success;
        if (!adminEmailSent) {
          console.warn("[contactUs] Admin notification email failed:", supportMail?.error?.message || supportMail);
        }
      } catch (err) {
        console.warn("[contactUs] Admin notification mail error:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully! Our team will contact you soon.",
      data: {
        id: savedContact._id,
        userEmailSent,
        adminEmailSent,
      },
    });
  } catch (error) {
    console.error("[contactUs] Error handling contact form:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending your message. Please try again.",
    });
  }
};
