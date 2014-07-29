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

var PilotController = {

  check: function(req, res) {
    Pilot.findOneByEveID(req.session.eveID).done(function(err, pilot){
      if (err) res.serverError(err); else if (pilot) {
        req.session.pilotID = pilot.id;
        res.send({action: 'pilot-check', result: 'ok'})
      } else res.send({action: 'pilot-check', result: 'fail'})
    })
  },

  add: function (req, res) {
    var uuid = require('node-uuid');
    var fs = require('fs');
    var level;
    var data = JSON.parse(fs.readFileSync('./config/levelList.json'));
    level = data[req.session.pilotName];
    if (!level) level = 0;
    Pilot.create({
      eveID: req.session.eveID,
      name: req.session.pilotName,
      location: req.session.location,
      token: 'not-a-token',
      secret: uuid.v4(),
      level: level
    }).done(function(err, pilot) {
      if (err) res.serverError(err); else if (pilot) {
        req.session.pilotID = pilot.id;
        res.send({action: 'pilot-add', result: 'ok'})
      } else res.send({action: 'pilot-add', result: 'fatal'})
    });
  },

  checkLevel: function(req, res) {
    var fs = require('fs');
    var data = JSON.parse(fs.readFileSync('./config/levelList.json'));
    var level = data[req.session.pilotName];
    if(level > 0) res.send({action: 'pilot-checkLevel', result: 'ok', level: level});
    else res.send({action: 'pilot-checkLevel', result: 'fail', level: 0})
  },

  askLogin: function(req, res) {
    var uuid = require('node-uuid');
    Pilot.update({
      name: req.session.pilotName
    }, {
      token: uuid.v4()
    }).done(function(err, user){
      if(err) res.send(err); else if (user) {
        res.cookie('ask', user[0].token);
        res.send({action: 'pilot-askLogin', result: 'ok', token: user[0].token});
      } else res.send({action: 'pilot-askLogin', result: 'fatal'})
    })
  },

  checkLogin: function(req, res) {
    Pilot.findOneById(req.session.pilotID).done(function(err, user){
      if (err) res.serverError(err); else
      if (user.token == 'not-a-token') res.send({action: 'pilot-checkLogin', result: 'fail', message: 'Сначала получите токен, а уже потом подтверждайте его!'}); else
      if (user) {
        var
          http = require('http'),
          token = user.token,
          secret = user.secret,
          level = user.level;
        http.get({
          host: 'evelocal.com',
          port: 80,
          path: '/RAISA_Shield'
        }, function(response) {
          var data = '';
          response.on('data', function(chunk) {
            data += chunk;
          });
          response.on('end', function(){
            var matches, isAuthDone = false;
            regexp = /<a href="\/RAISA_Shield\/p\/[^>]*>([^<]*)<\/a>&gt; ([\w\0]{8}-[\w\0]{4}-[\w\0]{4}-[\w\0]{4}-[\w\0]{12})/g;
            while((matches = regexp.exec(data)) !== null) {
              if(token == matches[2] && req.cookies.ask == matches[2]) {
                isAuthDone = true;
                break;
              }
            }
            if (isAuthDone == true) {
              req.session.level = level;
              req.session.secret = secret;
              res.cookie('check', secret, { expires: new Date(2100, 1, 1) });
              res.send({action: 'pilot-checkLogin', result: 'ok'});
            } else res.send({action: 'pilot-checkLogin', result: 'fail', message: 'Токен не найден в чате.'});
          })
        })
      } else res.send({action: 'pilot-checkLogin', result: 'fatal'});
    });
  },

  locate: function (req, res) {
    typeof req.headers.eve_stationname == 'undefined' ?
      location = req.headers.eve_solarsystemname + ' - ' + req.headers.eve_constellationname + ' - ' + req.headers.eve_regionname :
      location = req.headers.eve_stationname;
    Pilot.update({
      id: req.session.pilotID
    }, {
      location: location
    }).done(function(err, pilot){
      if (err) res.serverError(err); else if (pilot) {
        req.session.location = location;
        res.send({action: 'pilot-locate', result: 'ok'})
      } else res.send({action: 'pilot-locate', result: 'fail'})
    })
  }

};

module.exports = PilotController;