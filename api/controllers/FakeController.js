var FakeController = {

  index: function (req, res) {
    FleetHistory.findOneByIsEnded('false').done(function(err, fleetHistoryLine){
      if (err)
        console.log(err);
      if(fleetHistoryLine) {
        res.view('home/index', {isFleetThere: true})
      } else {
        res.view('home/index', {isFleetThere: false})
      }
    })

  }

};

module.exports = FakeController;