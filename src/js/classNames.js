/**
 * get/set classNames
 *
 * @param {HTMLElement} element target element
 * @param {Array<String>} values list of classNames
 * @return {Array<String>}
 */
export default function classNames(element, values = []) {
  if (!element || !element.className) {
    throw new Error('Argument "element" is not valid.');
  }

  if (values && values.length && typeof values.join === 'function') {
    element.className = values.join('  ');
    return values;
  }
  return String(element.className).split(/\s+/);
}

/**
 * return has class or not
 *
 * @param {HTMLElement} element target element
 * @param {String} className target class name
 * @return {Boolean}
 */
export function hasClass(element, className = '') {
  return classNames(element).indexOf(className) !== -1; // eslint-disable-line no-magic-numbers
}

/**
 * add class
 *
 * @param {HTMLElement} element target element
 * @param {String} className target class name
 * @return {void}
 */
export function addClass(element, className = '') {
  const classes = classNames(element);

  classes.push(className);
  classNames(element, classes);
}

/**
 * remove class
 *
 * @param {HTMLElement} element target element
 * @param {String|RegExp} className target class name
 * @return {void}
 */
export function removeClass(element, className = '') {
  const classes = classNames(element);
  const newClasses = [];

  classes.forEach((cl) => {
    if (className instanceof RegExp) {
      if (!className.test(cl)) {
        newClasses.push(cl);
      }
    }
    else if (cl !== className) {
      newClasses.push(cl);
    }
  });

  classNames(element, newClasses);
}
