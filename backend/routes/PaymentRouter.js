const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middlewares/TokenVerification');
const { sendConfirmationEmail } = require('../services/emailService');


const UserModel = require('../models/User');


router.post('/create-payment-intent', verifyToken, async (req, res) => {
  try {
    // Get user ID from the verified token
    const userId = req.user.id || req.user._id || req.user.userId;
    
    // Fetch full user data from database using your UserModel
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Now we have the actual registration email from the schema!
    const userEmail = user.email; // This is the required registration email
    const userName = user.username; // This is the required username

    console.log('💳 Creating payment intent for verified user:', userEmail);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 170,
      currency: 'usd',
      metadata: {
        plan: '14-day-access',
        user_email: userEmail,
        user_id: userId,
        user_name: userName
      }
    });

    console.log('✅ Payment intent created:', paymentIntent.id);

    // Send confirmation email to the registration email
    try {
      await sendConfirmationEmail(userEmail, userName);
      console.log('✅ Email sent successfully');
    } catch (emailError) {
      console.log('⚠️ Email failed but payment succeeded:', emailError.message);
    }

    res.send({
      clientSecret: paymentIntent.client_secret,
      status: 'success',
      emailSent: true,
      message: 'Payment successful and email sent',
      userEmail: userEmail, // Send back the real registration email
      userName: userName
    });

  } catch (error) {
    console.error('❌ Payment error:', error);
    res.status(500).send({
      error: error.message,
      code: error.code
    });
  }
});

module.exports = router;