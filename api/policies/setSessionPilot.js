module.exports = function setSessionPilot (req, res, next) {
  if (req.headers.eve_charname != undefined && req.session.pilotName == undefined) {
    req.session.pilotName = req.headers.eve_charname;
    Pilot.findOneByName(req.headers.eve_charname).done(function(err, pilot) {
      if (err)
        console.log(err);
      if (pilot) {
        next()
      } else {
        Pilot.create({
          name: req.headers.eve_charname
        }).done(function(err, pilot) {
          if (err)
            console.log(err);
          next()
        })
      }
    })
  } else {
    next()
  }
};