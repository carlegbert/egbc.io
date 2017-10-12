class FileNotFound extends Error {
  constructor(filepath) {
    const msg = filepath
      ? `${filepath} not found`
      : 'File not found';

    super(msg);
    this.filepath = filepath;
    this.date = new Date();

    Error.captureStackTrace(this, FileNotFound);
  }
}

module.exports = FileNotFound;
