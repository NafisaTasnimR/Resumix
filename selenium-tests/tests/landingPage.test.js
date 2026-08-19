const assert = require('assert');
const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('../helpers/driver');
const { baseUrl } = require('../config');

describe('Landing Page', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  beforeEach(async function () {
    await driver.get(baseUrl);
  });

  it('should show the logo and primary nav links', async function () {
    const logo = await driver.findElement(By.css('.header-left.logo'));
    assert.strictEqual(await logo.getText(), 'RESUMIX');

    const loginBtn = await driver.findElement(By.css('.login-btn'));
    const signupBtn = await driver.findElement(By.css('.register-btn'));
    assert.strictEqual(await loginBtn.getText(), 'Login');
    assert.strictEqual(await signupBtn.getText(), 'Signup');
  });

  it('should open the "no account" popup when clicking Subscription while logged out', async function () {
    const subscriptionLink = await driver.findElement(By.xpath("//span[text()='Subscription']"));
    await subscriptionLink.click();

    const popupHeading = await driver.wait(
      until.elementLocated(By.css('.no-account-card h2')),
      5000
    );
    assert.strictEqual(await popupHeading.getText(), 'You have not created any account!');
  });

  it('should close the popup and stay on the landing page', async function () {
    const subscriptionLink = await driver.findElement(By.xpath("//span[text()='Subscription']"));
    await subscriptionLink.click();

    const closeBtn = await driver.wait(until.elementLocated(By.css('.close-btn')), 5000);
    await closeBtn.click();

    await driver.wait(until.urlIs(`${baseUrl}/`), 5000);
    const stillOnLanding = await driver.findElements(By.css('.no-account-card'));
    assert.strictEqual(stillOnLanding.length, 0);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
