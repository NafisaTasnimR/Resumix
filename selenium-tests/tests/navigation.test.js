const assert = require('assert');
const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('../helpers/driver');
const { baseUrl } = require('../config');

describe('Navigation', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  it('should navigate to /login when clicking the Login button', async function () {
    await driver.get(baseUrl);
    await driver.findElement(By.css('.login-btn')).click();
    await driver.wait(until.urlIs(`${baseUrl}/login`), 5000);
    const heading = await driver.findElement(By.css('.form-header .text'));
    assert.ok((await heading.getText()).includes('Login'));
  });

  it('should navigate to /signup when clicking the Signup button', async function () {
    await driver.get(baseUrl);
    await driver.findElement(By.css('.register-btn')).click();
    await driver.wait(until.urlIs(`${baseUrl}/signup`), 5000);
    const heading = await driver.findElement(By.css('.form-header .text'));
    assert.ok((await heading.getText()).includes('Sign Up'));
  });

  it('should switch from Login to Sign Up form without changing the URL', async function () {
    await driver.get(`${baseUrl}/login`);
    await driver.findElement(By.id('switchToSignup')).click();

    const heading = await driver.wait(until.elementLocated(By.css('.form-header .text')), 5000);
    assert.ok((await heading.getText()).includes('Sign Up'));
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/login`);

    // Confirm Password field only appears in Sign Up mode
    const confirmField = await driver.findElements(By.id('confirmPassword'));
    assert.strictEqual(confirmField.length, 1);
  });

  it('should switch from Sign Up back to Login form', async function () {
    await driver.get(`${baseUrl}/signup`);
    await driver.findElement(By.id('switchToLogin')).click();

    const heading = await driver.wait(until.elementLocated(By.css('.form-header .text')), 5000);
    assert.ok((await heading.getText()).includes('Login'));
    const confirmField = await driver.findElements(By.id('confirmPassword'));
    assert.strictEqual(confirmField.length, 0);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
