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
      if (err) {
        console.log(err)
      } else {
        var i = 0;
        Queue.find({category: category}).sort('updatedAt ASC').done(function(err, queue){
          if (err) {
            console.log(err)
          } else {
            while(queue[i].pilotName != req.headers.eve_charname) {
              i++;
            }
            res.send({position: i+1});
          }
        });
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
        res.send();
        sails.io.sockets.in('admin').emit('queue', {action: 'leave', pilotName: req.body.pilotName, pilotShiptype: req.body.pilotShiptype})
      }
    })
  }

};

module.exports = QueueController;