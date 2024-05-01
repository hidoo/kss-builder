/**
 * Convert kebab-case to camel case
 *
 * @param {String} str kebab-case string
 * @return {String}
 */
export function kebabToCamel(str) {
  return str.replace(/-\w/g, (st) => st.replace(/-/, '').toUpperCase());
}
