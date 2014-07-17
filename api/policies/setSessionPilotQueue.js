module.exports = function setSessionPilotQueue (req, res, next) {
  if (req.headers.eve_charname != undefined) {
    Queue.findOneByPilotName(req.headers.eve_charname).done(function(err, user){
      if (err)
        console.log(err);
      if (user) {
        req.session.pilotQueue = "queue";
        next()
      } else {
        Fleet.findOneByPilotName(req.headers.eve_charname).done(function(err, user){
          if (err)
            console.log(err);
          if (user) {
            req.session.pilotQueue = user.pilotType;
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