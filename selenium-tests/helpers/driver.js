const { Builder } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');

async function buildDriver() {
  const options = new edge.Options();
  // Uncomment to run headless:
  // options.addArguments('--headless=new');
  return new Builder()
    .forBrowser('MicrosoftEdge')
    .setEdgeOptions(options)
    .build();
}

module.exports = { buildDriver };
