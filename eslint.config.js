import configs from '@hidoo/eslint-config';
import prettierConfig from '@hidoo/eslint-config/+prettier';
import compatibilityConfig from '@hidoo/eslint-config/+compatibility';
import nodeConfig from '@hidoo/eslint-config/+node';
import mochaConfig from '@hidoo/eslint-config/+mocha';

export default [
  ...configs,
  prettierConfig,
  compatibilityConfig,
  {
    files: [
      'src/server/**/*.js',
      'task/**/*.js',
      '**/*.spec.js',
      '**/*.test.js',
      'config.js',
      'gulpfile.js',
      'index.cjs'
    ],
    ...nodeConfig,
    rules: {
      ...nodeConfig.rules,
      'n/file-extension-in-import': ['error', 'always']
    }
  },

  {
    files: ['index.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        module: true,
        require: true,
        process: true,
        __dirname: true
      }
    }
  },

  // for test files
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    ...mochaConfig
  },
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    rules: {
      'max-len': 'off',
      'no-magic-numbers': 'off'
    }
  },

  // for this file
  {
    files: ['eslint.config.js'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  },

  // ignore files
  {
    ignores: ['node_modules/*', 'kss-assets/js/*', 'example/*']
  }
];
