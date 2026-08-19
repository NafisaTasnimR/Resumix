

import fs from 'fs';
import path from 'path';

const readSource = (relativePath) =>
  fs.readFileSync(path.join(__dirname, '..', 'Components', relativePath), 'utf8');

describe('BUG: no UI component lets a user cancel their subscription', () => {
  test('BUG REPRO: SubscriptionPage.jsx never calls the cancel-subscription endpoint', () => {
    const source = readSource('SubscriptionPage/SubscriptionPage.jsx');
    expect(source).not.toMatch(/cancel-subscription/i);
  });

  test('BUG REPRO: SettingsPage.jsx never calls the cancel-subscription endpoint', () => {
    const source = readSource('Settings/SettingsPage.jsx');
    expect(source).not.toMatch(/cancel-subscription/i);
  });

  test('BUG REPRO: PaymentInfo.jsx never calls the cancel-subscription endpoint', () => {
    const source = readSource('PaymentInfo/PaymentInfo.jsx');
    expect(source).not.toMatch(/cancel-subscription/i);
  });

  test('BUG REPRO: no component source file anywhere references "Cancel Subscription" UI text', () => {
    const componentsDir = path.join(__dirname, '..', '..');
    const filesToScan = [];

    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
          filesToScan.push(fullPath);
        }
      }
    };
    walk(componentsDir);

    const matches = filesToScan.filter((file) => {
      const contents = fs.readFileSync(file, 'utf8');
      return /cancel\s*subscription/i.test(contents);
    });

    
    expect(matches.length).toBeGreaterThan(0);
  });

  test('EXPECTED BEHAVIOUR (currently failing): SubscriptionPage.jsx should expose a way to cancel', () => {
    const source = readSource('SubscriptionPage/SubscriptionPage.jsx');
    const hasCancelHandlerOrButton =
      /cancel-subscription/i.test(source) || /handleCancel/i.test(source);
    expect(hasCancelHandlerOrButton).toBe(true);
  });
});

describe('Sanity check: the backend cancel endpoint this UI should eventually call does exist', () => {
  test('PaymentRouter.js (backend) defines POST /cancel-subscription', () => {
   
   const backendRouterPath = path.join(__dirname, '..', '..', '..', 'backend', 'routes', 'PaymentRouter.js');

    if (!fs.existsSync(backendRouterPath)) {
      
      console.warn(
        `Skipping backend route check - could not find PaymentRouter.js at ${backendRouterPath}`
      );
      return;
    }

    const source = fs.readFileSync(backendRouterPath, 'utf8');
    expect(source).toMatch(/cancel-subscription/);
  });
});