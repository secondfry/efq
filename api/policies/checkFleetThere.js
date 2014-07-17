module.exports = function checkFleetThere (req, res, next) {
  FleetHistory.findOneByIsEnded('false').done(function(err, fleetHistoryLine){
    if (err)
      console.log(err);
    if(fleetHistoryLine) {
      next()
    } else {
      res.send({action: 'denied', message: 'Нет активного флота.'});
      next()
    }
  })
};