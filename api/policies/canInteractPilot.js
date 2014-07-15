module.exports = function canInteractPilot (req, res, next) {
  switch(req.target.action) {
    case 'update':
    case 'destroy':
      Pilot.findOne(req.param('id')).done(function(err, capsuleer) {
        if(err) next(err);
        if(req.headers.eve_charname == capsuleer.name)
              next()
      });
      break;
    default:
      next()
  }
};