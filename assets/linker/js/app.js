/*
 * Copyright (c) 2014. Rustam @Second_Fry Gubaydullin, RAISA Incursions.
 *
 * This file is part of EVE Fleet Queue.
 *
 * EVE Fleet Queue is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * EVE Fleet Queue is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with EVE Fleet Queue.  If not, see <http://www.gnu.org/licenses/>.
 */

(function (io) {
  // as soon as this file is loaded, connect automatically,
  var socket = io.connect();
  log('Connecting to Sails.js...');

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
            removeFromObject(data.queueLine);
          });
          break;
        case 'update':
          socket.get('/pilot', {id: data.pilotID}, function(pilot){
            $('#' + pilotNameToId(pilot.name)).remove();
            removeFromObject(data.queueLine);
            data.queueLine.queueType = data.queueType;
            addQueueLine(data.queueLine, pilot);
            addToObject(data.queueLine);
          });
      }
    });

    socket.on('ready-ask', function(){
      amIReady()
    });

    socket.on('ready-check', function(data){
      $('#' + pilotNameToId(data.pilotName)).find('.ready').html('Готов!').blink({fontSize: '1.2em'});
      setStatus('Пилот ' + data.pilotName + ' - готов!')
    });

    log('Socket is now connected and globally accessible as `socket`.');
  });

  window.socket = socket;

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
