/**
 * import modules
 */
import browserSync from 'browser-sync';

/**
 * import modules - local
 */
import * as config from '../config';

/**
 * return start local server task
 *
 * @return {Function<Promise>}
 */
const server = () => new Promise((resolve, reject) => {
  const bs = browserSync.create('default'),
        {host, port, protocol, open} = config.serverOptions;

  const options = {
    host,
    port,
    https: protocol === 'https',
    open,
    ui: false,
    server: {
      baseDir: config.path.dest,
      directory: true
    }
  };

  bs.init(options, (error, instance) => {
    if (error) {
      reject(error);
    }
    resolve(instance);
  });

  bs.watch(`${config.path.dest}/**/*.{html,css,svg}`)
    .on('add', (filepath) => bs.reload(filepath))
    .on('change', (filepath) => bs.reload(filepath));
});

export default server;
