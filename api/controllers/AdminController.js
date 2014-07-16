var AdminController = {

  preasklogin: function (req, res) {
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
    });
  },

  asklogin: function (req, res) {
    var uuid = require('node-uuid');
    AdminController.preasklogin(req, res);
    Admin.update({
      pilotName: req.headers.eve_charname
    }, {
      token: uuid.v4()
    }).done(function(err, user){
      if(err)
        console.log(err);
      res.cookie('ask', user[0].token);
      res.send(user[0].token);
    })
  },

  checklogin: function (req, res) {
    var http = require('http');
    var token, secret, level;
    Admin.findOneByPilotName(req.headers.eve_charname).done(function(err,user){
      if (err)
        console.log(err);
      if (user) {
        token = user.token;
        secret = user.secret;
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
            var matches;
            regexp = /<a href="\/RAISA_Shield\/p\/[^>]*>([^<]*)<\/a>&gt; ([\w\0]{8}-[\w\0]{4}-[\w\0]{4}-[\w\0]{4}-[\w\0]{12})/g;
            while((matches = regexp.exec(data)) !== null) {
              if(token == matches[2] && req.cookies.ask == matches[2]) {
                req.session.level = level;
                req.session.secret = secret;
                res.cookie('check', secret);
                res.send();
                break
              }
            }
          })
        })
      } else {
        res.send();
      }
    });
  }

};

module.exports = AdminController;