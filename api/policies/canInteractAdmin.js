module.exports = function canInteractPilot (req, res, next) {
  switch(req.target.action) {
    case 'access':
    case 'update':
    case 'destroy':
      if(req.session.level > 0) {
        next()
      }
      break;
    default:
      next()
  }
};