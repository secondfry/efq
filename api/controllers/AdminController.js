var AdminController = {

  login: function (req, res) {
    var bcrypt = require('bcrypt');

    Admin.findOneByPilotName(req.headers.eve_charname).done(function (err, user) {
      if (err) res.json({ error: 'DB error' }, 500);

      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, match) {
          if (err) res.json({ error: 'Server error' }, 500);

          if (match) {
            // password match
            req.session.userID = user.id;
            req.session.level = user.level;
            res.json(user);
          } else {
            // invalid password
            if (req.session.user) req.session.user = null;
            res.json({ error: 'Invalid password' }, 400);
          }
        });
      } else {
        res.json({ error: 'User not found' }, 404);
      }
    });
  },

  loginOrReg: function (req, res) {
    Admin.findOneByPilotName(req.headers.eve_charname).done(function (err, user) {
      if (err)
        console.log(err);
      else {
        if (user)
          AdminController.login(req, res);
        else {
          var bcrypt = require('bcrypt');

          bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(req.body.password, salt, function(err, hash) {
              if (err) return next(err);

              req.body.password = hash;
            });
          });
          Admin.create({
            pilotName: req.headers.eve_charname,
            password: req.body.password,
            level: 0
          }).done(function(err, user){
            if (err)
              console.log(err);
            else
              console.log(user);
          })
        }
      }
    })
  }

};

module.exports = AdminController;