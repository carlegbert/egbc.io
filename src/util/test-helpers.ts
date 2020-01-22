import Shell from '../Shell'
import { Directory } from '../fs'

export const testShellFactory = (): Shell => {
  const testFileStructure = new Directory('~', null)
  return new Shell(testFileStructure)
}
