/* eslint-disable prefer-arrow-callback, func-names */

const { By, Key } = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const { assert } = require('chai');

const { configuredDriver, execCommand } = require('./TestUtils');

test.describe('Autocomplete', function () {
  const driver = configuredDriver();
  let input;
  let body;
  let terminalOutput;

  test.before(function () {
    this.timeout(10000);
    driver.get('http://localhost:8080');
    body = driver.findElement(By.css('body'));
    terminalOutput = driver.findElement(By.id('terminal-output'));
    input = driver.findElement(By.id('input'));
  });

  test.after(function () {
    driver.quit();
  });

  test.afterEach(function () {
    execCommand(body, '');
    execCommand(body, 'clear');
  });

  test.describe('#autocomplete', function () {
    test.it('complete command with one option', function () {
      body.sendKeys('p', Key.TAB);
      input.getText().then((txt) => {
        assert.equal(txt, 'pwd');
      });
    });

    test.it('complete command with multiple options', function () {
      body.sendKeys(Key.TAB, Key.TAB);
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'cat');
        assert.include(txt, 'clear');
        assert.include(txt, 'cd');
      });
    });

    test.it('complete file with no options', function () {
      let beforeTab;
      let afterOneTab;
      let afterTwoTabs;
      body.sendKeys('x');
      body.getText().then((txt) => { beforeTab = txt; });
      body.sendKeys(Key.TAB);
      body.getText().then((txt) => { afterOneTab = txt; });
      body.sendKeys(Key.TAB);
      body.getText().then((txt) => {
        afterTwoTabs = txt;
        assert.equal(beforeTab, afterOneTab);
        assert.equal(beforeTab, afterTwoTabs);
      });
    });

    test.it('complete file with one option', function () {
      body.sendKeys('cd', Key.SPACE, 'l', Key.TAB);
      input.getText().then((txt) => {
        assert.equal(txt, 'cd links/');
      });
    });

    test.it('complete file with multiple options', function () {
      execCommand(body, 'mkdir links2');
      body.sendKeys('cd', Key.SPACE, 'l', Key.TAB, Key.TAB);
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'links2');
        assert.include(txt, 'links');
      });
    });

    test.it('complete file with multiple options with same beginning', function () {
      execCommand(body, 'mkdir catalogue catamaran');
      body.sendKeys('cd', Key.SPACE, 'c', Key.TAB);
      input.getText().then((txt) => {
        assert.equal(txt, 'cd cata');
      });
      body.sendKeys(Key.TAB, Key.TAB);
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'catalogue/');
        assert.include(txt, 'catamaran/');
      });
      body.sendKeys('l', Key.TAB);
      input.getText().then((txt) => {
        assert.equal(txt, 'cd catalogue/');
      });
    });

    test.it('complete file with no options', function () {
      let beforeTab;
      let afterOneTab;
      let afterTwoTabs;
      body.sendKeys('cd', Key.SPACE, 'xxx');
      body.getText().then((txt) => { beforeTab = txt; });
      body.sendKeys(Key.TAB);
      body.getText().then((txt) => { afterOneTab = txt; });
      body.sendKeys(Key.TAB);
      body.getText().then((txt) => {
        afterTwoTabs = txt;
        assert.equal(beforeTab, afterOneTab);
        assert.equal(beforeTab, afterTwoTabs);
      });
    });
  });
});
