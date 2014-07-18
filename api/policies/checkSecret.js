module.exports = function checkSecret (req, res, next) {
  if (req.session.level == undefined && req.cookies.check) {
    Pilot.findOneByEveID(req.session.eveID).done(function(err, user){
      if (err) res.send(err); else if (user && user.secret == req.cookies.check) {
        req.session.level = user.level;
        next()
      } else next()
    });
  } else next()
};