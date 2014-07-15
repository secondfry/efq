module.exports = function canInteractQueue (req, res, next) {
  switch(req.target.action) {
    case 'find':
    case 'remove':
      if ((typeof req.session.pilotName != "undefined" && req.body.pilotName == req.session.pilotName) || req.session.level > 0) {
        next()
      }
      break;
    default:
      next()
  }
};