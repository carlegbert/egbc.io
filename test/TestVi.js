/* eslint-disable prefer-arrow-callback, func-names */

const { Builder, By } = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const assert = require('chai').assert;
const { execCommand } = require('./TestUtils');

test.describe('Vi', function () {
  let driver;
  let body;
  let viBuffer;

  test.before(function () {
    this.timeout(10 * 1000);
    driver = new Builder().forBrowser('firefox').build();
    driver.get('http://localhost:8080');
    body = driver.findElement(By.css('body'));
    execCommand(body, 'echo xxxxxxxxxxxxxxxx > testfile');
    execCommand(body, 'echo xxxxxxxxxxxxxxxx >> testfile');
    execCommand(body, 'echo xxxxxxxxxxxxxxxx >> testfile');
    execCommand(body, 'echo xxxxxxxxxxxxxxxx >> testfile');
    execCommand(body, 'echo xxxxxxxxxxxxxxxx >> testfile');
    viBuffer = driver.findElement(By.id('terminal-output'));
  });

  test.after(function () {
    driver.quit();
  });

  test.describe('# non-numbered normal mode movement', function () {
    test.before(function () {
      execCommand(body, 'vi testfile');
    });

    test.after(function () {
      execCommand(body, ':q!');
    });

    test.it('h', function () { });
    test.it('l', function () { });
    test.it('j', function () { });
    test.it('k', function () { });

    test.it('0', function () { });
    test.it('$', function () { });

    // test.it('w', function () { });
    // test.it('W', function () { });
    // test.it('b', function () { });
    // test.it('B', function () { });
    // test.it('e', function () { });
    // test.it('E', function () { });
  });

  test.describe('# numbered normal mode movement', function () {
    test.before(function () {
      execCommand(body, 'vi testfile');
    });

    test.after(function () {
      execCommand(body, ':q!');
    });

    test.it('h', function () { });
    test.it('l', function () { });
    test.it('j', function () { });
    test.it('k', function () { });

    test.it('0', function () { });
    test.it('$', function () { });

    // test.it('w', function () { });
    // test.it('W', function () { });
    // test.it('b', function () { });
    // test.it('B', function () { });
    // test.it('e', function () { });
    // test.it('E', function () { });
  });

});
