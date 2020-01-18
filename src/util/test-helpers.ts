const { Directory } = require('../FileStructure');
const Shell = require('../Shell/Shell');

export const testShellFactory = () => {
  const testFileStructure = new Directory('~', null);
  return new Shell(testFileStructure);
};