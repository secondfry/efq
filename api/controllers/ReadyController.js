var ReadyController = {

  ask: function (req, res) {
    if (req.body.pilotName) {
      sails.io.sockets.in(req.body.pilotName).emit('ready-ask');
      res.send({action: 'ready-ask', result: 'ok'})
    } else res.send({action: 'ready-ask', result: 'fail'})
  },

  check: function (req, res) {
    sails.io.sockets.in('admin').emit('ready-check', {pilotName: req.session.pilotName});
    Queue.update({
      pilotID: req.session.pilotID
    }, {
      ready: "yes"
    }).done(function (err, queueLine){
      if (err) res.send(err); else if (queueLine) res.send({action: 'ready-check', result: 'ok'}); else res.send({action: 'ready-check', result: 'fail'})
    });
  }

};

module.exports = ReadyController;