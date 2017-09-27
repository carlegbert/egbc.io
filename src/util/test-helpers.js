const { Directory } = require('../FileStructure');
const Shell = require('../Shell/Shell');

const testFileStructure = new Directory('~', null);
const testShell = new Shell(testFileStructure);

module.exports = {
  testFileStructure,
  testShell,
};
