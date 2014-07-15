var QueueController = {

  join: function (req, res) {
    typeof req.headers.eve_stationname == 'undefined' ?
      location = req.headers.eve_solarsystemname + ' - ' + req.headers.eve_constellationname + ' - ' + req.headers.eve_regionname :
      location = req.headers.eve_stationname;
    Queue.create({
      pilotName: req.headers.eve_charname,
      pilotShiptype: req.headers.eve_shiptypename,
      pilotFit: req.body.fit,
      pilotLocation: location
    }).done(function(err, queueLine) {
      if (err) {
        console.log(err)
      } else {
        PilotHistoryService.add(queueLine, "queue");
        sails.io.sockets.emit('queue', {action: 'join', queueLine: queueLine})
      }
    });
  },

  remove: function (req, res) {
    Queue.destroy({
      pilotName: req.body.name
    }).done(function(err) {
      if (err) {
        console.log(err)
      } else {
        sails.io.sockets.emit('queue', {action: 'leave', pilotName: req.body.name})
      }
    })
  }

};

module.exports = QueueController;