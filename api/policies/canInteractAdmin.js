module.exports = function canInteractPilot (req, res, next) {
  switch(req.target.action) {
    case 'find':
    case 'remove':
      if(req.session.level > 0) {
        next()
      }
      break;
    default:
      next()
  }
};