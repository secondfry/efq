var AdminController = {

  login: function (req, res) {
    Admin.findOneByPilotName(req.headers.eve_charname).done(function (err, user) {
      if (user) {
        if (req.body.password == user.password) {
          // password match
          req.session.userID = user.id;
          req.session.level = user.level;
          res.json(user);
        } else {
          // invalid password
          if (req.session.user) req.session.user = null;
          res.json({ error: 'Invalid password' }, 400);
        }
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
          Admin.create({
            pilotName: req.headers.eve_charname,
            password: req.body.password, // FIXME да, это plaintext пароли
            level: 0
          }).done(function(err, user){
            if (err)
              console.log(err);
            res.send();
          })
        }
      }
    })
  }

};

module.exports = AdminController;