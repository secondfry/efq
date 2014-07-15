var js_queue = {
  Ships: {
    count: 0,
    Basilisk: {
      count: 0,
      lines: []
    },
    Scimitar: {
      count: 0,
      lines: []
    },
    Vindicator: {
      count: 0,
      lines: []
    },
    Machariel: {
      count: 0,
      lines: []
    },
    Nightmare: {
      count: 0,
      lines: []
    }
  },
  Logistics: {
    count: 0
  },
  Close: {
    count: 0
  },
  Range: {
    count: 0
  },
  Other: {
    count: 0
  }
};
var js_fleet = JSON.parse(JSON.stringify(js_queue));
var js_reserve = JSON.parse(JSON.stringify(js_queue));
js_queue.Type = "queue";
js_fleet.Type = "main";
js_reserve.Type = "reserve";

function createCommonLine(line, lineClass) {
  jQ_line = $('<tr></tr>').attr('id', pilotNameToId(line.pilotName)).attr('class', lineClass);
  jQ_line.append(
    $('<td class="pilotID"></td>').html(line.pilotID)
  );
  jQ_line.append(
    $('<td class="pilotName"></td>').html(line.pilotName)
  );
  jQ_ship = $('<div class="ship"></div>').attr('id', pilotNameToId(line.pilotName + line.pilotShiptype));
  $('body').append(jQ_ship);
  insertship(pilotNameToId(line.pilotName + line.pilotShiptype), line.pilotFit);
  jQ_fit = $('<span class="link"></span>').html(line.pilotShiptype).click(function(){
    if(window.CCPEVE) {
      CCPEVE.showFitting(line.pilotFit)
    } else {
      $.fancybox(jQ_ship)
    }
  });
  jQ_line.append(
    $('<td class="pilotShiptype"></td>').html(jQ_fit)
  );
  jQ_line.append(
    $('<td class="pilotFit"></td>').html(line.pilotFit)
  );
  switch(lineClass) {
    case 'queueLine':
      jQ_line.append(
        $('<td class="pilotLocation"></td>').html(line.pilotLocation)
      );
      break;
  }
  jQ_line.append(
    $('<td class="updatedAt"></td>').html(line.updatedAt)
  );
  return jQ_line
}

function addQueueLine(line) {
  jQ_line = createCommonLine(line, 'queueLine');

  if ($('#actions-active').length) {
    jQ_actionCell = $('<td class="pilotActions"></td>').append(
      $('<span class="link addToWait"></span>').html('В запас')
    );
    jQ_actionCell.append(
      $('<span class="link addToFleet"></span>').html('Во флот')
    );
    jQ_actionCell.append(
      $('<span class="link remove"></span>').html('Прогнать')
    );
    jQ_line.prepend(jQ_actionCell)
  }

  $('#queue').append(jQ_line)
}

function addFleetLine(line) {
  jQ_line = createCommonLine(line, 'fleetLine');

  if ($('#actions-active').length) {
    jQ_actionCell = $('<td class="pilotActions"></td>').append(
      $('<span class="link addToWait"></span>').html('В запас')
    );
    jQ_actionCell.append(
      $('<span class="link addToFleet"></span>').html('Во флот')
    );
    jQ_actionCell.append(
      $('<span class="link remove"></span>').html('Прогнать')
    );
    jQ_line.prepend(jQ_actionCell)
  }

  var str_pilotType;
  switch(line.pilotType) {
    case 'reserve':
      str_pilotType = 'Запас';
      break;
    case 'main':
      str_pilotType = 'Основа';
      break;
  }
  jQ_line.append(
    $('<td class="pilotType"></td>').html(str_pilotType)
  );

  $('#fleet').append(jQ_line)
}

function pilotNameToId(pilotName) {
  return pilotName.split(' ').join('')
}

function prepareFit(textarea) {
  return textarea.match(/<url=fitting:([^>]*)>/)[1]
}

function queueRemove(line) {
  socket.post('/queue/remove', {
    pilotName: line.find('.pilotName').html(),
    pilotShiptype: line.find('.pilotShiptype span').html()
  })
}

function fleetRemove(line) {
  socket.post('/fleet/remove', {
    pilotName: line.find('.pilotName').html(),
    pilotShiptype: line.find('.pilotShiptype span').html()
  })
}

function fleetJoin(line, type) {
  CCPEVE.inviteToFleet(line.find('.pilotID').html());
  socket.post('/fleet/join', {
    pilotName: line.find('.pilotName').html(),
    pilotShiptype: line.find('.pilotShiptype span').html(),
    pilotFit: line.children('.pilotFit').html(),
    pilotType: type
  });
}

function addToObject(datastore, object) {
  if (typeof datastore.Ships[object.pilotShiptype] == "undefined") {
    datastore.Ships[object.pilotShiptype] = {
      count: 0,
      lines: []
    }

  }
  datastore.Ships[object.pilotShiptype].count++;
  datastore.Ships[object.pilotShiptype].lines.push(object);
  switch(object.pilotShiptype) {
    case 'Vindicator':
      datastore.Close.count++;
      break;
    case 'Nightmare':
    case 'Machariel':
      datastore.Range.count++;
      break;
    case 'Basilisk':
    case 'Scimitar':
      datastore.Logistics.count++;
      break;
    default:
      datastore.Other.count++;
  }

  recalculateStats(datastore)
}

function removeFromObject(datastore, object) {
  datastore.Ships[object.pilotShiptype].count--;
  $.each(datastore.Ships[object.pilotShiptype].lines, function(k){
    if (this.pilotName == object.pilotName) {
      datastore.Ships[object.pilotShiptype].lines.splice(k);
    }
  });
  switch(object.pilotShiptype) {
    case 'Vindicator':
      datastore.Close.count--;
      break;
    case 'Nightmare':
    case 'Machariel':
      datastore.Range.count--;
      break;
    case 'Basilisk':
    case 'Scimitar':
      datastore.Logistics.count--;
      break;
    default:
      datastore.Other.count--;
  }

  recalculateStats(datastore)
}

function recalculateStats(datastore) {
  stats = '<p>Логистов: ' + datastore.Logistics.count + ' (' + datastore.Ships.Basilisk.count + 'B, ' + datastore.Ships.Scimitar.count + 'S).</p>';
  stats += '<p>Виндикаторов: ' + datastore.Close.count + '.</p>';
  stats += '<p>Снайперов: ' + datastore.Range.count + ' (' + datastore.Ships.Machariel.count + 'M, ' + datastore.Ships.Nightmare.count + 'N).</p>';
  $('.' + datastore.Type + '-data').html(stats)
}

function getPilotTypeWeight(pilotType) {
  switch(pilotType) {
    case 'reserve':
      return 1;
    case 'main':
      return 2;
  }
}