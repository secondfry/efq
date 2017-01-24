/**
 * Route Mappings (sails.config.routes)
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  '/': {
    view: 'inside/index'
  }

  /**
   * '%method% %route%': '%controller%.%method%'
   * 'post /signup': 'UserController.signup'
   * 'get /*(^.*)': 'UserController.profile'
   */
};
