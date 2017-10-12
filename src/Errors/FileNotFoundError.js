class FileNotFoundError extends Error {
  constructor(filepath) {
    const msg = filepath
      ? `${filepath} not found`
      : 'File not found';

    super(msg);
    this.filepath = filepath;
    this.date = new Date();
    this.name = this.constructor.name;

    Error.captureStackTrace(this, FileNotFoundError);
  }
}

module.exports = FileNotFoundError;
