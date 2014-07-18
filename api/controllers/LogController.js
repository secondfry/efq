module.exports = {
  index: function (req, res) {
    console.log(req);
    res.send();
  },
  justBody: function (req, res) {
    console.log(req.body);
    res.send();
  }
};