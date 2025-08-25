const nodemailer = require('nodemailer');
console.log('Email config check:', {
  user: process.env.EMAIL_USER ? 'Found' : 'Missing',
  pass: process.env.EMAIL_PASS ? 'Found' : 'Missing'
});

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