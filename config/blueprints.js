/**
 * Blueprint API Configuration (sails.config.blueprints)
 * http://sailsjs.org/#!/documentation/reference/blueprint-api
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.blueprints.html
 */

module.exports.blueprints = {

  /**
   * GET, POST, PUT, DELETE on every controller action
   * Naked route @ index method
   * TODO check if exposed correctly
   */
  // actions: true,

  /**
   * RESTful routes (`sails.config.blueprints.rest`)
   * If controller and model with same name exists
   *
   * GET /boat -> BoatController.find
   * GET /boat/:id -> BoatController.findOne
   * POST /boat -> BoatController.create
   * PUT /boat/:id -> BoatController.update
   * DELETE /boat/:id -> BoatController.destroy
   * TODO check if exposed correctly
   */
  // rest: true,

  /**
   * Controller CRUD exposure
   * If controller and model with same name exists
   *
   * GET /boat/find -> BoatController.find
   * GET /boat/create -> BoatController.create
   * GET /boat/update -> BoatController.update
   * GET /boat/destroy -> BoatController.destroy
   * FIXME disable in production
   */
  // shortcuts: true,

  /**
   * /boat/find -> /api/boat/find
   */
  // prefix: '/api',

  /**
   * /boat/:id -> /api/rest/boat/:id
   */
  // restPrefix: '/rest',

  // pluralize: false,

  /**
   * Populate models in other models properties
   */
  // populate: true,

  /**
   * Model.watch() @ find, findOne ?
   */
  // autoWatch: true,

  // defaultLimit: 30

};
