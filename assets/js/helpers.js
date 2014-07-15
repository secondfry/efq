function addQueueLine(line) {
  jQ_line = $('<tr class="queueLine"></tr>').attr('id', pilotNameToId(line.pilotName));
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
    $('<td class="pilotLocation"></td>').html(line.pilotLocation)
  );
  jQ_line.append(
    $('<td class="updatedAt"></td>').html(line.updatedAt)
  );
  $('#queue').append(jQ_line)
}

function pilotNameToId(pilotName) {
  return pilotName.split(' ').join('')
}

function prepareFit(textarea) {
  return textarea.match(/<url=fitting:([^>]*)>/)[1]
}