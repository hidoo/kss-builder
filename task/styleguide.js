/**
 * import modules
 */
import {resolve} from 'path';
import gulp from 'gulp';
import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';

/**
 * import modules - local
 */
import * as config from '../config';

// define main task
export const main = buildStyleguide({
  name: 'styleguide:build',
  src: `${config.path.srcStyleguide}`,
  dest: `${config.path.destStyleguide}`,
  homepage: resolve(__dirname, '../README.md'),
  builder: resolve(__dirname, '../')
});

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

