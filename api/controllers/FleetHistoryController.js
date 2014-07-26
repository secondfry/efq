/*
 * Copyright (c) 2014. Rustam @Second_Fry Gubaydullin
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