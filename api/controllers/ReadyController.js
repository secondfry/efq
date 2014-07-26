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

var ReadyController = {

  ask: function (req, res) {
    if (req.body.pilotName) {
      sails.io.sockets.in(req.body.pilotName).emit('ready-ask');
      res.send({action: 'ready-ask', result: 'ok'})
    } else res.send({action: 'ready-ask', result: 'fail'})
  },

  check: function (req, res) {
    sails.io.sockets.in('admin').emit('ready-check', {pilotName: req.session.pilotName});
    Queue.update({
      pilotID: req.session.pilotID
    }, {
      ready: "yes"
    }).done(function (err, queueLine){
      if (err) res.send(err); else if (queueLine) res.send({action: 'ready-check', result: 'ok'}); else res.send({action: 'ready-check', result: 'fail'})
    });
  }

};

module.exports = ReadyController;