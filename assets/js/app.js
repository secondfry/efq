/*
 * Copyright (c) 2014 – 2017. Rustam @Second_Fry Gubaydullin.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
