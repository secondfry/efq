var FleetHistoryController = {

  check: function (req, res) {
    FleetHistory.findOneByIsEnded('false').done(function(err, fleetHistoryLine){
      if (err)
        console.log(err)
      if(fleetHistoryLine) {
        res.send({message: 'There is active fleet.', data: fleetHistoryLine})
      } else {
        res.send({message: 'There is no active fleet.'})
      }
    })
  },

  end: function (req, res) {
    FleetHistory.update({
      FCName: req.body.FCName
    }, {
      isEnded: true
    }).done(function(err, fleetHistoryLine) {
      if(err)
        console.log(err);
      res.send({message: 'Fleet ended.', data: fleetHistoryLine})
    });
  },

  start: function (req, res) {
    FleetHistory.findOneByIsEnded('false').done(function(err, fleetHistoryLine){
      if (err)
        console.log(err);
      if(fleetHistoryLine) {
        res.send({message: 'You cant start fleet - there is one active already.', data: fleetHistoryLine})
      } else {
        FleetHistory.create({
          FCName: req.body.FCName,
          isEnded: 'false'
        }).done(function(err, fleetHistoryLine){
          if(err)
            console.log(err);
          res.send({message: 'Fleet started.', data: fleetHistoryLine})
        })
      }
    })
  }

};

module.exports = FleetHistoryController;