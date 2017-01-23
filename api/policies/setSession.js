/*
 * Copyright (c) 2014. Rustam @Second_Fry Gubaydullin, RAISA Incursions.
 *
 * This file is part of EVE Fleet Queue.
 *
 * EVE Fleet Queue is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * EVE Fleet Queue is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with EVE Fleet Queue.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = function setSessionPilot(req, res, next) {
  if (req.session.isSet == undefined || req.session.isSet == false) {
    if (req.headers.eve_trusted == "Yes") {
      typeof req.headers.eve_stationname == 'undefined' ?
        location = req.headers.eve_solarsystemname + ' - ' + req.headers.eve_constellationname + ' - ' + req.headers.eve_regionname :
        location = req.headers.eve_stationname;
      req.session.eveID = req.headers.eve_charid;
      req.session.pilotName = req.headers.eve_charname;
      req.session.location = location;
      req.session.isSet = true;
      next()
    } else res.view('outside/index')
  } else next()
};
