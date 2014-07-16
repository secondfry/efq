var PositionService = {

  queue: function (req, res, category, pilotName) {
    var i = 0;
    Queue.find({category: category}).sort('updatedAt ASC').done(function(err, queue){
      if (err)
        console.log(err);
      if (queue) {
        while(queue[i].pilotName != pilotName) {
          i++;
        }
        req.session.pilotPosition = i + 1;
        res.send({action: 'queue-position', message: 'Пилот ' + pilotName + ' найден в очереди в запас.', position: i + 1});
      } else {
        res.send({action: 'queue-position', message: 'Пилот ' + pilotName + ' не найден в очереди в запас.', position: 0});
      }
    });
  },

  fleet: function (req, res, category, pilotName) {
    var i = 0;
    Fleet.find({category: category, pilotType: 'reserve'}).sort('updatedAt ASC').done(function(err, queue){
      if (err)
        console.log(err);
      if (queue) {
        while(queue[i].pilotName != pilotName) {
          i++;
        }
        req.session.pilotPosition = i + 1;
        res.send({action: 'fleet-position', message: 'Пилот ' + pilotName + ' найден в очереди в основу.', position: i + 1});
      } else {
        res.send({action: 'fleet-position', message: 'Пилот ' + pilotName + ' не найден в очереди в основу.', position: 0});
      }
    });
  }

};

module.exports = PositionService;