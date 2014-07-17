module.exports = function checkSecret (req, res, next) {
  if (req.session.level == undefined && req.cookies.check) {
    Admin.findOneByPilotName(req.headers.eve_charname).done(function(err, user){
      if(user && user.secret == req.cookies.check) {
        req.session.level = user.level;
        next()
      } else {
        next()
      }
    });
  } else {
    next()
  }
};