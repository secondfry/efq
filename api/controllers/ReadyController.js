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

var ReadyController = {

  ask: function (req, res) {
    if (req.body.pilotName) {
      sails.io.sockets.in(req.body.pilotName).emit('ready-ask');
      return res.send({action: 'ready-ask', result: 'ok'})
    } else {
      return res.send({action: 'ready-ask', result: 'fail'})
    }
  },

  check: function (req, res) {
    var
      query = {
        pilotID: req.session.pilotID
      },
      data = {
        ready: "yes"
      };
    sails.io.sockets.in('admin').emit('ready-check', {pilotName: req.session.pilotName});
    return Queue
      .update(query, data)
      .then(
        function(queueLine) {
          if (!queueLine) {
            throw new ErrorService.NoSuchLineError('ready-check');
          }

          return res.send({action: 'ready-check', result: 'ok'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  }

};

module.exports = ReadyController;
