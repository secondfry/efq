module.exports = function checkBanList (req, res, next) {
  var fs = require('fs');
  var data = JSON.parse(fs.readFileSync('./config/banList.json'));
  if(data[req.headers.eve_charname] != "banned") {
    next()
  }
};