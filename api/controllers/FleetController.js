var FleetController = {

  join: function (req, res) {
    Fleet.create({
      pilotName: req.body.pilotName,
      pilotShiptype: req.body.pilotShiptype,
      pilotFit: req.body.pilotFit,
      pilotType: req.body.pilotType
    }).done(function(err, fleetLine) {
      if (err) {
        console.log(err)
      } else {
        res.send();
        PilotHistoryService.add(fleetLine, "fleet");
        sails.io.sockets.in('admin').emit('fleet', {action: 'join', fleetLine: fleetLine})
      }
    });
  },

  remove: function (req, res) {
    Fleet.destroy({
      pilotName: req.body.pilotName
    }).done(function(err) {
      if (err) {
        console.log(err)
      } else {
        res.send();
        sails.io.sockets.in('admin').emit('fleet', {action: 'leave', pilotName: req.body.pilotName, pilotShiptype: req.body.pilotShiptype})
      }
    })
  }

};

module.exports = FleetController;