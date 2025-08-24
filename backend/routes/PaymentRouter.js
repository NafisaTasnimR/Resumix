const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middlewares/TokenVerification');
const { sendConfirmationEmail } = require('../services/emailService');

// Import your User model (matching your export name)
const UserModel = require('../models/User');

// Create payment intent - WITH TOKEN VERIFICATION AND DATABASE LOOKUP
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

    // Create payment intent - DON'T SEND EMAIL YET
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

    // DON'T SEND EMAIL HERE - only send after payment succeeds

    res.send({
      clientSecret: paymentIntent.client_secret,
      status: 'success',
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

// NEW ENDPOINT: Confirm payment success and send email
router.post('/confirm-payment', verifyToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.id || req.user._id || req.user.userId;
    
    // Verify the payment actually succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Get user data
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // NOW send the confirmation email
    try {
      await sendConfirmationEmail(user.email, user.username);
      console.log('✅ Payment confirmed, email sent successfully');
    } catch (emailError) {
      console.log('⚠️ Email failed:', emailError.message);
    }

    // Update user to paid status
    await UserModel.findByIdAndUpdate(userId, { userType: 'paid' });

    res.json({ 
      success: true, 
      message: 'Payment confirmed and email sent' 
    });

  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;