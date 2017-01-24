/**
 * HTTP Server Settings (sails.config.http)
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */

module.exports.http = {

  /**
   * Add ()=>{} into middle config object, then throw into order array
   * $custom is reserved (backwards @ Sails v0.9.x)
   */
  middleware: {
    // order: [
    //   'startRequestTimer',
    //   'cookieParser',
    //   'session',
    //   'myRequestLogger',
    //   'bodyParser',
    //   'handleBodyParserError',
    //   'compress',
    //   'methodOverride',
    //   'poweredBy',
    //   '$custom',
    //   'router',
    //   'www',
    //   'favicon',
    //   '404',
    //   '500'
    // ],

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }

    /**
     * Body parser for incoming multipart HTTP requests
     * Sails v0.10 uses [skipper](http://github.com/balderdashy/skipper)
     * http://www.senchalabs.org/connect/multipart.html
     */
    // bodyParser: require('skipper')({strict: true})
  },

  /**
   * Express middleware cache TTL
   */
  // cache: 31557600000

};
