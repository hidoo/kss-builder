import path from 'node:path';
import url from 'node:url';
import gulp from 'gulp';
import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';
import * as config from '../config.js';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

// define main task
export const main = buildStyleguide({
  name: 'styleguide:build',
  src: config.path.srcStyleguide,
  dest: config.path.destStyleguide,
  homepage: path.resolve(dirname, '../README.md'),
  builder: path.resolve(dirname, '../')
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
