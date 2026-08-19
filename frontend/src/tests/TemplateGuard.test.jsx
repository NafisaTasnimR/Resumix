import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');
const axios = require('axios');

import TemplatePreview from '../Components/ResumeTemplates/TemplatePreview';

beforeEach(() => {
  jest.clearAllMocks();
  axios.get.mockResolvedValue({
    data: { rawTemplate: '<div class="resume">{{fullName}}</div>', templateCss: '' },
  });
});

test('CURRENT (buggy) behavior: clicking a template navigates straight to /resumebuilder with no personal-info check', async () => {
  render(<TemplatePreview id="tpl-1" template={{ name: 'Resume1' }} />);

  fireEvent.click(screen.getByText('Resume1'));

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
  expect(mockNavigate).toHaveBeenCalledWith(
    '/resumebuilder',
    expect.objectContaining({ state: expect.objectContaining({ templateId: 'tpl-1' }) })
  );
});

test('EXPECTED (post-fix): selecting a template while personalInfo is incomplete should redirect to /profile instead', async () => {
  axios.get.mockImplementation((url) => {
    if (url.includes('/viewInformation/userInformation')) {
      return Promise.resolve({ data: { defaultResumeData: { personalInfo: {} } } });
    }
    return Promise.resolve({
      data: { rawTemplate: '<div class="resume">{{fullName}}</div>', templateCss: '' },
    });
  });

  render(<TemplatePreview id="tpl-1" template={{ name: 'Resume1' }} />);
  fireEvent.click(screen.getByText('Resume1'));

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
  expect(mockNavigate).toHaveBeenCalledWith('/profile', expect.anything());
});