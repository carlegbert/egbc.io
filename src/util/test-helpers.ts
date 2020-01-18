import Shell from '../Shell'

const { Directory } = require('../FileStructure')

export const testShellFactory = () => {
  const testFileStructure = new Directory('~', null)
  return new Shell(testFileStructure)
}
