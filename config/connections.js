/**
 * Connections (sails.config.connections)
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.connections.html
 */

module.exports.connections = {

  /**
   * Dev-only default
   */
  localDiskDb: {
    adapter: 'sails-disk'
  },

  localMongo: {
    adapter: 'sails-mongo',
    url: process.env.MONGO_URL
  },

};
