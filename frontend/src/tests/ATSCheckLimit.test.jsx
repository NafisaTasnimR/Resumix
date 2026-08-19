import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('../Components/ResumeEditorPage/TopBar', () => () => <div data-testid="topbar-stub" />);

const axios = require('axios');
import Dashboard from '../Components/DashBoard/UserDashboard';

function mockFetchOk(body) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => body,
  });
}

const SAMPLE_RESUME = {
  _id: 'resume-1',
  title: 'My First Resume',
  strength: 40,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
}


beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  axios.get.mockImplementation((url) => {
    if (url.includes('/viewInformation/userInformation')) {
      return Promise.resolve({ data: { username: 'newuser', defaultResumeData: {} } });
    }
    if (url.includes('/resume/all')) {
      return Promise.resolve({ data: { resumes: [SAMPLE_RESUME] } });
    }
    return Promise.resolve({ data: {} });
  });
  mockFetchOk({ hasActiveSubscription: false });
});

test('CURRENT (buggy) behavior: stale usageData left over in localStorage disables ATS Check for a brand-new signup', async () => {
  window.localStorage.setItem(
    'usageData',
    JSON.stringify({ downloadsUsed: 0, atsChecksUsed: 1, downloadLimit: 3, atsLimit: 1 })
  );
  window.localStorage.setItem('token', 'brand-new-user-token');

  renderDashboard();

  const atsButton = await screen.findByRole('button', { name: /ATS Check/i });

  expect(atsButton).toBeDisabled();
  expect(atsButton.title).toMatch(/ATS check limit reached \(1\/1\)/);
});

test('EXPECTED (post-fix): a newly authenticated user always starts with 0/1 ATS checks used', async () => {
  window.localStorage.setItem(
    'usageData',
    JSON.stringify({ downloadsUsed: 0, atsChecksUsed: 1, downloadLimit: 3, atsLimit: 1 })
  );
  window.localStorage.setItem('token', 'brand-new-user-token');

  renderDashboard();

  const atsButton = await screen.findByRole('button', { name: /ATS Check/i });

  expect(atsButton).toBeEnabled();
  expect(atsButton).toHaveTextContent('ATS Check (1 left)');
});

test('a user who genuinely used their 1 free ATS check within the SAME account stays blocked (control case)', async () => {
  window.localStorage.setItem(
    'usageData',
    JSON.stringify({ downloadsUsed: 0, atsChecksUsed: 1, downloadLimit: 3, atsLimit: 1 })
  );
  window.localStorage.setItem('token', 'same-returning-user-token');

  renderDashboard();

  const atsButton = await screen.findByRole('button', { name: /ATS Check/i });
  expect(atsButton).toBeDisabled();
});