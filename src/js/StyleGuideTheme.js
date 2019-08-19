import {hasClass, removeClass, addClass} from './classNames';

/**
 * StyleGuideTheme
 */
export default class StyleGuideTheme {

  /**
   * constructor
   * @param {HTMLElement} element target element
   */
  constructor(element) {
    if (!element) {
      throw new TypeError('Argument "element" is required.');
    }

    this.prefix = 'kss-theme';
    this.element = element;
  }

  /**
   * return valid theme type or not
   * @param {String} type type of switcher (one of 'theme' or 'example-theme')
   * @return {void}
   */
  validateType(type) {
    const valid = ['theme', 'example-theme'];

    if (typeof type !== 'string' || valid.indexOf(type) === -1) { // eslint-disable-line no-magic-numbers
      throw new TypeError(`Argument "type" must be one of ${valid.join(' or ')}.`);
    }
  }

  /**
   * theme to className
   * @param {String} type type of switcher
   * @param {String} theme theme name
   * @return {String}
   */
  toClassName(type = 'theme', theme) {
    this.validateType(type);

    if (typeof theme !== 'string' || theme === '') {
      throw new TypeError('Argument "theme" is not valid string.');
    }

    return `is-${type}-${theme}`;
  }

  /**
   * switch theme
   * @param {String} type type of switcher
   * @param {String} theme theme name
   * @return {Theme}
   */
  switch(type = 'theme', theme) {
    this.validateType(type);

    const className = this.toClassName(type, theme);
    const pattern = new RegExp(`^is-${type}-`);

    if (!hasClass(this.element, className)) {
      removeClass(this.element, pattern);
      addClass(this.element, className);
      window.localStorage.setItem(`${this.prefix}-${type}`, theme);
    }

    return this;
  }

  /**
   * restore theme
   * @param {String} type type of switcher
   * @return {Theme}
   */
  restore(type = 'theme') {
    this.validateType(type);

    const theme = window.localStorage.getItem(`${this.prefix}-${type}`);

    if (typeof theme === 'string' && theme !== '') {
      this.switch(type, theme);
    }

    return this;
  }
}
