import StyleGuideTheme from './StyleGuideTheme';
import {hasClass, removeClass, addClass} from './classNames';
import {default as matches} from './elementMatches';

/**
 * StyleGuide
 */
export default class StyleGuide {

  /**
   * constructor
   */
  constructor() {
    this.element = document.querySelector('.kss-document');

    if (!this.element) {
      throw new Error('".kss-document" is not found.');
    }

    this.theme = new StyleGuideTheme(this.element);

    this.enableDrawer();
    this.enableThemeSwitcher('.js-kss-theme-switcher', 'theme');
    this.enableThemeSwitcher('.js-kss-example-theme-switcher', 'example-theme');
    this.enableExampleExpander();
    this.enableSmoothScroll();
  }

  /**
   * enable theme switcher
   *
   * @param {String} selector selector string
   * @param {String} type type of switcher
   * @return {StyleGuide}
   */
  enableThemeSwitcher(selector = '', type = '') {
    this.theme.restore(type);

    const element = this.element.querySelector(selector);

    if (!element) {
      return this;
    }

    const attr = 'data-kss-switch-theme';
    const buttons = Array.prototype.slice.call(
      element.querySelectorAll(`[${attr}]`)
    );

    buttons.forEach((button) => {
      const theme = button.getAttribute(attr);
      const className = this.theme.toClassName(type, theme);

      button.addEventListener('click', (event) => {
        this.theme.switch(type, theme);
        buttons.forEach((bt) => removeClass(bt, 'is-current'));
        addClass(button, 'is-current');
        event.preventDefault();
      });

      if (hasClass(this.element, className)) {
        addClass(button, 'is-current');
      }
    });

    return this;
  }

  /**
   * enable drawer
   *
   * @return {StyleGuide}
   */
  enableDrawer() {
    const element = this.element.querySelector('.js-kss-styleguide-drawer');

    if (!element) {
      return this;
    }

    const eventName = 'ontouchstart' in window ? 'touchstart' : 'click';
    const classNameOpen = 'is-open';
    const selectorDrawer = '.js-kss-styleguide-drawer__drawer';
    const selectorToggle = '.js-kss-styleguide-drawer__toggle';

    element.addEventListener(eventName, (event) => {
      const target = event.target;
      const fromDrawerEvent = matches(target, `${selectorDrawer}, ${selectorDrawer} *`);
      const fromToggleEvent = matches(target, `${selectorToggle}, ${selectorToggle} *`);
      const isOpen = hasClass(element, classNameOpen);

      // when drawer open and event triggered from drawer element
      if (isOpen && !fromDrawerEvent) {
        removeClass(element, classNameOpen);
        event.preventDefault();
      }

      // when event triggered from toggle element
      if (fromToggleEvent) {
        if (isOpen) {
          removeClass(element, classNameOpen);
        }
        else {
          addClass(element, classNameOpen);
        }
        event.preventDefault();
      }
    });

    return this;
  }

  /**
   * enable example expander
   *
   * @return {StyleGuide}
   */
  enableExampleExpander() {
    const element = this.element.querySelector('.js-kss-example-expand');

    if (!element) {
      return this;
    }

    const classNameExpanded = 'is-expanded';
    const key = 'kss-exmple-expand';
    const initial = window.localStorage.getItem(key);

    if (initial === 'expand') {
      addClass(this.element, classNameExpanded);
    }

    element.addEventListener('click', (event) => {
      const isOpen = hasClass(this.element, classNameExpanded);

      if (isOpen) {
        removeClass(this.element, classNameExpanded);
        window.localStorage.setItem(key, '');
      }
      else {
        addClass(this.element, classNameExpanded);
        window.localStorage.setItem(key, 'expand');
      }
      event.preventDefault();
    });

    return this;
  }

  /**
   * enable smooth scroll
   *
   * @return {StyleGuide}
   */
  enableSmoothScroll() {
    const selectorLink = '.js-kss-smooth-scroll';
    const offset = 35;
    const toolBar = document.querySelector('#js-kss-tool-bar');

    this.element.addEventListener('click', (event) => {
      const target = event.target;
      const hash = target.hash;

      if (matches(target, `${selectorLink}, ${selectorLink} *`) && hash !== '') {
        const to = document.querySelector(hash);

        if (to) {
          const {top} = to.getBoundingClientRect();
          const toolBarHeight = toolBar ? toolBar.getBoundingClientRect().height : 0; // eslint-disable-line no-magic-numbers
          const offsetTop = window.pageYOffset;

          window.scrollTo({
            top: top + offsetTop - offset - toolBarHeight,
            left: 0,
            behavior: 'smooth'
          });

          removeAllPreviousCurrent('is-current');
          addClass(to, 'is-current');

          event.preventDefault();
        }
      }
    });

    /**
     * remove all previous .is-current
     *
     * @param {String} className selector string
     * @return {void}
     */
    function removeAllPreviousCurrent(className = 'is-current') {
      const sections = Array.prototype.slice.call(
        document.querySelectorAll(`[id^="kss-section-"].${className}`)
      );

      sections.forEach((section) => removeClass(section, className));
    }

    return this;
  }
}
