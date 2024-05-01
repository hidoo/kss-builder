/**
 * Default options
 *
 * @typedef {Object} defaultOptions
 * @property {String} type appearance type
 * @property {Array<String>} values appearance values
 */
const defaultOptions = {
  type: 'theme',
  values: ['light', 'dark', 'system']
};

/**
 * AppearanceSwitcher
 */
export default class AppearanceSwitcher {
  /**
   * constructor
   *
   * @param {HTMLElement} element ui element
   * @param {defaultOptions} options options
   */
  constructor(element, options = {}) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('Argument #1 "element" must be HTMLElement.');
    }

    const opts = {
      ...defaultOptions,
      ...options
    };

    if (typeof opts.type !== 'string' || opts.type === '') {
      throw new TypeError('"options.type" must be valid string.');
    }
    if (!Array.isArray(opts.values)) {
      throw new TypeError('"options.values" must be array.');
    }

    this.element = element;
    this.options = opts;
    this.prefix = 'kss';
  }

  /**
   * return value is valid whether or not
   *
   * @param {String} value value
   * @return {AppearanceSwitcher}
   */
  validate(value) {
    if (!this.options.values.includes(value)) {
      throw new TypeError(
        `Invalid value "${value}" specified. (Allow one of ${this.options.values.join(' or ')})`
      );
    }

    return this;
  }

  /**
   * value to className
   *
   * @param {String} value value
   * @return {String}
   */
  className(value) {
    this.validate(value);

    return `is-kss-${this.options.type}-${value}`;
  }

  /**
   * switch value
   *
   * @param {String} value value
   * @return {AppearanceSwitcher}
   */
  switch(value) {
    this.validate(value);

    const className = this.className(value);

    if (!this.element.classList.contains(className)) {
      this.options.values.forEach((val) => {
        this.element.classList.remove(this.className(val));
      });
      this.element.classList.add(className);
      this.save(value);
    }

    return this;
  }

  /**
   * save value
   *
   * @param {String} value value
   * @return {Boolean}
   */
  save(value) {
    this.validate(value);

    window.localStorage.setItem(`${this.prefix}-${this.options.type}`, value);

    return true;
  }

  /**
   * restore value
   *
   * @return {Boolean}
   */
  restore() {
    const value = window.localStorage.getItem(
      `${this.prefix}-${this.options.type}`
    );

    if (typeof value === 'string' && value !== '') {
      this.switch(value);
      return true;
    }

    return false;
  }
}
