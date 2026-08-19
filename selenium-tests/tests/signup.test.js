const assert = require('assert');
const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('../helpers/driver');
const { baseUrl } = require('../config');

describe('Signup form validation', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  beforeEach(async function () {
    await driver.get(`${baseUrl}/signup`);
  });

  it('should show a live "Passwords do not match" error while typing', async function () {
    await driver.findElement(By.id('password')).sendKeys('Abcd1234!');
    await driver.findElement(By.id('confirmPassword')).sendKeys('somethingElse');

    const mismatchEl = await driver.wait(until.elementLocated(By.id('mismatchError')), 5000);
    assert.strictEqual(await mismatchEl.getText(), 'Passwords do not match');
  });

  it('should clear the mismatch error once passwords match', async function () {
    await driver.findElement(By.id('password')).sendKeys('Abcd1234!');
    const confirmField = driver.findElement(By.id('confirmPassword'));
    await confirmField.sendKeys('somethingElse');
    await driver.wait(until.elementLocated(By.id('mismatchError')), 5000);

    await confirmField.clear();
    await confirmField.sendKeys('Abcd1234!');

    const mismatchEls = await driver.findElements(By.id('mismatchError'));
    assert.strictEqual(mismatchEls.length, 0);
  });

  it('should report password strength as the user types', async function () {
    await driver.findElement(By.id('password')).sendKeys('Abcd1234!');
    const strengthEl = await driver.wait(until.elementLocated(By.css('.password-strength')), 5000);
    assert.strictEqual(await strengthEl.getText(), 'Password strength is Strong');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
