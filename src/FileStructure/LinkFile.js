const BaseFile = require('./BaseFile');

/**
 * @extends {BaseFile}
 */
class LinkFile extends BaseFile {
  /**
   * @constructor
   * @param {string} name
   * @param {Directory} parentRef
   * @param {string} url
   */
  constructor(name, parentRef, url) {
    super(name, parentRef);
    /**
     * @type {string}
     */
    this.url = url;
  }

  /**
   * Returns HTML-formatted filename
   * @return {string}
   */
  getLsEntry() {
    return `<span class="inline link"><a href="${this.url}" target="_blank">${this.name}<a></span>`;
  }
}

module.exports = LinkFile;
