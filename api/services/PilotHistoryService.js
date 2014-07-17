var PilotHistoryService = {

  add: function (line, historyType) {
    PilotHistory.create({
      pilotName: line.pilotName,
      pilotShiptype: line.pilotShiptype,
      pilotFit: line.pilotFit,
      historyType: historyType
    }).done(function(err, pilotHistoryLine){
      if (err) {
        console.log(err)
      } else {
        console.log('#' + pilotHistoryLine.id + ': ' + pilotHistoryLine.pilotName + ' on ' + pilotHistoryLine.pilotShiptype + ' in ' + pilotHistoryLine.historyType)
      }
    })
  }

};

module.exports = PilotHistoryService;
