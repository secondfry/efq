module.exports = function setSessionPilot (req, res, next) {
  if (req.headers.eve_trusted == "Yes" && (req.session.isSet == undefined || req.session.isSet == false)) {
    typeof req.headers.eve_stationname == 'undefined' ?
      location = req.headers.eve_solarsystemname + ' - ' + req.headers.eve_constellationname + ' - ' + req.headers.eve_regionname :
      location = req.headers.eve_stationname;
    req.session.eveID = req.headers.eve_charid;
    req.session.pilotName = req.headers.eve_charname;
    req.session.location = location;
    req.session.isSet = true;
    next()
  } else if (req.session.isSet == undefined || req.session.isSet == false) {
    res.view('outside/index')
  } else {
    next()
  }
};