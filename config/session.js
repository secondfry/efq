/**
 * Session Configuration (sails.config.session)
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.session.html
 */

module.exports.session = {

  /**
   * Invalidates user cookies
   */
  secret: '962ca53fb7ad06a5dcf47b8692001956',

  /**
   * Cookie TTL
   */
  // cookie: {
  //   maxAge: 24 * 60 * 60 * 1000
  // },

  /**
   * TODO migrate to redis
   * Requires connect-redis (https://www.npmjs.com/package/connect-redis)
   */
  // adapter: 'redis',
  /**
   * If localhost, remove. Else specify.
   */
  // host: 'localhost',
  // port: 6379,
  // ttl: <redis session TTL in seconds>,
  // db: 0,
  // pass: <redis auth password>
  // prefix: 'sess:'

  adapter: 'mongo',
  url: 'mongodb://localhost:27017/session',
  /**
   * Optional values
   * https://github.com/kcbanner/connect-mongo
   * http://bit.ly/mongooptions
   */
  // collection: 'sessions',
  // stringify: true,
  // mongoOptions: {
  //   server: {
  //     ssl: true
  //   }
  // }

};
