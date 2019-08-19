/**
 * import modules
 */
import {resolve} from 'path';
import gulp from 'gulp';
import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';
import copy from '@hidoo/gulp-task-copy';

/**
 * import modules - local
 */
import * as config from '../config';

// define build task
export const build = buildStyleguide({
  name: 'styleguide:build',
  src: `${config.path.srcStyleguide}`,
  dest: `${config.path.destStyleguide}`,
  builder: resolve(__dirname, '../')
});

// define prebuild task
export const prebuild = copy({
  name: 'styleguide:prebuild',
  src: `./*.md`,
  dest: config.path.srcStyleguide
});

// define main task
export const main = gulp.series(
  prebuild,
  build
);

// define watch task
export const watch = () => {
  gulp.watch(
    [
      `./*.md`,
      `${config.path.srcStyleguide}/*.css`,
      `./index.hbs`,
      `./src/**/*.hbs`,
      `./src/**/*.js`
    ],
    main
  );
};

