const { runHandlers, makeReq } = require('./helpers/callRoute');
const { validateSignup } = require('../middlewares/AuthValidation');

jest.mock('../models/User');
const UserModel = require('../models/User');
const { signup } = require('../controllers/AuthController');

beforeEach(() => {
  jest.clearAllMocks();
  UserModel.findOne.mockResolvedValue(null);
  UserModel.mockImplementation(function (doc) {
    Object.assign(this, doc);
    this.save = jest.fn().mockResolvedValue(this);
  });
});

test.each([
  ['all lowercase, no digits/symbols', 'aaaaaa'],
  ['digits only', '111111'],
  ['6-char minimum, no complexity', 'abc123'],
])(
  'CURRENT (buggy) behavior: weak password "%s" (%s) is accepted',
  async (_label, password) => {
    const req = makeReq({
      body: { username: 'weakuser', email: `weak-${password}@example.com`, password },
    });
    const res = await runHandlers([validateSignup, signup], req);
    expect(res.statusCode).toBe(201); // BUG: should be rejected
  }
);

test('EXPECTED (post-fix): weak password should be rejected with 400', async () => {
  const req = makeReq({
    body: { username: 'weakuser2', email: 'weak2@example.com', password: 'aaaaaa' },
  });

  const res = await runHandlers([validateSignup, signup], req);

  expect(res.statusCode).toBe(400);
});

test('strong password (upper+lower+number+symbol, 8+ chars) is accepted', async () => {
  const req = makeReq({
    body: { username: 'stronguser', email: 'strong@example.com', password: 'Str0ng!Pass' },
  });

  const res = await runHandlers([validateSignup, signup], req);
  expect(res.statusCode).toBe(201);
});