import cat from './cat'
import cd from './cd'
import clear from './clear'
import echo from './echo'
import help from './help'
import ls from './ls'
import mkdir from './mkdir'
import pwd from './pwd'
import touch from './touch'
import whoami from './whoami'
import vi from './vi'
import { Program } from './types'

const programs: { [key: string]: Program } = {
  cat,
  cd,
  clear,
  echo,
  help,
  ls,
  mkdir,
  pwd,
  touch,
  whoami,
  vi,
}

export default programs
