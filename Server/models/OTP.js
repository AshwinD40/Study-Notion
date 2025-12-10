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
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	if (this.isNew) {
		try {
			await sendVerificationEmail(this.email, this.otp);
			next();
		} catch (err) {
			next(err); // this will stop the save and forward the error
		}
	} else {
		next();
	}
});


const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
