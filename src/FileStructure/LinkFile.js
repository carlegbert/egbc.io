import TxtFile from './TxtFile';

/**
 * @extends {TxtFile}
 */
export default class LinkFile extends TxtFile {
  /**
   * @constructor
   * @param {string} name
   * @param {DirFile} parentRef
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
