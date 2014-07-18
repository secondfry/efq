var AdminController = {

  preasklogin: function (req, res) {
    Admin.findOneByPilotName(req.headers.eve_charname).done(function(err,user){
      if (err)
        console.log(err);
      if (!user) {
        var uuid = require('node-uuid');
        var fs = require('fs');
        var level;
        var data = JSON.parse(fs.readFileSync('./config/levelList.json'));
        level = data[req.headers.eve_charname];
        switch(level) {
          case 2:
          case 1:
            break;
          default:
            level = 0;
        }
        Admin.create({
          pilotName: req.headers.eve_charname,
          token: 'not-a-token',
          secret: uuid.v4(),
          level: level
        }).done(function(err, user){
          if (err)
            console.log(err);
          res.send({action: 'admin-preask', message: 'Создан пользователь ' + user.pilotName + '.', data: 'created'})
        });
      } else {
        res.send({action: 'admin-preask', message: 'Найден пользователь ' + user.pilotName + '.', data: 'found'})
      }
    })
  },

  asklogin: function (req, res) {
    Admin.findOneByPilotName(req.headers.eve_charname).done(function(err,user) {
      if (err)
        console.log(err);
      if (user) {
        var uuid = require('node-uuid');
        Admin.update({
          pilotName: req.headers.eve_charname
        }, {
          token: uuid.v4()
        }).done(function(err, user){
          if(err)
            console.log(err);
          res.cookie('ask', user[0].token).send({action: 'admin-ask', message: 'Пользователю ' + req.headers.eve_charname + ' выдан токен.', data: user[0].token});
        })
      } else {
        res.send({action: 'admin-ask', message: 'Пользователь ' + user.pilotName + ' не найден!'});
      }
    })
  },

  checklogin: function (req, res) {
    Admin.findOneByPilotName(req.headers.eve_charname).done(function(err, user){
      if (err)
        console.log(err);
      if (user) {
        var http = require('http');
        var
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
                req.session.level = level;
                req.session.secret = secret;
                res.cookie('check', secret, { expires: new Date(2100, 1, 1) });
                res.send({action: 'admin-check', message: 'Пользователь ' + user.pilotName + ' успешно авторизован.', data: 'auth-done'});
                break
              }
            }
            if (isAuthDone == false)
              res.send({action: 'admin-check', message: 'Пользователь ' + user.pilotName + ' не прошел авторизацию.', data: 'auth-fail'});
          })
        })
      } else {
        res.send({action: 'admin-check', message: 'Пользователь ' + req.headers.eve_charname + ' не найден!', data: 'user-not-found'});
      }
    });
  }

};

module.exports = AdminController;