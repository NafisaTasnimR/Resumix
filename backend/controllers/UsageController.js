// controllers/usage.controller.js
const User = require('../models/User');

// Central free-tier limits (adjust as needed)
const FREE_LIMITS = {
  download: 3,
  ats: 1,
};

function getFieldByType(type) {
  if (type === 'download') return 'downloadCount';
  if (type === 'ats') return 'atsCheckCount';
  throw new Error('Invalid type');
}

// Flexible paid check (supports your existing schema/methods)
function isUserPaid(user) {
  if (!user) return false;
  if (user.userType === 'paid') return true;

  // If you have a method:
  if (typeof user.hasActiveSubscription === 'function') {
    try {
      if (user.hasActiveSubscription() === true) return true;
    } catch (_) {}
  }

  // Fallback flags, if present in your schema
  if (user.isSubscriptionActive && user.subscriptionEndDate) {
    return new Date(user.subscriptionEndDate) > new Date();
  }
  return false;
}

// GET /api/usage
exports.getUsage = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const paid = isUserPaid(user);
    return res.json({
      isPaid: paid,
      downloadCount: user.downloadCount || 0,
      atsCheckCount: user.atsCheckCount || 0,
      limits: FREE_LIMITS,
    });
  } catch (e) {
    console.error('getUsage error:', e);
    return res.status(500).json({ message: 'Failed to fetch usage' });
  }
};

// POST /api/usage/check   { type: 'download' | 'ats' }
exports.checkUsage = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { type } = req.body || {};
    if (!type || !['download', 'ats'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (isUserPaid(user)) {
      return res.json({ allowed: true, unlimited: true });
    }

    const field = getFieldByType(type);
    const used = user[field] || 0;
    const limit = FREE_LIMITS[type];
    const allowed = used < limit;

    return res.json({
      allowed,
      remaining: Math.max(limit - used, 0),
      unlimited: false,
    });
  } catch (e) {
    console.error('checkUsage error:', e);
    return res.status(500).json({ message: 'Usage check failed' });
  }
};

// POST /api/usage/consume   { type: 'download' | 'ats' }
// Atomic: increments only if still below limit
exports.consumeUsage = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { type } = req.body || {};
    if (!type || !['download', 'ats'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    // Fetch user first to see if they're paid
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    if (isUserPaid(currentUser)) {
      return res.json({ allowed: true, unlimited: true });
    }

    const field = getFieldByType(type);
    const limit = FREE_LIMITS[type];

    // Atomically increment if still under limit
    const updated = await User.findOneAndUpdate(
      { _id: userId, [field]: { $lt: limit } },
      { $inc: { [field]: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(403).json({
        allowed: false,
        remaining: 0,
        unlimited: false,
      });
    }

    return res.json({
      allowed: true,
      remaining: Math.max(limit - updated[field], 0),
      unlimited: false,
    });
  } catch (e) {
    console.error('consumeUsage error:', e);
    return res.status(500).json({ message: 'Usage consume failed' });
  }
};
