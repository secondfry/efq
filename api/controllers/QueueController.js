var QueueController = {

  join: function (req, res) {
    var location, category, shiptype;
    typeof req.headers.eve_stationname == 'undefined' ?
      location = req.headers.eve_solarsystemname + ' - ' + req.headers.eve_constellationname + ' - ' + req.headers.eve_regionname :
      location = req.headers.eve_stationname;
    shiptype = ItemService.items[req.body.fit.match(/(^[^:]*):/)[1]].name;
    switch(shiptype) {
      case 'Vindicator':
        category = 'Close';
        break;
      case 'Nightmare':
      case 'Machariel':
        category = 'Range';
        break;
      case 'Basilisk':
      case 'Scimitar':
        category = 'Logistics';
        break;
      default:
        category = 'Other';
    }
    Queue.create({
      pilotID: req.headers.eve_charid,
      pilotName: req.headers.eve_charname,
      pilotShiptype: shiptype,
      pilotFit: req.body.fit,
      pilotLocation: location,
      category: category
    }).done(function(err, queueLine) {
      if (err)
        console.log(err);
      if (queueLine) {
        req.session.pilotQueue = "queue";
        res.send({action: 'queue-joined', message: 'Вы попали в очередь в запас.'});
        PilotHistoryService.add(queueLine, "queue");
        sails.io.sockets.in('admin').emit('queue', {action: 'join', queueLine: queueLine})
      }
    });
  },

  remove: function (req, res) {
    Queue.destroy({
      pilotName: req.body.pilotName
    }).done(function(err) {
      if (err) {
        console.log(err)
      } else {
        req.session.pilotQueue = "none";
        res.send({action: 'queue-left', message: 'Пилот ' + req.body.pilotName + ' покинул очередь в запас.'});
        sails.io.sockets.in('admin').emit('queue', {action: 'leave', pilotName: req.body.pilotName, pilotShiptype: req.body.pilotShiptype})
      }
    })
  },

  position: function (req, res) {
    Queue.findOneByPilotName(req.body.pilotName).done(function(err, queueLine){
      if (err)
        console.log(err)
      if (queueLine) {
        var category = queueLine.category;
        var position = PositionService.queue(req, res, category, req.headers.eve_charname);
      } else {
        res.send({action: 'queue-position', message: 'Пилот ' + req.body.pilotName + 'отсутствует в очереди в запас.'});
      }
    });
  }

};

module.exports = QueueController;