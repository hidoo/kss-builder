const fs = require('node:fs/promises');
const path = require('node:path');
const { glob } = require('glob');
const Handlebars = require('handlebars');
const KssBuilderBase = require('kss/builder/base/index.js');

/**
 * A kss-node builder that takes input files and builds a style guide using
 * Handlebars templates.
 * + Fixed handling of Promise (Bluebird) in original KssBuilderHandlebars.
 * + original: <https://github.com/kss-node/kss-node/blob/master/builder/base/handlebars/kss_builder_base_handlebars.js>
 *
 * @class KssBuilderHandlebars
 */
class KssBuilderHandlebars extends KssBuilderBase {
  constructor() {
    super();

    // Store the version of the builder API that the builder instance is
    // expecting; we will verify this in loadBuilder().
    this.API = '3.0';

    this.addOptionDefinitions({
      mjs: {
        group: 'Style guide:',
        string: true,
        describe:
          'URL of a JavaScript file to include in the style guide as ES Modules'
      },
      'pseudo-class-transforms': {
        group: 'Style guide:',
        boolean: true,
        multiple: false,
        describe: 'Allow pseudo class transformation whether or not',
        default: true
      },
      'section-duplicates': {
        group: 'Style guide:',
        boolean: true,
        multiple: false,
        describe:
          'Allow section duplicates based on the reference whether or not',
        default: true
      }
    });
  }

  /**
   * extend buildGuide method in parent class
   * + disable the function of generating individual style guide for each item,
   *   added to version 3.0.0-beta.17 or later.
   *
   * @param {KssStyleGuide} styleGuide The KSS style guide in object format.
   * @param {Object} options The options necessary to use this helper method.
   * @return {Promise.<KssStyleGuide>} A `Promise` object resolving to a
   *   `KssStyleGuide` object.
   */
  async buildGuide(styleGuide, options) {
    // if set the value other than undefined to this.templates.item,
    // individual style guide will not be generated
    // https://github.com/kss-node/kss-node/blob/master/builder/base/kss_builder_base.js#L743
    if (typeof this.templates === 'undefined') {
      this.templates = {
        item: null
      };
    } else {
      this.templates.item = null;
    }

    return await super.buildGuide(styleGuide, options);
  }

