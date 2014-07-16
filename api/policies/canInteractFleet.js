module.exports = function canInteractFleet (req, res, next) {
  if (req.session.level > 0) {
    next()
  }
};