/* eslint-disable import/no-extraneous-dependencies */

const { Builder, Capabilities, Key } = require('selenium-webdriver');

function execCommand(element, text) {
  text.split('').forEach((ch) => {
    const toSend = ch === ' ' ? Key.SPACE : ch;
    element.sendKeys(toSend);
  });
  element.sendKeys(Key.ENTER);
}

function configuredDriver() {
  const chromeCapabilities = Capabilities.chrome();
  chromeCapabilities.set('chromeOptions', { args: ['--headless'] });
  const driver = new Builder()
    .forBrowser('chrome')
    .withCapabilities(chromeCapabilities)
    .build();
  return driver;
}

module.exports = {
  configuredDriver,
  execCommand,
};
