/**
 * Delivery Partner Approval Email Template
 */
function getApprovedEmailTemplate({ name, email, partnerId, password, verificationToken }) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationLink = `${frontendUrl}/partner/verify-email?token=${verificationToken}`;
  const loginLink = `${frontendUrl}/partner/login`;

  return {
    subject: "Welcome to Our Delivery Partner Network! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .credentials { 
            background: white; 
            padding: 20px; 
            border-left: 4px solid #667eea; 
            margin: 20px 0; 
            border-radius: 5px;
          }
          .credentials h3 {
            margin-top: 0;
            color: #667eea;
          }
          .credentials code {
            background: #f0f0f0; 
            padding: 5px 10px; 
            border-radius: 3px;
            font-size: 14px;
            font-family: 'Courier New', monospace;
          }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background: #667eea; 
            color: white !important; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 5px;
            font-weight: bold;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .warning { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 5px;
          }
          .steps {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .steps h3 {
            color: #667eea;
            margin-top: 0;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #666; 
            font-size: 12px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome Aboard!</h1>
            <p>Your Delivery Partner Application Has Been Approved</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            
            <p>Congratulations! Your application to join our delivery partner network has been <strong>approved</strong>!</p>
            
            <div class="credentials">
              <h3>Your Account Details:</h3>
              <p><strong>Partner ID:</strong> ${partnerId}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> <code>${password}</code></p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> Please verify your email address first before logging in. After verification, change your password for security.
            </div>
            
            <div class="button-container">
              <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            
            <div class="steps">
              <h3>Next Steps:</h3>
              <ol>
                <li>Click the "Verify Email Address" button above</li>
                <li>After verification, login to your partner dashboard at: <a href="${loginLink}">${loginLink}</a></li>
                <li>Change your temporary password</li>
                <li>Complete your profile setup</li>
                <li>Start accepting delivery requests!</li>
              </ol>
            </div>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>The Delivery Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

module.exports = { getApprovedEmailTemplate };
