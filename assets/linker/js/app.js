/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */

(function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('message', function messageReceived(message) {
      logMessage('New comet message received :: ', message)
    });

    socket.on('queue', function queueEvent(data) {
      switch(data.action) {
        case 'join':
          socket.get('/pilot', {id: data.queueLine.pilotID}, function(pilot){
            addQueueLine(data.queueLine, pilot);
            addToObject(data.queueLine);
          });
          break;
        case 'leave':
          socket.get('/pilot', {id: data.pilotID}, function(pilot){
            $('#' + pilotNameToId(pilot.name)).remove();
            removeFromObject(data);
          });
          break;
        case 'update':
          socket.get('/log/justBody', {data: '#pilotID' + data.pilotID});
          var jQ_line = $('#pilotID' + data.pilotID).parents('.line');
          $('#' + data.queueType).append(jQ_line.clone());
          jQ_line.remove()
      }
    });

    socket.on('ready-ask', function(){
      amIReady()
    });

    socket.on('ready-check', function(data){
      $('#' + pilotNameToId(data.pilotName)).find('.pilotReady').html('Готов!').blink({fontSize: '1.2em'});
      logMessage('Пилот ' + data.pilotName + ' - готов!')
    });

    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
        'Socket is now connected and globally accessible as `socket`.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);
