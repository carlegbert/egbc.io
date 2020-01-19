import cat from './cat'
import cd from './cd'
import clear from './clear'
import echo from './echo'
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
  ls,
  mkdir,
  pwd,
  touch,
  whoami,
  vi,
}

export default programs
