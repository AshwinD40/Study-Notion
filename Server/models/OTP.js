const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/template/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	used: {
		type: Boolean,
		default: false,
	},
	expiresAt: {
		type: Date,
		default: () => new Date(Date.now() + 5 * 60 * 1000),
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		console.log("OTP Model: Sending verification email to", email);
		const mailResponse = await mailSender(
			email,
			`Verification Email ${Date.now()}`,
			emailTemplate(otp)
		);
		console.log("OTP Model: Mail response received", mailResponse);
		if (!mailResponse.success) {
			throw new Error(mailResponse.error ? mailResponse.error.message : "Email sending failed");
		}
		console.log("Email sent successfully:", mailResponse.info?.messageId || "ok");
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Send verification mail after save so OTP creation never blocks on SMTP latency.
OTPSchema.post("save", function (doc) {
	if (!doc?.email || !doc?.otp) {
		return;
	}

	void sendVerificationEmail(doc.email, doc.otp).catch((err) => {
		console.error("OTP email dispatch failed:", err?.message || err);
	});
});


const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
