'use strict';

var extend = require('deep-extend');

//ensure these exist without loading
require.resolve('hogan.js');
require.resolve('handlebars');

/**
 * Return a copyTplHogan function bound to a Generator instance.
 * The same as gen.fs.copyTpl but uses Hogan instead of ejs
 * @param {generator} A yeoman Generator instance
 */
function copyHoganFn(generator) {
  return function (from, to, context, tplSettings, options) {
    context = context || {};
    generator.fs.copy(from, to, extend(options || {}, {
      process: function (contents, filename) {
        return require('hogan.js').compile(contents.toString())
          .render(context);
      }
    }));
  };
}

/**
 * Return a writeHandlebars function bound to a Generator instance.
 * The same as gen.fs.copyTpl but uses handlebars instead of ejs
 * @param {generator} A yeoman Generator instance
 */
function copyHandlebarsFn(generator) {
  return function (from, to, context, tplSettings, options) {
    context = context || {};
    generator.fs.copy(from, to, extend(options || {}, {
      process: function (contents, filename) {
        return require('handlebars').compile(contents.toString())(context);
      }
    }));
  };
}

function appendHandlebarsFn(generator) {
  return function (from, to, context, options) {
    debugger;
    var contents = generator.fs.read(from);
    context = context || {};
    var str = require('handlebars').compile(contents.toString())(context);
    if (!generator.fs.exists(to)) {
      generator.fs.write(to, '');
    }
    generator.fs.append(to, str, extend(options || {}, {}) );
  };
}

module.exports = {

  /**
   * Injects some cool stuff into a yeoman generator
   * @param {generator} A yeoman Generator instance
   */
  inject(generator) {
    generator.fs.copyHogan = copyHoganFn(generator);
    generator.fs.copyHandlebars = copyHandlebarsFn(generator);
    generator.fs.appendHandlebars = appendHandlebarsFn(generator);
  }
};
