
require('dotenv').config();
const mailSender = require('./mailSender');

async function test() {
  console.log("Testing email with:");
  console.log("Host:", process.env.MAIL_HOST);
  console.log("Port:", process.env.MAIL_PORT);
  console.log("User:", process.env.MAIL_USER);

  try {
    const result = await mailSender(
      process.env.MAIL_USER, // send to self
      `Test Email ${new Date().toISOString()}`,
      `<h1>This is a test email sent at ${new Date().toISOString()}</h1>`
    );
    console.log("Result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test();
