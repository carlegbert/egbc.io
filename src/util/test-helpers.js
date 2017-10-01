const { Directory } = require('../FileStructure');
const Shell = require('../Shell/Shell');

const testShellFactory = () => {
  const testFileStructure = new Directory('~', null);
  return new Shell(testFileStructure);
};

module.exports = {
  testShellFactory,
};
