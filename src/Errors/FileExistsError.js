class FileExistsError extends Error {
  constructor(file) {
    const msg = file
      ? `${file.name} exists`
      : 'File exists';

    super(msg);
    this.file = file;
    this.date = new Date();
    this.name = this.constructor.name;

    Error.captureStackTrace(this, FileExistsError);
  }
}

module.exports = FileExistsError;
