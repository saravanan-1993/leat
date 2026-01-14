/**
 * Delivery Partner Rejection Email Template
 */
function getRejectedEmailTemplate({ name, email, reason, note }) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const supportEmail = process.env.SUPPORT_EMAIL || "support@example.com";
  const reapplyLink = `${frontendUrl}/partner/apply`;

  return {
    subject: "Delivery Partner Application Status Update",
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
            background: #dc3545; 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .content { 
            background: #f9f9f9; 
            padding: 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .reason-box { 
            background: white; 
            padding: 20px; 
            border-left: 4px solid #dc3545; 
            margin: 20px 0; 
            border-radius: 5px;
          }
          .reason-box h3 {
            margin-top: 0;
            color: #dc3545;
          }
          .info-box {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background: #2196F3; 
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
          .contact-info {
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
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
            <h1>Application Status Update</h1>
          </div>
          
          <div class="content">
            <p>Dear <strong>${name}</strong>,</p>
            
            <p>Thank you for your interest in joining our delivery partner network.</p>
            
            <p>After careful review, we are unable to approve your application at this time.</p>
            
            <div class="reason-box">
              <h3>Reason for Rejection:</h3>
              <p><strong>${reason}</strong></p>
              ${note ? `<p style="margin-top: 15px; color: #666;">${note}</p>` : ''}
            </div>
            
            <div class="info-box">
              <strong>📋 What This Means:</strong>
              <p style="margin: 10px 0 0 0;">We encourage you to address the concerns mentioned above and reapply in the future.</p>
            </div>
            
            <div class="contact-info">
              <h3>Need More Information?</h3>
              <p>If you have questions, please contact our support team:</p>
              <p><strong>Email:</strong> ${supportEmail}</p>
            </div>
            
            <div class="button-container">
              <a href="${reapplyLink}" class="button">Reapply in the Future</a>
            </div>
            
            <p>Thank you for your understanding.</p>
            
            <p>Best regards,<br>
            <strong>The Delivery Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>For inquiries, please contact ${supportEmail}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

module.exports = { getRejectedEmailTemplate };
