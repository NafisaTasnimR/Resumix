// middlewares/SubscriptionMiddleware.js
const UserModel = require('../models/User');

// Middleware to check if user has active subscription
const requireActiveSubscription = async (req, res, next) => {
  try {
    // Assume user is already verified by verifyToken middleware
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        requiresAuth: true 
      });
    }

    const userId = req.user.id || req.user._id || req.user.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        requiresAuth: true 
      });
    }

    // Check if user has active subscription
    if (!user.hasActiveSubscription()) {
      return res.status(403).json({
        error: 'Active subscription required',
        userType: user.userType,
        isSubscriptionActive: user.isSubscriptionActive,
        subscriptionEndDate: user.subscriptionEndDate,
        requiresSubscription: true,
        message: 'This feature requires an active pro subscription'
      });
    }

    // Add user data to request for use in route handlers
    req.userWithSubscription = user;
    next();

  } catch (error) {
    console.error('Subscription middleware error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// Middleware to check subscription and add user data (doesn't block free users)
const checkSubscriptionStatus = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(); // Continue without user data if not authenticated
    }

    const userId = req.user.id || req.user._id || req.user.userId;
    const user = await UserModel.findById(userId);
    
    if (user) {
      // Add subscription info to request
      req.subscriptionInfo = {
        userType: user.userType,
        hasActiveSubscription: user.hasActiveSubscription(),
        isSubscriptionActive: user.isSubscriptionActive,
        subscriptionEndDate: user.subscriptionEndDate,
        subscriptionStartDate: user.subscriptionStartDate
      };
      req.userWithSubscription = user;
    }

    next();

  } catch (error) {
    console.error('Subscription status check error:', error);
    // Continue to next middleware even if error occurs
    next();
  }
};

// Middleware for features with usage limits (free users get limited access)
const checkFeatureAccess = (freeLimit = 3) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          requiresAuth: true 
        });
      }

      const userId = req.user.id || req.user._id || req.user.userId;
      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          requiresAuth: true 
        });
      }

      // If user has active subscription, allow unlimited access
      if (user.hasActiveSubscription()) {
        req.userWithSubscription = user;
        req.isPremiumUser = true;
        return next();
      }

      // For free users, check usage limits (you'll need to implement usage tracking)
      // This is a placeholder - you'd need to implement actual usage tracking
      req.userWithSubscription = user;
      req.isPremiumUser = false;
      req.freeUserLimit = freeLimit;
      
      next();

    } catch (error) {
      console.error('Feature access middleware error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  };
};

// Helper function to get user subscription info
const getUserSubscriptionInfo = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) return null;

    const now = new Date();
    const hasActive = user.hasActiveSubscription();
    
    return {
      userId: user._id,
      userType: user.userType,
      isSubscriptionActive: user.isSubscriptionActive,
      hasActiveSubscription: hasActive,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      daysRemaining: hasActive && user.subscriptionEndDate 
        ? Math.ceil((user.subscriptionEndDate - now) / (1000 * 60 * 60 * 24))
        : 0
    };
  } catch (error) {
    console.error('Error getting user subscription info:', error);
    return null;
  }
};

module.exports = {
  requireActiveSubscription,
  checkSubscriptionStatus,
  checkFeatureAccess,
  getUserSubscriptionInfo
};