import fs from 'node:fs/promises';
import gulp from 'gulp';
import chalk from 'chalk';
import * as config from './config.js';
import * as css from './task/css.js';
import * as js from './task/js.js';
import * as styleguide from './task/styleguide.js';
import server from './task/server.js';

// print values of config
console.log(
  chalk.gray.italic(`/**
 * ${config.pkg.name.toUpperCase()}
 * ${config.pkg.description || '(no description)'}
 *
 * @version ${config.pkg.version}
 * @type {String}  NODE_ENV ${chalk.green(`'${process.env.NODE_ENV}'`)}
 * @type {Boolean} compress ${chalk.yellow(config.compress)}
 */
`)
);

/**
 * clean dest task
 *
 * @return {Promise}
 */
export const clean = async () => {
  try {
    if (await fs.stat(config.path.dest)) {
      await fs.rm(config.path.dest, { recursive: true });
    }
  } catch ({ message }) {
    console.warn(message);
  }
};

/**
 * server task
 *
 * @type {Function}
 */
export { default as server } from './task/server.js';

/**
 * build task
 *
 * @return {Function}
 */
export const build = gulp.series(css.main, js.main, styleguide.main);

/**
 * file observe task
 *
 * @return {Function}
 */
export const watch = gulp.parallel(css.watch, js.watch, styleguide.watch);

/**
 * default task
 *
 * @return {Function}
 */
export default gulp.series(clean, build, gulp.parallel(server, watch));
