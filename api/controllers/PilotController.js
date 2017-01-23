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

  check: function (req, res) {
    return Pilot
      .findOneByEveID(req.session.eveID)
      .then(
        function(pilot) {
          if (!pilot) {
            throw new ErrorService.NoSuchLineError('pilot-check');
          }

          req.session.pilotID = pilot.id;
          return res.send({action: 'pilot-check', result: 'ok'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  add: function (req, res) {
    var
      uuid = require('uuid'),
      fs = require('fs'),
      levelList = JSON.parse(fs.readFileSync('./config/levelList.json')),
      level = levelList[req.session.pilotName] ? levelList[req.session.pilotName] : 0,
      data = {
        eveID: req.session.eveID,
        name: req.session.pilotName,
        location: req.session.location,
        token: 'not-a-token',
        secret: uuid.v4(),
        level: level
      };
    return Pilot
      .create(data)
      .then(
        function(pilot) {
          if (!pilot) {
            throw new ErrorService.NoSuchLineFatalError('pilot-add');
          }

          req.session.pilotID = pilot.id;
          return res.send({action: 'pilot-add', result: 'ok'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  checkLevel: function (req, res) {
    var
      fs = require('fs'),
      levelList = JSON.parse(fs.readFileSync('./config/levelList.json')),
      level = levelList[req.session.pilotName];
    if (level > 0) {
      return res.send({action: 'pilot-checkLevel', result: 'ok', level: level});
    }

    return res.send({action: 'pilot-checkLevel', result: 'fail', level: 0});
  },

  askLogin: function (req, res) {
    var
      uuid = require('uuid'),
      query = {
        name: req.session.pilotName
      },
      data = {
        token: uuid.v4()
      };

    return Pilot
      .update(query, data)
      .then(
        function(pilot) {
          if (!pilot) {
            throw new ErrorService.NoSuchLineFatalError('pilot-askLogin');
          }

          var
            bcrypt = require('bcrypt-nodejs'),
            userCookie = req.cookies.ask ? req.cookies.ask : {},
            userKey = Helpers.getUserKeyIn(req, 'ask');
          userCookie[userKey] = bcrypt.hashSync(pilot[0].token);
          console.log(userCookie);
          res.cookie('ask', userCookie);
          return res.send({action: 'pilot-askLogin', result: 'ok', token: pilot[0].token});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  checkLogin: function (req, res) {
    return Pilot
      .findOneById(req.session.pilotID)
      .then(
        function(pilot) {
          if (!pilot) {
            throw new ErrorService.NoSuchLineFatalError('pilot-checkLogin');
          }

          if (pilot.token == 'not-a-token') {
            throw new ErrorService.NotTokenError('pilot-checkLogin');
          }

          /**
           * FIXME evelocal.com have stopped its service
           */
          var
            userCookie = {},
            userKeyCheck = Helpers.getUserKeyIn(req, 'check'),
            bcrypt = require('bcrypt-nodejs');
          if (req.cookies.check) userCookie = req.cookies.check;
          userCookie[userKeyCheck] = bcrypt.hashSync(pilot.secret);
          req.session.level = pilot.level;
          req.session.secret = pilot.secret;
          res.cookie('check', userCookie, {expires: new Date(2100, 1, 1)});
          return res.send({action: 'pilot-checkLogin', result: 'ok'});
          /**
           * FIXME find replacement or defer from using token auth
           */
          /*
          var
            http = require('http'),
            token = user.token,
            secret = user.secret,
            level = user.level;
          http.get({
            host: 'evelocal.com',
            port: 80,
            path: '/RAISA_Shield'
          }, function (response) {
            var data = '';
            response.on('data', function (chunk) {
              data += chunk;
            });
            response.on('end', function () {
              var
                matches,
                isAuthDone = false,
                bcrypt = require('bcrypt-nodejs'),
                userKeyAsk = Helpers.getUserKeyIn(req, 'ask');
              regexp = /<a href="\/RAISA_Shield\/p\/[^>]*>([^<]*)<\/a>&gt; ([\w\0]{8}-[\w\0]{4}-[\w\0]{4}-[\w\0]{4}-[\w\0]{12})/g;
              while ((matches = regexp.exec(data)) !== null) {
                if (token == matches[2] && bcrypt.compareSync(matches[2], req.cookies.ask[userKeyAsk])) {
                  isAuthDone = true;
                  break;
                }
              }
              if (isAuthDone == true) {
                var
                  userCookie = {},
                  userKeyCheck = Helpers.getUserKeyIn(req, 'check');
                if (req.cookies.check) userCookie = req.cookies.check;
                userCookie[userKeyCheck] = bcrypt.hashSync(secret);
                req.session.level = level;
                req.session.secret = secret;
                res.cookie('check', userCookie, {expires: new Date(2100, 1, 1)});
                res.send({action: 'pilot-checkLogin', result: 'ok'});
              } else res.send({action: 'pilot-checkLogin', result: 'fail', message: 'Токен не найден в чате.'});
            })
          })
        */
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  locate: function (req, res) {
    var
      location = typeof req.headers.eve_stationname == 'undefined' ?
        req.headers.eve_solarsystemname + ' - ' + req.headers.eve_constellationname + ' - ' + req.headers.eve_regionname :
        req.headers.eve_stationname,
      query = {
        id: req.session.pilotID
      },
      data = {
        location: location
      };
    return Pilot
      .update(query, data)
      .then(
        function(pilot) {
          if (!pilot) {
            throw new ErrorService.NoSuchLineError('pilot-locate');
          }

          req.session.location = location;
          return res.send({action: 'pilot-locate', result: 'ok'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  }

};

module.exports = PilotController;
