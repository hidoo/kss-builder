/* eslint no-magic-numbers: off, no-process-env: off */

/**
 * import modules
 */
import {Command} from 'commander';

/**
 * adjust NODE_ENV
 * + It use 'development', when process.env.NODE_ENV is not valid value.
 * + Otherwise use the value of process.env.NODE_ENV as it is.
 */
if (typeof process.env.NODE_ENV !== 'string' || process.env.NODE_ENV === '') {
  process.env.NODE_ENV = 'development';
}

/**
 * parse cli options
 *
 * @type {Command}
 */
const cli = new Command()
  .option('--host <ip>', 'set ip.')
  .option('--port <number>', 'set port.')
  .option('--protocol <scheme>', 'set protocol.')
  .option('--open [type]', 'open browser automatically or not.')
  .option('--compress', 'enable file compress or not.')
  .parse(process.argv);

/**
 * cli option values
 *
 * @return {Object}
 */
const opts = cli.opts();

/**
 * dev server options
 *
 * @type {Object}
 */
export const serverOptions = {
  host: String(opts.host || process.env.SERVER_HOST || '0.0.0.0'),
  port: Number(opts.port || process.env.SERVER_PORT) || 8000,
  protocol: String(opts.protocol || process.env.SERVER_PROTOCOL || 'http'),
  open: opts.open || process.env.SERVER_OPEN || false
};

/**
 * compress flag
 * + It is true, when process.env.NODE_ENV is not 'development'.
 *
 * @type {Boolean}
 */
export const compress = opts.compress || process.env.NODE_ENV !== 'development' || false;

/**
 * package.json
 *
 * @type {Object}
 */
export {default as pkg} from './package.json';

/**
 * path settings
 *
 * @type {Object}
 */
export const path = {

  // base
  src: './src',
  dest: './example/build',

  // source details
  get srcCss() { return `${this.src}/css`; },
  get srcJs() { return `${this.src}/js`; },
  get srcStyleguide() { return `./kss-assets/css`; },

  // destinaion details
  get destCss() { return `./kss-assets/css`; },
  get destJs() { return `./kss-assets/js`; },
  get destStyleguide() { return `${this.dest}`; }
};
