exports.contactUsEmail = (email, name, message) => {
  return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Contact Form Confirmation</title>
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
              text-align: left;
          }
          .logo {
              max-width: 180px;
              margin-bottom: 24px;
              display: block;
          }
          .title {
              font-size: 20px;
              font-weight: bold;
              color: #111827;
              margin-bottom: 16px;
          }
          .body {
              font-size: 15px;
              color: #374151;
              line-height: 1.6;
          }
          .details-box {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
              margin: 20px 0;
          }
          .details-row {
              margin-bottom: 8px;
          }
          .details-row:last-child {
              margin-bottom: 0;
          }
          .details-label {
              font-weight: 600;
              color: #4b5563;
          }
          .support {
              font-size: 13px;
              color: #9ca3af;
              margin-top: 24px;
              border-top: 1px solid #f3f4f6;
              padding-top: 16px;
          }
          .support a {
              color: #0284c7;
              text-decoration: none;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <a href="https://studynotion-ashwin.vercel.app/">
              <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo">
          </a>
          <div class="title">We received your message</div>
          <div class="body">
              <p>Hi ${name},</p>
              <p>Thank you for reaching out to StudyNotion. Our team has received your message and will get back to you shortly.</p>
              
              <div class="details-box">
                  <div class="details-row"><span class="details-label">Name:</span> ${name}</div>
                  <div class="details-row"><span class="details-label">Email:</span> ${email}</div>
                  <div class="details-row"><span class="details-label">Message:</span> ${message}</div>
              </div>
          </div>
          <div class="support">
              If you need immediate assistance, please feel free to email us at 
              <a href="mailto:ashwinkumarchaudhary950@gmail.com">ashwinkumarchaudhary950@gmail.com</a>.
          </div>
      </div>
  </body>
  </html>`;
};