var FakeController = {

  index: function (req, res) {
    res.view('home/index');
  }

};

module.exports = FakeController;