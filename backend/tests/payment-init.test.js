process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

const jwt = require('jsonwebtoken');
const { runHandlers, makeReq, getRouteHandlers } = require('./helpers/callRoute');

jest.mock('../models/User');
jest.mock('stripe', () => {
  return jest.fn(() => ({
    paymentIntents: { create: jest.fn() },
  }));
});

const UserModel = require('../models/User');
const stripeFactory = require('stripe');
const paymentRouter = require('../routes/PaymentRouter');

const stripeInstance = stripeFactory.mock.results[0].value;
const CHAIN = getRouteHandlers(paymentRouter, 'POST', '/create-payment-intent');

describe('create-payment-intent', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ userId: 'user-1' }, process.env.JWT_SECRET);
  });

  test('returns 401 without an auth token (matches the "Failed to initialize payment" UI path)', async () => {
    const req = makeReq({ body: {} });
    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(401);
  });

  test('returns 404 when the token is valid but the user no longer exists', async () => {
    UserModel.findById.mockResolvedValue(null);
    const req = makeReq({ headers: { authorization: `Bearer ${token}` }, body: {} });
    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(404);
  });

  test('returns 400 when the user already has an active subscription', async () => {
    UserModel.findById.mockResolvedValue({
      _id: 'user-1',
      email: 'fahima@gmail.com',
      username: 'fahima',
      hasActiveSubscription: () => true,
      subscriptionEndDate: new Date(),
    });
    const req = makeReq({ headers: { authorization: `Bearer ${token}` }, body: {} });
    const res = await runHandlers(CHAIN, req);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already has an active subscription/i);
  });

  test('BUG repro: Stripe rejecting the request (e.g. bad/expired STRIPE_SECRET_KEY) surfaces as 500 -> "Failed to initialize payment" on the client', async () => {
    UserModel.findById.mockResolvedValue({
      _id: 'user-1',
      email: 'fahima@gmail.com',
      username: 'fahima',
      hasActiveSubscription: () => false,
    });

    stripeInstance.paymentIntents.create.mockRejectedValue(
      Object.assign(new Error('Invalid API Key provided'), { code: 'authentication_error' })
    );

    const req = makeReq({ headers: { authorization: `Bearer ${token}` }, body: {} });
    const res = await runHandlers(CHAIN, req);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/Invalid API Key/i);
  });

  test('happy path: valid user + working Stripe key returns a clientSecret', async () => {
    UserModel.findById.mockResolvedValue({
      _id: 'user-1',
      email: 'fahima@gmail.com',
      username: 'fahima',
      hasActiveSubscription: () => false,
    });

    stripeInstance.paymentIntents.create.mockResolvedValue({
      client_secret: 'pi_test_secret_123',
    });

    const req = makeReq({ headers: { authorization: `Bearer ${token}` }, body: {} });
    const res = await runHandlers(CHAIN, req);

    expect(res.statusCode).toBe(200);
    expect(res.body.clientSecret).toBe('pi_test_secret_123');
    expect(res.body.userEmail).toBe('fahima@gmail.com');
  });
});
