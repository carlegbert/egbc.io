const { Key } = require('selenium-webdriver');


function execCommand(element, text) {
  text.split('').forEach((ch) => {
    const toSend = ch === ' ' ? Key.SPACE : ch;
    element.sendKeys(toSend);
  });
  element.sendKeys(Key.ENTER);
}

module.exports.execCommand = execCommand;
