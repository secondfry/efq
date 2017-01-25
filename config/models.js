/**
 * Default model configuration (sails.config.models)
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

  /**
   * connection @ config/connections.js
   */
  connection: 'localMongo',

  /**
   * Migration strategy: safe (production default), alter (development default), drop
   * http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html
   */
  // migrate: 'alter'

};
