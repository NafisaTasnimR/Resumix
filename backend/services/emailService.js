const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendConfirmationEmail = async (userEmail, userName) => {
  try {
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
    const paymentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const mailOptions = {
      from: `"Resumix " <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Payment Confirmation - Resumix Premium',
      
      html: `
        <div style="font-family: Arial, sans-serif;">
          
          <p>Hello ${userName},</p>
          
          <p>Thank you for your payment. Your Resumix Premium subscription has been activated.</p>
          
          <div style="background-color: #cde7e7e7; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Payment Receipt:</strong></p>
            
            <p>Invoice Number: ${invoiceNumber}<br>
            Customer Name: ${userName}<br>
            Email: ${userEmail}<br>
            Payment Date: ${paymentDate}<br>
            Service: Resumix Premium Subscription (14 Days)<br>
            Amount Paid: $1.70</p>
          </div>
          
          <p>Your subscription is now active and will remain active for 14 days.</p>
          
          <p>Premium features included:<br>
          - Unlimited resume edits<br>
          - All premium templates<br>
          - ATS compatibility checker<br>
          - Priority support</p>
          
          <p>Best regards,<br>
          Resumix </p>
          
        </div>
      `,
      
      text: `Hello ${userName},
Thank you for your payment. Your Resumix Premium subscription has been activated.
Payment Receipt:
Invoice Number: ${invoiceNumber}
Customer Name: ${userName}
Email: ${userEmail}
Payment Date: ${paymentDate}
Service: Resumix Premium Subscription (14 Days)
Amount Paid: $1.70
Your subscription is now active and will remain active for 14 days.
Premium features included:
- Unlimited resume edits
- All premium templates
- ATS compatibility checker
- Priority support
Best regards,
Resumix `
    };
    
    const result = await transporter.sendMail(mailOptions);
    
    return result;
    
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
};

module.exports = { sendConfirmationEmail };