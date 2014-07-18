var FakeController = {

  index: function (req, res) {
    res.view('inside/index')
  }

};

module.exports = FakeController;