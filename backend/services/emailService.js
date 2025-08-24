const nodemailer = require('nodemailer');

// Create transporter with YOUR Gmail (from .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail from .env
    pass: process.env.EMAIL_PASS   // Your App Password from .env
  }
});

const sendConfirmationEmail = async (userEmail, userName) => {
  try {
    console.log('Sending confirmation email to:', userEmail);
    
    const result = await transporter.sendMail({
      from: `Resumix <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: ' Your Resumix Premium Subscription is Activated!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #656d4a, #8b9467); padding: 30px; text-align: center; color: white;">
            <h1>Welcome to Resumix Premium! </h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2>Thank you for your subscription, ${userName}!</h2>
            <p>Your premium access has been activated. You now have:</p>
            <ul style="background: white; padding: 20px; border-radius: 8px;">
              <li>  Unlimited resume edits and downloads</li>
              <li> All professional templates</li>
              <li> Unlimited ATS checker usage</li>
              <li> Personalized resume URL</li>
            </ul>
            <p>Start creating amazing resumes now!</p>
          </div>
        </div>
      `,
      text: `Welcome to Resumix Premium! Your subscription is now active. You have access to unlimited resume edits, all templates, ATS checker, and more.`
    });

    console.log(' Confirmation email sent to:', userEmail);
    return result;
  } catch (error) {
    console.error(' Email error:', error.message);
    throw error;
  }
};

module.exports = { sendConfirmationEmail };