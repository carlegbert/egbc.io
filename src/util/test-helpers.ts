import Shell from '../Shell'
import Directory from '../FileStructure/Directory'

export const testShellFactory = (): Shell => {
  const testFileStructure = new Directory('~', null)
  return new Shell(testFileStructure)
}
