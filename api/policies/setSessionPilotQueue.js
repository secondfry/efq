module.exports = function setSessionPilotQueue (req, res, next) {
  if (req.session.pilotQueue == undefined) {
    Queue.findOneByPilotName(req.headers.eve_charname).done(function(err, user){
      if (err)
        console.log(err);
      if (user) {
        req.session.pilotQueue = "queue";
        PositionService.queue(req, res, user.category, user.pilotName);
        next()
      } else {
        Fleet.findOneByPilotName(req.headers.eve_charname).done(function(err, user){
          if (err)
            console.log(err);
          if (user) {
            req.session.pilotQueue = user.pilotType;
            PositionService.queue(req, res, user.category, user.pilotName);
            next()
          } else {
            req.session.pilotQueue = "none";
            req.session.pilotPosition = 0;
            next()
          }
        })
      }
    })
  } else {
    next()
  }
};