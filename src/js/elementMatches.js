/**
 * ponyfill of Element.matches
 *
 * @param {HTMLElement} element target element
 * @param {String} selector selector string
 * @return {Boolean}
 */
export default function elementMatches(element, selector = '') {
  if (!element) {
    throw new TypeError('Argument "element" is required.');
  }

  if (!Element.prototype.matches) {
    if (typeof Element.prototype.msMatchesSelector === 'function') {
      return element.msMatchesSelector(selector);
    }
    else if (typeof Element.prototype.webkitMatchesSelector === 'function') {
      return element.webkitMatchesSelector(selector);
    }
  }
  return element.matches(selector);
}
