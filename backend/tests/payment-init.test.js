/**
 * TODO-7: Failed to initialize payment when attempting to purchase a Pro
 * subscription (Due: 20 Aug 2026, medium).
 *
 * Source: backend/routes/PaymentRouter.js -> POST /api/payment/create-payment-intent
 * and frontend/src/Components/PaymentInfo/PaymentInfo.jsx -> createPaymentIntent()
 * which shows "Failed to initialize payment" whenever the fetch throws or
 * `response.ok` is false (e.g. bad/missing STRIPE_SECRET_KEY, Stripe API
 * error, or an already-active subscription).
 *
 * PaymentRouter.js declares its handlers inline on the router (not as
 * separately exported functions), so instead of supertest/HTTP we pull the
 * middleware chain straight off the Router instance with `getRouteHandlers`
 * and run it with the hand-built req/res helper (see tests/helpers/callRoute.js).
 *
 * See also: frontend/src/tests/todo7.PaymentInfo.test.jsx for the client
 * side of this same bug.
 */
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

// PaymentRouter.js constructs its Stripe client once at require-time
// (`stripe(process.env.STRIPE_SECRET_KEY)`), and Node caches the module, so
// there is exactly one mocked Stripe instance for the whole file.
const stripeInstance = stripeFactory.mock.results[0].value;
const CHAIN = getRouteHandlers(paymentRouter, 'POST', '/create-payment-intent');

describe('TODO-7: create-payment-intent', () => {
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
