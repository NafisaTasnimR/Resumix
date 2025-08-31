// services/subscriptionCron.js
const cron = require('node-cron');
const UserModel = require('../models/User');

// Function to check and update expired subscriptions
const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();
    
    // Find all users with active subscriptions that have expired
    const expiredUsers = await UserModel.find({
      isSubscriptionActive: true,
      subscriptionEndDate: { $lt: now }
    });

    if (expiredUsers.length > 0) {
      console.log(`Processing ${expiredUsers.length} expired subscriptions`);
    }

    // Update each expired user
    for (const user of expiredUsers) {
      try {
        user.deactivateSubscription();
        await user.save();
        
        // Optional: Send notification email about subscription expiry
        // await sendSubscriptionExpiredEmail(user.email, user.username);
        
      } catch (error) {
        console.error(`Error deactivating subscription for user ${user.email}:`, error);
      }
    }

  } catch (error) {
    console.error('Error in subscription cron job:', error);
  }
};

// Function to get subscription statistics
const getSubscriptionStats = async () => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const paidUsers = await UserModel.countDocuments({ userType: 'paid' });
    const activeSubscriptions = await UserModel.countDocuments({ 
      isSubscriptionActive: true,
      subscriptionEndDate: { $gt: new Date() }
    });
    
    console.log(` Subscription Stats:
      - Total Users: ${totalUsers}
      - Paid Users: ${paidUsers}
      - Active Subscriptions: ${activeSubscriptions}
    `);
    
    return {
      totalUsers,
      paidUsers,
      activeSubscriptions
    };
  } catch (error) {
    console.error('Error getting subscription stats:', error);
    return null;
  }
};

// Initialize cron job
const initializeSubscriptionCron = () => {
  // Run every hour to check for expired subscriptions
  cron.schedule('0 * * * *', () => {
    checkExpiredSubscriptions();
  });

  // Run daily stats at midnight
  cron.schedule('0 0 * * *', () => {
    getSubscriptionStats();
  });

  console.log('Subscription cron jobs initialized');
};

// Manual functions for testing
const manualExpiryCheck = () => {
  console.log(' Manual expiry check triggered');
  return checkExpiredSubscriptions();
};

const manualStatsCheck = () => {
  console.log(' Manual stats check triggered');
  return getSubscriptionStats();
};

module.exports = {
  initializeSubscriptionCron,
  checkExpiredSubscriptions,
  getSubscriptionStats,
  manualExpiryCheck,
  manualStatsCheck
};