/**
 * View Engine Configuration (sails.config.views)
 * http://sailsjs.org/#!/documentation/concepts/Views
 */

module.exports.views = {

  /**
   * Choose one wisely (not limited to these tho):
   * ejs, jade, handlebars, mustache underscore, hogan, haml, haml-coffee,     *
   * dust atpl, eco, ect, jazz, jqtpl, JUST, liquor, QEJS, swig, templayed,    *
   * toffee, walrus, & whiskers                                                *
   * https://github.com/balderdashy/sails-wiki/blob/0.9/config.views.md#engine
   */
  engine: 'ejs',

  /**
   * Multiple layouts manageable @ controller via res.locals.layout
   */
  layout: 'layout',

  partials: false

};
