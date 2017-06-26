/* eslint-disable prefer-arrow-callback, func-names */

const { Builder, By, Key } = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const assert = require('chai').assert;
const { execCommand } = require('./testUtils');

test.describe('Shell Commands', function () {
  let driver;
  let body;
  let terminalOutput;

  test.before(function () {
    this.timeout(10000);
    driver = new Builder().forBrowser('firefox').build();
    driver.get('http://localhost:8080');
    body = driver.findElement(By.css('body'));
    terminalOutput = driver.findElement(By.id('terminal-output'));
  });

  test.after(function () {
    driver.quit();
  });

  test.afterEach(function () {
    execCommand(body, 'cd');
    execCommand(body, 'clear');
  });

  test.describe('#help', function () {
    test.it('help', function () {
      execCommand(body, 'help');
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'Available commands:');
      });
    });
  });

  test.describe('#clear', function () {
    test.it('clear', function () {
      execCommand(body, 'help');
      execCommand(body, 'clear');
      terminalOutput.getText().then((txt) => {
        assert.notInclude(txt, 'Available commands:');
      });
    });
  });

  test.describe('#pwd', function () {
    test.it('pwd', function () {
      execCommand(body, 'cd links');
      execCommand(body, 'clear');
      execCommand(body, 'pwd');
      terminalOutput.getText().then((txt) => {
        assert.include(txt, '~/links');
      });
    });
  });

  test.describe('#cd', function () {
    test.it('cd links', function () {
      execCommand(body, 'cd links');
      execCommand(body, 'clear');
      body.getText().then((txt) => {
        assert.include(txt, 'links');
      });
    });

    test.it('cd with no arguments', function () {
      execCommand(body, 'cd links');
      execCommand(body, 'cd');
      execCommand(body, 'pwd');
      body.getText().then((txt) => {
        assert.include(txt, '\n~');
      });
    });

    test.it('cd ~', function () {
      execCommand(body, 'cd links');
      execCommand(body, 'cd ~');
      execCommand(body, 'pwd');
      body.getText().then((txt) => {
        assert.include(txt, '\n~');
      });
    });
  });

  test.describe('#cat', function () {
    test.it('cat about.txt', function () {
      execCommand(body, 'cat about.txt');
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'cat about.txt');
        assert.include(txt, 'personal website');
      });
    });
  });

  test.describe('#whoami', function () {
    test.it('whoami', function () {
      execCommand(body, 'whoami');
      terminalOutput.getText().then((txt) => {
        assert.include(txt, '\nguest');
      });
    });
  });

  test.describe('#ls', function () {
    test.it('ls links', function () {
      execCommand(body, 'ls links');
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'gibson - soundings');
      });
    });

    test.it('ls with no arguments', function () {
      execCommand(body, 'ls');
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'about.txt');
      });
    });

    test.it('ls with multiple arguments', function () {
      execCommand(body, 'ls links .');
      terminalOutput.getText().then((txt) => {
        assert.include(txt, 'about.txt');
        assert.include(txt, 'gibson - soundings');
      });
    });
  });
});

test.describe('Misc. Features', function () {
  let driver;
  let input;
  let body;
  let terminalOutput;
  test.before(function () {
    this.timeout(10000);
    driver = new Builder().forBrowser('firefox').build();
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
      body.sendKeys('c', Key.TAB, Key.TAB);
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
