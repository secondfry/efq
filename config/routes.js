/**
 * Route Mappings (sails.config.routes)
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {
  '/': {
    view: 'welcome'
  },
  '/sso': 'LoginController.performAuth'

  /**
   * '%method% %route%': '%controller%.%method%'
   * 'post /signup': 'UserController.signup'
   * 'get /*(^.*)': 'UserController.profile'
   */
};
