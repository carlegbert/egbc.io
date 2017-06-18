const { Key } = require('selenium-webdriver');


function execCommand(element, text) {
  const words = text.split(' ');
  words.forEach((word) => {
    element.sendKeys(word);
    element.sendKeys(Key.SPACE);
  });
  element.sendKeys(Key.ENTER);
}

module.exports.execCommand = execCommand;
