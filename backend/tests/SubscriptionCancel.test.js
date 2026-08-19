
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { runHandlers, makeReq, getRouteHandlers } = require('./helpers/callRoute');

jest.mock('../models/User');
jest.mock('../services/emailService', () => ({
  sendConfirmationEmail: jest.fn().mockResolvedValue(true),
}));

const UserModel = require('../models/User');
const paymentRouter = require('../routes/PaymentRouter');

const CANCEL_CHAIN = getRouteHandlers(paymentRouter, 'post', '/cancel-subscription');

describe('POST /api/payment/cancel-subscription (backend logic works in isolation)', () => {
  let token;
  let mockUser;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ userId: 'user-1' }, process.env.JWT_SECRET);

    mockUser = {
      _id: 'user-1',
      userType: 'paid',
      isSubscriptionActive: true,
      subscriptionEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      deactivateSubscription: jest.fn(function () {
        this.userType = 'free';
        this.isSubscriptionActive = false;
        this.subscriptionEndDate = null;
      }),
      save: jest.fn().mockResolvedValue(true),
    };

    UserModel.findById.mockResolvedValue(mockUser);
  });

  test('cancelling an active subscription deactivates it and returns success', async () => {
    const req = makeReq({ headers: { authorization: `Bearer ${token}` } });

    const res = await runHandlers(CANCEL_CHAIN, req);

    expect(mockUser.deactivateSubscription).toHaveBeenCalled();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ success: true, userType: 'free' });
  });

  test('missing/invalid token is rejected before reaching the controller', async () => {
    const req = makeReq({});
    const res = await runHandlers(CANCEL_CHAIN, req);
    expect(res.statusCode).toBe(401);
    expect(mockUser.deactivateSubscription).not.toHaveBeenCalled();
  });

  test('BUG-ADJACENT (currently failing): cancellation does not persist an audit trail', () => {
    const RealUserModel = jest.requireActual('../models/User');
    const schemaPaths = RealUserModel.schema.paths;
    const hasCancellationAudit =
      Object.prototype.hasOwnProperty.call(schemaPaths, 'subscriptionCancelledAt') ||
      Object.prototype.hasOwnProperty.call(schemaPaths, 'cancellationReason');

    expect(hasCancellationAudit).toBe(true);
  });
});

describe('BUG: no frontend surface calls this endpoint', () => {
  test('SubscriptionPage.jsx never references cancel-subscription', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'frontend', 'src', 'Components', 'SubscriptionPage', 'SubscriptionPage.jsx'),
      'utf8'
    );
    expect(src).not.toMatch(/cancel-subscription/i);
  });

  test('SettingsPage.jsx never references cancel-subscription', () => {
    const src = fs.readFileSync(
      path.join(__dirname, '..', '..', 'frontend', 'src', 'Components', 'Settings', 'SettingsPage.jsx'),
      'utf8'
    );
    expect(src).not.toMatch(/cancel-subscription/i);
  });
});