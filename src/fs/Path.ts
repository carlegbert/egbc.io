/**
 * Class representing a path to a file
 */
export default class Path {
  public length: number

  public arr: string[]

  constructor(patharg: string | string[]) {
    if (typeof patharg === 'string') {
      this.arr = patharg.split('/')
    } else {
      this.arr = patharg.slice(0)
    }
    // don't let arr or str be empty
    if (this.arr.length === 0 || patharg === '') {
      this.arr = ['.']
    }

    this.length = this.arr.length
  }

  /**
   * Helper for traversing Path object
   */
  next(): Path {
    return new Path(this.arr.slice(1))
  }

  lowestDir(): string {
    return this.arr[0]
  }

  basename(): string {
    return this.arr.slice(-1)[0]
  }

  highestDir(): Path | null {
    if (this.length <= 1) return null
    return new Path(this.arr.slice(0, -1))
  }
}
