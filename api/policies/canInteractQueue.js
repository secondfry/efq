module.exports = function canInteractQueue (req, res, next) {
  switch(req.target.action) {
    case 'update':
    case 'destroy':
      if (req.body.name == req.session.name) {
        next()
      }
      break;
    default:
      next()
  }
};