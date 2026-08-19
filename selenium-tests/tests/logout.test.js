const assert = require('assert');
const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('../helpers/driver');
const { baseUrl, testUser } = require('../config');

describe('Logout', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await buildDriver();
    assert.ok(testUser.email && testUser.password, 'TEST_USER_EMAIL/TEST_USER_PASSWORD must be set in selenium-tests/.env');

    await driver.get(`${baseUrl}/login`);
    await driver.findElement(By.id('email')).sendKeys(testUser.email);
    await driver.findElement(By.id('password')).sendKeys(testUser.password);
    await driver.findElement(By.id('submitBtn')).click();
    await driver.wait(until.urlIs(`${baseUrl}/postlogin`), 10000);
  });

  it('should return to the landing page after signing out from the account dropdown', async function () {
    await driver.findElement(By.css('.user-trigger')).click();

    const signOutLink = await driver.wait(
      until.elementLocated(By.xpath("//div[@class='dropdown-content']//a[contains(., 'Sign Out')]")),
      5000
    );
    await signOutLink.click();

    await driver.wait(until.urlIs(`${baseUrl}/`), 10000);
    const loginBtn = await driver.findElement(By.css('.login-btn'));
    assert.strictEqual(await loginBtn.getText(), 'Login');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
