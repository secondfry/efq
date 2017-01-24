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

  /**
   * TODO move to mongoDB
   * npm install sails-mongo
   */
  // someMongodbServer: {
  //   adapter: 'sails-mongo',
  //   host: 'localhost',
  //   port: 27017,
  //   user: 'username', //optional
  //   password: 'password', //optional
  //   database: 'your_mongo_db_name_here' //optional
  // },

};
