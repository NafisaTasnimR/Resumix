const assert = require('assert');
const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('../helpers/driver');
const { baseUrl, testUser } = require('../config');

describe('Login', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  beforeEach(async function () {
    await driver.get(`${baseUrl}/login`);
    await driver.executeScript('window.localStorage.clear();');
  });

  it('should show an error message for invalid credentials', async function () {
    await driver.findElement(By.id('email')).sendKeys('nonexistent-user@example.com');
    await driver.findElement(By.id('password')).sendKeys('wrongpassword');
    await driver.findElement(By.id('submitBtn')).click();

    const errorEl = await driver.wait(until.elementLocated(By.id('errorMessage')), 5000);
    const errorText = await errorEl.getText();
    assert.strictEqual(errorText, 'Authentication Failed! Email or Password is wrong');
    assert.strictEqual(await driver.getCurrentUrl(), `${baseUrl}/login`);
  });

  it('should log in successfully with valid credentials and redirect to /postlogin', async function () {
    assert.ok(testUser.email && testUser.password, 'TEST_USER_EMAIL/TEST_USER_PASSWORD must be set in selenium-tests/.env');

    await driver.findElement(By.id('email')).sendKeys(testUser.email);
    await driver.findElement(By.id('password')).sendKeys(testUser.password);
    await driver.findElement(By.id('submitBtn')).click();

    await driver.wait(until.urlIs(`${baseUrl}/postlogin`), 10000);

    const accountBtn = await driver.wait(until.elementLocated(By.css('.account-button')), 5000);
    assert.ok((await accountBtn.getText()).includes('MY ACCOUNT'));

    const token = await driver.executeScript("return window.localStorage.getItem('token');");
    assert.ok(token, 'expected an auth token to be stored in localStorage');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
