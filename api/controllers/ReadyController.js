var ReadyController = {

  ask: function (req, res) {
    sails.io.sockets.in(req.body.pilotName).emit('ready-ask');
    res.send({action: 'ready-ask', message: 'Проверка пилота ' + req.body.pilotName + '.', data: 'sent'})
  },

  check: function (req, res) {
    sails.io.sockets.in('admin').emit('ready-check', {pilotName: req.session.pilotName});
    Fleet.update({
      pilotName: req.session.pilotName
    }, {
      pilotReady: "yes"
    }).done(function (err, fleetLine){
      if (err)
        console.log(err)
    });
    res.send({action: 'ready-check', message: 'Пилот ' + req.session.pilotName + ' отправил свое согласие.', data: 'sent'})
  }

};

module.exports = ReadyController;