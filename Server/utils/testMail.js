// Run from Server folder: node utils/testMail.js
require('dotenv').config();
const mailSender = require('./mailSender');

async function test() {
  console.log("\n=== Email Configuration ===");
  console.log("Host:", process.env.MAIL_HOST);
  console.log("Port:", process.env.MAIL_PORT);
  console.log("User:", process.env.MAIL_USER);
  
  const pass = process.env.MAIL_PASS || "";
  const cleanPass = pass.trim().replace(/\s+/g, "");
  console.log("Pass length (raw):", pass.length);
  console.log("Pass length (cleaned):", cleanPass.length, "(should be 16 for Gmail App Password)");
  console.log("");

  if (cleanPass.length !== 16) {
    console.warn("⚠️  WARNING: Gmail App Passwords are exactly 16 characters!");
    console.warn("   Your password has", cleanPass.length, "characters.");
    console.warn("");
  }

  console.log("=== Sending Test Email ===");
  try {
    const result = await mailSender(
      process.env.MAIL_USER, // send to self
      `Test Email ${new Date().toISOString()}`,
      `<h1>Test Email</h1><p>Sent at ${new Date().toISOString()}</p><p>If you see this, email is working!</p>`
    );
    
    console.log("\n=== Result ===");
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log("\n✅ EMAIL SENT SUCCESSFULLY!");
      console.log("Check your inbox at:", process.env.MAIL_USER);
    } else {
      console.log("\n❌ EMAIL FAILED!");
      console.log("Error:", result.error?.message || "Unknown error");
      
      if (result.error?.code === 'EAUTH') {
        console.log("\n=== AUTHENTICATION ERROR ===");
        console.log("This usually means your Gmail App Password is incorrect.");
        console.log("\nTo fix:");
        console.log("1. Go to https://myaccount.google.com/security");
        console.log("2. Enable 2-Step Verification if not enabled");
        console.log("3. Go to https://myaccount.google.com/apppasswords");
        console.log("4. Generate a new App Password for 'Mail'");
        console.log("5. Copy the 16-character password (NO SPACES) to MAIL_PASS in .env");
      }
    }
  } catch (error) {
    console.error("\n❌ Test threw exception:", error);
  }
}

test();
