const assert = require('assert');
const { buildDriver } = require('../helpers/driver');
const { baseUrl } = require('../config');

describe('Page Title', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    driver = await buildDriver();
  });

  it("should have the title 'Resumix'", async function () {
    await driver.get(baseUrl);
    const title = await driver.getTitle();
    assert.strictEqual(title, 'Resumix');
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });
});
