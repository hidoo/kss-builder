import AppearanceSwitcher from './lib/AppearanceSwitcher.js';
import * as string from './lib/util/string.js';

/**
 * Default options for StyleGuide
 *
 * @typedef {Object} defaultOptions
 * @property {String} classNameActive - state class name when active
 * @property {String} classNameCurrent - state class name when current
 */
const defaultOptions = {
  classNameActive: 'is-kss-active',
  classNameCurrent: 'is-kss-current'
};

/**
 * StyleGuide
 */
export default class StyleGuide {
  /**
   * constructor
   *
   * @param {defaultOptions} options options
   */
  constructor(options = {}) {
    this.element = document.querySelector('.kss-root');

    if (!this.element) {
      throw new Error('".kss-root" is not found.');
    }

    this.options = {
      ...defaultOptions,
      ...options
    };

    this.enableDrawer();
    this.enableThemeSwitcher('.js-kss-theme-switcher');
    this.enableExampleSwitcher('.js-kss-example-switcher');
    this.enableExpandSwitcher('.js-kss-expand-switcher');
    this.enableSmoothScroll();
  }

  /**
   * enable drawer
   *
   * @return {StyleGuide}
   */
  enableDrawer() {
    const className = 'js-kss-drawer';
    const { classNameActive } = this.options;
    const element = this.element.querySelector(`.${className}`);

    if (!element) {
      return this;
    }

    element.addEventListener('click', (event) => {
      const target = event.target;
      const isOpen = element.classList.contains(classNameActive);
      const fireOnDrawer = target.matches(
        `.${className}__drawer, .${className}__drawer *`
      );
      const fireOnToggle = target.matches(
        `.${className}__toggle, .${className}__toggle *`
      );

      // When drawer opened and click event triggered outside of the drawer
      if (isOpen && !fireOnDrawer) {
        element.classList.remove(classNameActive);
        event.preventDefault();
      }

      // when event triggered from toggle element
      if (fireOnToggle) {
        if (isOpen) {
          element.classList.remove(classNameActive);
        } else {
          element.classList.add(classNameActive);
        }
        event.preventDefault();
      }
    });

    return this;
  }

  /**
   * enable theme switcher
   *
   * @param {String} selector selector for switcher ui element
   * @return {StyleGuide}
   */
  enableThemeSwitcher(selector = '') {
    const element = this.element.querySelector(selector);

    if (!element) {
      return this;
    }

    const attr = 'kss-theme-value';
    const key = string.kebabToCamel(attr);
    const buttons = Array.from(element.querySelectorAll(`[data-${attr}]`));
    const values = buttons.map((button) => button.dataset[key]);
    const { classNameCurrent } = this.options;
    const switcher = new AppearanceSwitcher(this.element, {
      type: 'theme',
      values
    });

    element.addEventListener('click', (event) => {
      if (event.target.matches(`[data-${attr}], [data-${attr}] *`)) {
        const index = values.indexOf(
          event.target.closest(`[data-${attr}]`).dataset[key]
        );
        // eslint-disable-next-line no-magic-numbers
        const next = values[(index + 1) % values.length];

        switcher.switch(next);

        buttons.forEach((bt) => {
          if (bt.dataset[key] === next) {
            bt.classList.add(classNameCurrent);
          } else {
            bt.classList.remove(classNameCurrent);
          }
        });
      }
    });

    if (switcher.restore()) {
      buttons.forEach((bt) => {
        const className = switcher.className(bt.dataset[key]);

        if (this.element.classList.contains(className)) {
          bt.classList.add(classNameCurrent);
        } else {
          bt.classList.remove(classNameCurrent);
        }
      });
    }

    return this;
  }

