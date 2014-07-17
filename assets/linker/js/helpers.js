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

if(!Date.prototype.toLocaleFormat){
  Date.prototype.toLocaleFormat = function(format) {
    var f = {
      Y : this.getUTCFullYear(),
      y : this.getUTCFullYear()-(this.getUTCFullYear()>=2e3?2e3:1900),
      m : this.getUTCMonth() + 1,
      d : this.getUTCDate(),
      H : this.getUTCHours(),
      M : this.getUTCMinutes(),
      S : this.getUTCSeconds()
    }, k;
    for(k in f)
      format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
    return format;
  }
}

function createCommonLine(line, lineClass) {
  jQ_line = $('<tr></tr>').attr('id', pilotNameToId(line.pilotName)).attr('class', lineClass);
  jQ_line.append(
    $('<td class="pilotID"></td>').html(line.pilotID)
  );
  jQ_actionCell = $('<td class="pilotActions"></td>').append(
    $('<span class="actionButton addToWait"></span>').html('В запас')
  );
  jQ_actionCell.append(
    $('<span class="actionButton readyAsk"></span>').html('Проверка')
  );
  jQ_actionCell.append(
    $('<span class="actionButton addToFleet"></span>').html('Во флот')
  );
  jQ_actionCell.append(
    $('<span class="actionButton remove"></span>').html('Прогнать')
  );
  jQ_line.append(jQ_actionCell);
  var jQ_pilot = $('<span class="link"></span>').html(line.pilotName).click(function(){
    if(window.CCPEVE) {
      CCPEVE.showInfo(1377, line.pilotID); // 1377 - Character
    }
  });
  jQ_line.append(
    $('<td class="pilotName"></td>').html(jQ_pilot)
  );
  var jQ_ship = $('<div class="ship"></div>').attr('id', pilotNameToId(line.pilotName + line.pilotShiptype));
  $('body').append(jQ_ship);
  insertship(pilotNameToId(line.pilotName + line.pilotShiptype), line.pilotFit);
  var jQ_fit = $('<span class="link"></span>').html(line.pilotShiptype).click(function(){
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
  jQ_line.append(
    $('<td class="pilotLocation"></td>').html(line.pilotLocation)
  );
  var time = line.updatedAt.match(/([\w]{4})-([\w]{2})-([\w]{2})T([\w]{2}):([\w]{2}):([\w]{2})/);
  time = time[1] + '-' + time[2] + '-' + time[3] + ' <b>' + time[4] + ':' + time[5] + '</b>';
  jQ_line.append(
    $('<td class="updatedAt"></td>').html(time)
  );
  return jQ_line
}

function addQueueLine(line) {
  var jQ_line = createCommonLine(line, 'queueLine');
  $('#queue').append(jQ_line)
}

function addFleetLine(line) {
  var jQ_line = createCommonLine(line, 'fleetLine');

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
  jQ_line.append(
    $('<td class="pilotReady"></td>').html('Нет')
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
    pilotName: line.find('.pilotName span').html(),
    pilotShiptype: line.find('.pilotShiptype span').html()
  })
}

function fleetRemove(line) {
  socket.post('/fleet/remove', {
    pilotName: line.find('.pilotName span').html(),
    pilotShiptype: line.find('.pilotShiptype span').html()
  })
}

function fleetJoin(line, type) {
  socket.post('/fleet/join', {
    pilotID: line.find('.pilotID').html(),
    pilotName: line.find('.pilotName span').html(),
    pilotShiptype: line.find('.pilotShiptype span').html(),
    pilotFit: line.children('.pilotFit').html(),
    pilotLocation: line.find('.pilotLocation').html(),
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

function logMessage(message) {
  $('#messages').prepend('<p><span class="time">[' + new Date().toLocaleFormat('%Y-%m-%d %H:%M') + ']: </span>' + message + '</p>');
}

function amIReady() {
  var block_ready = $('<span class="actionButton readyCheck">Я готов!</span></div>');
  $.fancybox(block_ready)
}

jQuery.fn.extend({
  blink: function(options) {
    var oldColor = this.css('color');
    if (!options.color) {
      options.color = this.css('color')

    }
    return this
      .animate({opacity: 0.5, color: options.color}, 100)
      .animate({opacity: 1}, 100)
      .animate({opacity: 0.5}, 100)
      .animate({opacity: 1}, 100)
      .animate({opacity: 0.5}, 100)
      .animate({opacity: 1, color: oldColor}, 100);
  }
});