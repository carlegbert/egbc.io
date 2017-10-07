/* eslint-disable prefer-arrow-callback, func-names */

const { By } = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const { assert } = require('chai');
const { configuredDriver, execCommand } = require('./TestUtils');

test.describe('Shell Commands', function () {
  const driver = configuredDriver();
  let body;
  let terminalOutput;

  test.before(function () {
    this.timeout(10000);
    driver.get('http://localhost:8080');
    body = driver.findElement(By.css('body'));
    terminalOutput = driver.findElement(By.id('terminal-output'));
  });

  test.after(function () {
    driver.quit();
  });

  test.afterEach(function () {
    terminalOutput.getText().then((txt) => {
      assert.notMatch(txt, /<.*>.*<\/.*>/, 'HTML tags present in output');
    });
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
