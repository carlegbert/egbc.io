class InvalidFileError extends Error {
  constructor(filepath) {
    const msg = filepath
      ? `Invalid file ${filepath}`
      : 'Invalid file';

    super(msg);
    this.filepath = filepath;
    this.date = new Date();
    this.name = this.constructor.name;

    Error.captureStackTrace(this, InvalidFileError);
  }
}

module.exports = InvalidFileError;
