module.exports = {
  index: function (req, res) {
    console.log(req);
    res.json({
      success: true
    });
  }
};