  /**
   * enable example switcher
   *
   * @param {String} selector selector for switcher ui element
   * @return {StyleGuide}
   */
  enableExampleSwitcher(selector = '') {
    const element = this.element.querySelector(selector);

    if (!element) {
      return this;
    }

    const attr = 'kss-example-value';
    const key = string.kebabToCamel(attr);
    const buttons = Array.from(element.querySelectorAll(`[data-${attr}]`));
    const values = buttons.map((button) => button.dataset[key]);
    const { classNameCurrent } = this.options;
    const switcher = new AppearanceSwitcher(this.element, {
      type: 'example',
      values
    });

    element.addEventListener('click', (event) => {
      if (event.target.matches(`[data-${attr}], [data-${attr}] *`)) {
        const button = event.target.closest(`[data-${attr}]`);
        const next = button.dataset[key];

        switcher.switch(next);

        buttons.forEach((bt) => {
          if (bt.dataset[key] === next) {
            bt.classList.add(classNameCurrent);
          } else {
            bt.classList.remove(classNameCurrent);
          }
        });
        event.preventDefault();
      }
    });

    if (switcher.restore()) {
      buttons.forEach((bt) => {
        const className = switcher.className(bt.dataset[key]);

        if (this.element.classList.contains(className)) {
          bt.classList.add(classNameCurrent);
        } else {
          bt.classList.remove(classNameCurrent);
        }
      });
    }

    return this;
  }

  /**
   * enable expand switcher
   *
   * @param {String} selector selector for switcher ui element
   * @return {StyleGuide}
   */
  enableExpandSwitcher(selector = '') {
    const element = this.element.querySelector(selector);

    if (!element) {
      return this;
    }

    const attr = 'kss-expand-value';
    const key = string.kebabToCamel(attr);
    const buttons = Array.from(element.querySelectorAll(`[data-${attr}]`));
    const values = ['true', 'false'];
    const { classNameCurrent } = this.options;
    const switcher = new AppearanceSwitcher(this.element, {
      type: 'expand',
      values
    });

    element.addEventListener('click', (event) => {
      if (event.target.matches(`[data-${attr}], [data-${attr}] *`)) {
        const button = event.target.closest(`[data-${attr}]`);

        if (button.classList.contains(classNameCurrent)) {
          switcher.switch('false');
          button.classList.remove(classNameCurrent);
        } else {
          switcher.switch('true');
          button.classList.add(classNameCurrent);
        }
      }
    });

    if (switcher.restore()) {
      buttons.forEach((bt) => {
        const className = switcher.className(bt.dataset[key]);

        if (this.element.classList.contains(className)) {
          bt.classList.add(classNameCurrent);
        } else {
          bt.classList.remove(classNameCurrent);
        }
      });
    }

    return this;
  }

  /**
   * enable smooth scroll
   *
   * @return {StyleGuide}
   */
  enableSmoothScroll() {
    const className = 'js-kss-smooth-scroll';
    const { classNameCurrent } = this.options;

    this.element.addEventListener('click', (event) => {
      if (event.target.matches(`.${className}, .${className} *`)) {
        const target = event.target.closest(`.${className}`);
        const hash = target.hash;
        const to = document.querySelector(hash);

        if (!to) {
          return;
        }

        to.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        history.pushState('', '', hash);

        unsetCurrentAll();
        setCurrent(to);

        event.preventDefault();
      }
    });

    /**
     * set current class name
     *
     * @param {HTMLElement} element element
     * @return {void}
     */
    function setCurrent(element) {
      const node = element.parentNode ? element.parentElement : element;

      node.classList.add(classNameCurrent);
    }

    /**
     * unset current class name
     *
     * @param {HTMLElement} element element
     * @return {void}
     */
    function unsetCurrent(element) {
      const node = element.parentNode ? element.parentElement : element;

      node.classList.remove(classNameCurrent);
    }

    /**
     * unset all current class name
     *
     * @return {void}
     */
    function unsetCurrentAll() {
      const sections = Array.from(
        document.querySelectorAll(`[id^="kss-section-"]`)
      );

      sections.forEach(unsetCurrent);
    }

    return this;
  }
}
