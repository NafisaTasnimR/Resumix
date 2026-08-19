import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../utils/Firebase', () => ({
  auth: {},
  provider: {},
}));

jest.mock('axios');
const axios = require('axios');

import LoginSignup from '../Components/LoginSignup/LoginSignup';

function fillSignupForm({ email, password, confirmPassword }) {
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } });
  if (confirmPassword !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: confirmPassword },
    });
  }
}

beforeEach(() => {
  jest.clearAllMocks();
  axios.post.mockResolvedValue({ data: { message: 'User registered successfully', token: 'jwt' } });
});

test('Test Data: fahima@gmail.com / fahima123 -> a well-formed but unverified email is submitted straight through', async () => {
  render(
    <MemoryRouter>
      <LoginSignup mode="signup" />
    </MemoryRouter>
  );

  fillSignupForm({ email: 'fahima@gmail.com', password: 'fahima123', confirmPassword: 'fahima123' });
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('/auth/signup'),
    expect.objectContaining({ email: 'fahima@gmail.com' }),
    expect.anything()
  );
});

test('EXPECTED (post-fix): UI should surface an email-verification step instead of navigating straight to /postlogin', async () => {
  render(
    <MemoryRouter>
      <LoginSignup mode="signup" />
    </MemoryRouter>
  );

  fillSignupForm({ email: 'fahima@gmail.com', password: 'fahima123', confirmPassword: 'fahima123' });
  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

  expect(mockNavigate).not.toHaveBeenCalledWith('/postlogin');
});

test('a "Weak" password is labeled as such but Submit still works', async () => {
  render(
    <MemoryRouter>
      <LoginSignup mode="signup" />
    </MemoryRouter>
  );

  fillSignupForm({ email: 'weak@example.com', password: 'abcde', confirmPassword: 'abcde' });

  expect(screen.getByText(/Password strength is Weak/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  expect(axios.post).toHaveBeenCalledWith(
    expect.stringContaining('/auth/signup'),
    expect.objectContaining({ password: 'abcde' }),
    expect.anything()
  );
});

test('EXPECTED (post-fix): Submit should be disabled/blocked while password strength is Weak', () => {
  render(
    <MemoryRouter>
      <LoginSignup mode="signup" />
    </MemoryRouter>
  );

  fillSignupForm({ email: 'weak@example.com', password: 'abcde', confirmPassword: 'abcde' });

  const submit = screen.getByText('Submit');
  expect(submit).toHaveAttribute('aria-disabled', 'true');
});