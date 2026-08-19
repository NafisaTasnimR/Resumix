import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../Components/ResumeEditorPage/TopBar', () => () => <div data-testid="topbar-stub" />);

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn().mockResolvedValue({}),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
  CardElement: () => <div data-testid="card-element-stub" />,
  useStripe: () => ({}),
  useElements: () => ({}),
}));

import PaymentInfo from '../Components/PaymentInfo/PaymentInfo';

function renderPaymentInfo() {
  return render(
    <MemoryRouter>
      <PaymentInfo />
    </MemoryRouter>
  );
}

describe('TODO-7: payment initialization failure handling', () => {
  beforeEach(() => {
    window.localStorage.setItem('token', 'some-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.localStorage.clear();
  });

  test('CURRENT behavior: a non-ok create-payment-intent response renders "Failed to initialize payment"', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid API Key provided' }),
    });

    renderPaymentInfo();

    expect(await screen.findByText(/Failed to initialize payment/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  test('CURRENT behavior: a network failure also silently falls back to a fake "Demo User" checkout', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    renderPaymentInfo();

    await screen.findByText(/Failed to initialize payment/i, {}, { timeout: 3000 });

    expect(screen.getByRole('button', { name: /Get My Subscription/i })).toBeInTheDocument();
  });

  test('EXPECTED (post-fix): the error state should offer a retry instead of a dead-end message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid API Key provided' }),
    });

    renderPaymentInfo();
    await screen.findByText(/Failed to initialize payment/i, {}, { timeout: 3000 });

    expect(screen.queryByRole('button', { name: /retry|try again/i })).toBeInTheDocument();
  });

  test('happy path: a successful response clears the error and shows the checkout form', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        clientSecret: 'pi_test_secret',
        userEmail: 'fahima@gmail.com',
        userName: 'fahima',
      }),
    });

    renderPaymentInfo();

    await waitFor(() => expect(screen.queryByText(/Setting up your payment/i)).not.toBeInTheDocument(), {
      timeout: 3000,
    });

    expect(screen.queryByText(/Failed to initialize payment/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get My Subscription/i })).toBeInTheDocument();
  });
});
