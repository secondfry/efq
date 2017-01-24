/**
 * WebSocket Server Settings (sails.config.sockets)
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.sockets.html
 */

module.exports.sockets = {

  /**
   * TODO incorporate usage of redis instead of
   * adapter: 'memory'
   */
  // adapter: 'socket.io-redis',
  // host: '127.0.0.1',
  // port: 6379,
  // db: 0,
  // pass: '<redis auth password>',

  /**
   * FIXME move to client request, server answer logic:
   * FIXME Instead, if you need to do something when a new socket is connected, send a request from the newly-connected client to do so.
   */
  onConnect: function(session, socket) {
    switch(session.level) {
      case 2:
        socket.join('admin')
    }
    socket.join(session.pilotName);
  }

  /**
   * TODO forsenE?
   *
   * Whether to expose a 'get /__getcookie' route with CORS support that sets *
   * a cookie (this is used by the sails.io.js socket client to get access to *
   * a 3rd party cookie and to enable sessions).                              *
   *                                                                          *
   * Warning: Currently in this scenario, CORS settings apply to interpreted  *
   * requests sent via a socket.io connection that used this cookie to        *
   * connect, even for non-browser clients! (e.g. iOS apps, toasters, node.js *
   * unit tests)
   */
  // grant3rdPartyCookie: true,

  /**
   * TODO forsenE?
   * Pre-auth
   */
  // beforeConnect: function(handshake, cb) {
  //   // `true` allows the connection
  //   return cb(null, true);
  //
  //   // (`false` would reject the connection)
  // },

  // afterDisconnect: function(session, socket, cb) {
  //   // By default: do nothing.
  //   return cb();
  // },

  // transports: ["polling", "websocket"]

};
