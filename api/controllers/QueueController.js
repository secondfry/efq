var QueueController = {

  checkType: function (req, res) {
    Queue.findOneByPilotID(req.session.pilotID).done(function(err, queueLine){
      if (err) res.send(err); else if (queueLine) {
        req.session.queueType = queueLine.queueType;
        req.session.category = queueLine.category;
        res.send({action: 'queue-checktype', result: 'ok', queueType: queueLine.queueType, category: queueLine.category})
      } else res.send({action: 'queue-checktype', result: 'fail'})
    })
  },

  checkPosition: function (req, res) {
    Queue.find({
      queueType: req.session.queueType,
      category: req.session.category
    }).done(function(err, queue){
      if (err) res.send(err); else if (queue) {
        var i = 0, queueLength = queue.length, isFound = false;
        while (i < queueLength) {
          if (queue[i].pilotID == req.session.pilotID) {
            isFound = true;
            break;
          }
          i++;
        }
        if (isFound) res.send({action: 'queue-checktype', result: 'ok', position: i+1});
        else res.send({action: 'queue-checkposition', result: 'fatal'})
      } else res.send({action: 'queue-checkposition', result: 'fail'})
    })
  },

  join: function (req, res) {
    var category, shiptype, queueType, pilotID;
    shiptype = ItemService.items[req.body.fit.match(/(^[^:]*):/)[1]].name;
    switch(shiptype) {
      case 'Vindicator':
        category = 'Close';
        break;
      case 'Nightmare':
      case 'Machariel':
        category = 'Range';
        break;
      case 'Basilisk':
      case 'Scimitar':
        category = 'Logistics';
        if (!req.body.logistics || req.body.logistics == 0) return res.send({action: 'queue-join', result: 'fail-logistics'});
        break;
      default:
        category = 'Other';
    }
    req.body.queueType ? queueType = req.body.queueType : queueType = "queue";
    req.body.pilotID ? pilotID = req.body.pilotID : pilotID = req.session.pilotID;
    Queue.create({
      pilotID: pilotID,
      queueType: queueType,
      category: category,
      shiptype: shiptype,
      fit: req.body.fit,
      logistics: req.body.logistics,
      ready: 'idk'
    }).done(function(err, queueLine) {
      if (err) res.send(err); else if (queueLine) {
        req.session.queueType = queueLine.queueType;
        req.session.category = queueLine.category;
        req.session.shiptype = queueLine.shiptype;
        req.session.ready = queueLine.ready;
        sails.io.sockets.in('admin').emit('queue', {action: 'join', queueLine: queueLine});
        // FIXME PilotHistoryService.add(queueLine, queueLine.queueType);
        res.send({action: 'queue-join', result: 'ok'})
      } else res.send({action: 'queue-join', result: 'fail'})
    });
  },

  leave: function (req, res) {
    var pilotID;
    req.body.pilotID ? pilotID = req.body.pilotID : pilotID = req.session.pilotID;
    Queue.findOneByPilotID(pilotID).done(function(err,queueLine){
      if (err) res.send(err); else if (queueLine) {
        Queue.destroy({
          pilotID: pilotID
        }).done(function(err) {
          if (err) res.send(err); else {
            req.session.queueType = null;
            req.session.category = null;
            req.session.shiptype = null;
            req.session.ready = null;
            sails.io.sockets.in('admin').emit('queue', {action: 'leave', pilotID: pilotID, queueLine: queueLine});
            res.send({action: 'queue-leave', result: 'ok', pilotID: req.session.pilotID})
          }
        })
      } else res.send({action: 'queue-leave', result: 'fatal'})
    })
  },

  get: function (req, res) {
    Queue.find().done(function(err, queue){
      if (err) res.send(err); else
      if (queue) res.send({action: 'queue-get', result: 'ok', data: queue}); else
      res.send({action: 'queue-get', result: 'fail'})
    })
  },

  update: function (req, res) {
    Queue.findOneByPilotID(req.body.pilotID).done(function(err,queueLine){
      if (err) res.send(err); else
      if (queueLine) {
        var queueLine_old = queueLine;
        Queue.update({
          pilotID: req.body.pilotID
        }, {
          queueType: req.body.queueType
        }).done(function(err, queueLine){
          if (err) res.send(err); else
          if (queueLine) {
            sails.io.sockets.in('admin').emit('queue', {action: 'update', pilotID: req.body.pilotID, queueType: req.body.queueType, queueLine: queueLine_old});
            res.send({action: 'queue-update', result: 'ok'});
          } else res.send({action: 'queue-update', result: 'fatal'})
        })
      } else res.send({action: 'queue-update', result: 'fatal'})
    })
  }

};

module.exports = QueueController;