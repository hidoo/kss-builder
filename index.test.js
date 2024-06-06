import assert from 'node:assert';
import childProcess from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

describe('@hidoo/kss-builder', () => {
  let dirname = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
  });

  describe('build styleguide via gulp task.', () => {
    let workDir = null;
    let destDir = null;

    before(() => {
      workDir = dirname;
      destDir = path.resolve(workDir, 'example', 'build');
    });

    afterEach(async () => {
      await fs.rm(destDir, { recursive: true });
      await fs.mkdir(destDir);
    });

    it('should generate files to ./example/build directory.', async () => {
      process.chdir(workDir);

      await new Promise((resolve, reject) => {
        childProcess.exec('npm run build', (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      const files = await glob(`${destDir}/**/*`, { nodir: true });
      const actual = files
        .map((filepath) => filepath.replace(destDir, ''))
        .sort();

      assert.deepEqual(actual, [
        '/index.html',
        '/kss-assets/css/main.css',
        '/kss-assets/css/main.min.css',
        '/kss-assets/css/main.min.css.br',
        '/kss-assets/css/main.min.css.gz',
        '/kss-assets/images/favicon.ico',
        '/kss-assets/images/favicon.svg',
        '/kss-assets/images/touchicon.png',
        '/kss-assets/js/main.js',
        '/kss-assets/js/main.js.br',
        '/kss-assets/js/main.js.gz',
        '/section-kss-bar.html',
        '/section-kss-c-box.html',
        '/section-kss-c-button.html',
        '/section-kss-c-document.html',
        '/section-kss-c-icon.html',
        '/section-kss-c-list.html',
        '/section-kss-c-text.html',
        '/section-kss-document.html',
        '/section-kss-example.html',
        '/section-kss-heading.html',
        '/section-kss-layout.html',
        '/section-kss-navi.html',
        '/section-kss-section.html',
        '/section-kss-u.html',
        '/section-mixin.html'
      ]);
    });
  });
});
