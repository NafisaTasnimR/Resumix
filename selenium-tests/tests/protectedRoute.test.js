const assert = require('assert');
const { By, until } = require('selenium-webdriver');
const { buildDriver } = require('../helpers/driver');
const { baseUrl } = require('../config');

describe('Protected routes', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  it('should redirect to /login when visiting /dashboard without an auth token', async function () {
    await driver.get(baseUrl);
    await driver.executeScript('window.localStorage.clear();');
    await driver.get(`${baseUrl}/dashboard`);

    await driver.wait(until.urlIs(`${baseUrl}/login`), 10000);
    const heading = await driver.findElement(By.css('.form-header .text'));
    assert.ok((await heading.getText()).includes('Login'));
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
