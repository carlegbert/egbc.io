export enum FSErrors {
  DirectoryNotFound = '__directory_not_found_',
}

export class DirectoryNotFoundError extends Error {
  constructor(...args: any) {
    super(...args)
    this.name = FSErrors.DirectoryNotFound
  }
}
