module.exports = function checkBanList (req, res, next) {
  var fs = require('fs');
  var data = JSON.parse(fs.readFileSync('./config/banList.json'));
  if(data[req.session.pilotName] != "banned") {
    next()
  }
};