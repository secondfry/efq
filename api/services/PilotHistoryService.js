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

var PilotHistoryService = {

  add: function (line, historyType) {
    PilotHistory.create({
      pilotName: line.pilotName,
      pilotShiptype: line.pilotShiptype,
      pilotFit: line.pilotFit,
      historyType: historyType
    }).done(function (err, pilotHistoryLine) {
      if (err) res.serverError(err); else console.log('#' + pilotHistoryLine.id + ': ' + pilotHistoryLine.pilotName + ' on ' + pilotHistoryLine.pilotShiptype + ' in ' + pilotHistoryLine.historyType)
    })
  }

};

module.exports = PilotHistoryService;
