import gulp from 'gulp';
import { swc } from '@rollup/plugin-swc';
import buildJs from '@hidoo/gulp-task-build-js-rollup';
import * as config from '../config.js';

// suffix of chunk files
const chunkFileSuffix = process.env.NODE_ENV === 'production' ? '-[hash]' : '';

// define main task
export const main = buildJs({
  name: 'js:main',
  src: `${config.path.srcJs}/main.js`,
  dest: config.path.destJs,
  filename: null,
  suffix: '',
  compress: config.compress,
  inputOptions: {
    plugins(setting) {
      if (setting.name === 'babel') {
        return {
          name: 'swc',
          factory: swc,
          config: {}
        };
      }
      return setting;
    }
  },
  outputOptions: [
    {
      format: 'es',
      entryFileNames: '[name].js',
      chunkFileNames: `module/[name]${chunkFileSuffix}.js`,
      sourcemap: 'inline'
    }
  ]
});

// define watch task
export const watch = () => {
  gulp.watch([`${config.path.srcJs}/**/*.js`], main);
};
