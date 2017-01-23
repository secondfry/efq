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

var FleetHistoryController = {

  check: function (req, res) {
    var fleetHistoryLine = FleetHistoryService.getNotEnded(res);
    if (fleetHistoryLine) {
      return res.send({message: 'There is active fleet.', data: fleetHistoryLine});
    }

    return res.send({message: 'There is no active fleet.'});
  },

  end: function (req, res) {
    var
      query = {
        FCName: req.body.FCName
      },
      data = {
        isEnded: true
      };
    return FleetHistory
      .update(query, data)
      .then(
        function(fleetHistoryLine) {
          return res.send({message: 'Fleet ended.', data: fleetHistoryLine});
        }
      )
      .catch(res.serverError);
  },

  start: function (req, res) {
    var fleetHistoryLine = FleetHistoryService.getNotEnded(res);
    if (fleetHistoryLine) {
      return res.send({message: 'You can\'t start fleet - there is one active already.', data: fleetHistoryLine});
    }

    var data = {
      FCName: req.body.FCName,
      isEnded: 'false'
    };
    return FleetHistory
      .create(data)
      .then(
        function(fleetHistoryLine){
          return res.send({message: 'Fleet started.', data: fleetHistoryLine});
        }
      )
      .catch(res.serverError);
  }

};

module.exports = FleetHistoryController;
