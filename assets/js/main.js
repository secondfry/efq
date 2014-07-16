$(document).on('click', '#trust-add', function(){
  CCPEVE.requestTrust('http://' + document.location.host);
  location.reload()
});

if (window.CCPEVE && trusted === true) {
  $.post('/pilot/findOrAdd');
}

socket.get('/queue', function(data) {
  $.each(data, function() {
    addToObject(js_queue, this);
    addQueueLine(this)
  });
});

$('#ask-login').click(function(e){
  e.preventDefault();
  $.post('/admin/asklogin', function(data) {
    CCPEVE.sendMail(1, 'Your token', 'Enter it to RAISA Shield channel and wait for evelocal to get that message.\n\n' + data);
  })
});

$('#check-login').click(function(e){
  e.preventDefault();
  $.post('/admin/checklogin', function(data) {
    CCPEVE.sendMail(1, 'Welcome', 'You are inside!\n\n' + data);
    location.reload()
  })
});

$('#queue-join').click(function(){
  $(this).hide();
  $('#fit-form').show()
});

$('#fit-form').submit(function(e){
  e.preventDefault();
  $.post('/queue/join', {fit: prepareFit($('#fit').val())}, function(data){
    $('#queue-position').html('Позиция в очереди: ' + data.position)
  });
  $(this).hide();
  $('#queue-leave').show()
});

$('#queue-leave').click(function(){
  $.post('/queue/remove', {pilotName: $('#charname').html(), pilotShiptype: $('#shiptype').html()}, function(data){
    $('#queue-position').html('Вы покинули очередь')
  });
  $(this).hide();
  $('#queue-join').show()
});

$(document).on('click', '.addToWait', function(){
  var queueLine = $(this).parents('.queueLine');
  if (queueLine.length) {
    fleetJoin(queueLine, "reserve");
    queueRemove(queueLine)
  } else {
    var fleetLine = $(this).parents('.fleetLine');
    fleetRemove(fleetLine);
    fleetJoin(fleetLine, "reserve")
  }
});

$(document).on('click', '.addToFleet', function(){
  var queueLine = $(this).parents('.queueLine');
  if (queueLine.length) {
    fleetJoin(queueLine, "main");
    queueRemove(queueLine)
  } else {
    var fleetLine = $(this).parents('.fleetLine');
    fleetRemove(fleetLine);
    fleetJoin(fleetLine, "main")
  }
});

$(document).on('click', '.remove', function(){
  var queueLine = $(this).parents('.queueLine');
  if (queueLine.length) {
    queueRemove(queueLine)
  } else {
    var fleetLine = $(this).parents('.fleetLine');
    fleetRemove(fleetLine);
  }
});

socket.get('/fleet', function(data) {
  data.sort(function(a, b){
    value_return = getPilotTypeWeight(b.pilotType) - getPilotTypeWeight(a.pilotType);
    if (value_return == 0)
      value_return = a.pilotShiptype - b.pilotShiptype;
    if (value_return == 0)
      value_return = new Date(a.updatedAt) - new Date(b.updatedAt);
    return value_return
  });
  $.each(data, function() {
    addToObject(js_fleet, this);
    addFleetLine(this)
  });
});