import gulp from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-sass';
import * as config from '../config.js';

// define main task
export const main = buildCss({
  name: 'css:main',
  src: `${config.path.srcCss}/main.scss`,
  dest: config.path.destCss,
  filename: 'main.css',
  compress: config.compress
});

// define watch task
export const watch = () => {
  gulp.watch([`./src/**/*.scss`, `${config.path.srcCss}/**/*.scss`], main);
};