  /* eslint-disable max-statements */
  /**
   * Allow the builder to preform pre-build tasks or modify the KssStyleGuide
   * object.
   *
   * The method can be set by any KssBuilderBase sub-class to do any custom
   * tasks after the KssStyleGuide object is created and before the HTML style
   * guide is built.
   *
   * @param {KssStyleGuide} styleGuide The KSS style guide in object format.
   * @return {Promise.<null>} A `Promise` object resolving to `null`.
   */
  async prepare(styleGuide) {
    // Call prepare method in parent class
    const sg = await super.prepare(styleGuide);
    let pkg = {};

    try {
      pkg = JSON.parse(
        await fs.readFile(path.resolve(process.cwd(), 'package.json'))
      );
    } catch (error) {
      console.error('Failed to load package.json:', error);
    }

    // Exclude section duplicates
    if (!this.options['section-duplicates']) {
      const sections = new Map();

      styleGuide.sections().forEach((section) => {
        sections.set(section.data.reference, section);
      });

      styleGuide.data.sections = [...sections.values()];
    }

    // Create new Handlebars instance
    this.Handlebars = Handlebars.create();

    // Load default helpers by dynamic import because module is ESM
    const { default: defaultHelpersRegister } = await import(
      '@hidoo/handlebars-helpers/register' // eslint-disable-line import/no-unresolved
    );

    // Register default helpers
    defaultHelpersRegister(this.Handlebars);

    // Register helpers
    this.Handlebars.registerHelper(
      'NODE_ENV',
      () => process.env.NODE_ENV || 'development'
    );
    this.Handlebars.registerHelper(
      'packageName',
      () => new this.Handlebars.SafeString(pkg.name || '')
    );
    this.Handlebars.registerHelper(
      'packageDescription',
      () => new this.Handlebars.SafeString(pkg.description || '')
    );
    this.Handlebars.registerHelper(
      'packageVersion',
      () => new this.Handlebars.SafeString(pkg.version || '')
    );
    this.Handlebars.registerHelper(
      'basename',
      (value) => new Handlebars.SafeString(path.basename(value) || '')
    );

    // Register partials
    const partialDir = path.join(__dirname, 'src', 'partials');
    const files = await glob(path.join(partialDir, '**/*.hbs'));

    await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(file, { encoding: 'utf8' });
        const name = path.basename(file, '.hbs');
        let prefix = path.dirname(file).replace(partialDir, '');

        if (prefix !== '') {
          prefix = `${prefix.replace(/^\//, '')}/`;
        }

        if (content && typeof content.toString === 'function') {
          this.Handlebars.registerPartial(
            `${prefix}${name}`,
            content.toString()
          );
        }
      })
    );

    // + Create a new destination directory.
    // + Load modules that extend Handlebars.
    await Promise.all([
      this.prepareDestination('kss-assets'),
      this.prepareExtend(this.Handlebars)
    ]);

    return sg;
  }
  /* eslint-enable max-statements */

  /**
   * Add html tag generated by KSS to context
   *
   * @param {Object} context Additional context to give to the template when
   *   it is rendered.
   * @return {void}
   */
  prepareContext(context) {
    super.prepareContext(context);

    // Create the HTML to load the optional ES Modules.
    if (typeof context.esmodules === 'undefined') {
      context.esmodules = '';

      for (const key in this.options.mjs) {
        if (Object.hasOwn(this.options.mjs, key)) {
          context.esmodules = `${context.esmodules}<script type="module" src="${this.options.mjs[key]}"></script>\n`;
        }
      }
    }
  }

  /**
   * Build the HTML files of the style guide given a KssStyleGuide object.
   *
   * @param {KssStyleGuide} styleGuide The KSS style guide in object format.
   * @return {Promise.<KssStyleGuide>} A `Promise` object resolving to a
   *   `KssStyleGuide` object.
   */
  async build(styleGuide) {
    const options = {};

    // Returns a promise to read/load a template provided by the builder.
    options.readBuilderTemplate = async (name) => {
      const contents = await fs.readFile(
        path.resolve(this.options.builder, `${name}.hbs`),
        { encoding: 'utf8' }
      );

      return this.Handlebars.compile(contents);
    };

    // Returns a promise to read/load a template specified by a section.
    options.readSectionTemplate = async (name, file) => {
      const content = await fs.readFile(file, { encoding: 'utf8' });

      this.Handlebars.registerPartial(name, content);
      return content;
    };

    // Returns a promise to load an inline template from markup.
    options.loadInlineTemplate = async (name, markup) =>
      await this.Handlebars.registerPartial(name, markup);

    // Returns a promise to load the data context given a template file path.
    options.loadContext = async (file) => {
      try {
        return JSON.parse(
          await fs.readFile(
            path.join(
              path.dirname(file),
              `${path.basename(file, path.extname(file))}.json`
            ),
            { encoding: 'utf8' }
          )
        );
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        return {};
      }
    };

    // Returns a promise to get a template by name.
    options.getTemplate = async (name) =>
      await this.Handlebars.compile(`{{> ${name}}}`);

    // Returns a promise to get a template's markup by name.
    options.getTemplateMarkup = async (name) =>
      await this.Handlebars.partials[name];

    // Renders a template and returns the markup.
    options.templateRender = (template, context) => template(context);

    // Converts a filename into a Handlebars partial name.
    // + Return the filename without the full path or the file extension.
    options.filenameToTemplateRef = (filename) =>
      path.basename(filename, path.extname(filename));

    options.templateExtension = 'hbs';
    options.emptyTemplate = '{{! Cannot be an empty string. }}';

    return await this.buildGuide(styleGuide, options);
  }
}

module.exports = KssBuilderHandlebars;
