const express = require('express'); 
const router = express.Router(); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { verifyToken } = require('../middlewares/TokenVerification'); 
const { sendConfirmationEmail } = require('../services/emailService');

// Import your User model
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

    // Check if user already has an active subscription
    if (user.hasActiveSubscription()) {
      return res.status(400).json({ 
        error: 'User already has an active subscription',
        subscriptionEndDate: user.subscriptionEndDate
      });
    }

    // Now we have the actual registration email from the schema!
    const userEmail = user.email; // This is the required registration email
    const userName = user.username; // This is the required username

    // Create payment intent - DON'T SEND EMAIL YET
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 170, // $1.70
      currency: 'usd',
      metadata: {
        plan: '14-day-access',
        user_email: userEmail,
        user_id: userId,
        user_name: userName,
        subscription_duration: '14'
      }
    });

    // DON'T SEND EMAIL HERE - only send after payment succeeds
    res.send({
      clientSecret: paymentIntent.client_secret,
      status: 'success',
      userEmail: userEmail, // Send back the real registration email
      userName: userName
    });
   
  } catch (error) {
    console.error(' Payment error:', error);
    res.status(500).send({
      error: error.message,
      code: error.code
    });
  }
});

// NEW ENDPOINT: Confirm payment success and activate subscription
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

    // Activate subscription using the model method
    user.activateSubscription(14); // 14 days

    // Add payment to history
    user.paymentHistory.push({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      paymentDate: new Date(),
      subscriptionDuration: 14
    });

    // Save user with updated subscription
    await user.save();

    // NOW send the confirmation email
    try {
      await sendConfirmationEmail(user.email, user.username);
    } catch (emailError) {
      console.log('Email failed:', emailError.message);
    }

    console.log(`User ${user.email} subscription activated until ${user.subscriptionEndDate}`);

    res.json({
      success: true,
      message: 'Payment confirmed and subscription activated',
      subscriptionEndDate: user.subscriptionEndDate,
      userType: user.userType
    });
   
  } catch (error) {
    console.error(' Payment confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// NEW ENDPOINT: Check subscription status
router.get('/subscription-status', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hasActive = user.hasActiveSubscription();
    const now = new Date();
    
    res.json({
      userType: user.userType,
      isSubscriptionActive: user.isSubscriptionActive,
      hasActiveSubscription: hasActive,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      daysRemaining: hasActive && user.subscriptionEndDate 
        ? Math.ceil((user.subscriptionEndDate - now) / (1000 * 60 * 60 * 24))
        : 0,
      paymentHistory: user.paymentHistory
    });

  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

// NEW ENDPOINT: Cancel subscription (optional - for testing)
router.post('/cancel-subscription', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id || req.user.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.deactivateSubscription();
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled',
      userType: user.userType
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;