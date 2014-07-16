module.exports = function checkSecret (req, res, next) {
  if (req.cookies.check) {
    Admin.findOneByPilotName(req.headers.eve_charname).done(function(err, user){
      if(user && user.secret == req.cookies.check) {
        req.session.level = user.level;
        req.socket.emit('reload', true);
        next()
      } else {
        next()
      }
    });
  } else {
    next()
  }
};