$(document).on('click', '#trust-add', function(){
  CCPEVE.requestTrust('http://' + document.location.host);
  location.reload()
});

if (window.CCPEVE && trusted === true) {
  jQ_pilotName = $('#charname').html();

  socket.get('/queue', function (data) {
    data.sort(function (a, b) {
      value_return = a.pilotShiptype - b.pilotShiptype;
      if (value_return == 0)
        value_return = new Date(a.updatedAt) - new Date(b.updatedAt);
      return value_return
    });
    $.each(data, function () {
      addToObject(js_queue, this);
      addQueueLine(this)
    });
  });

  $('#ask-login').click(function (e) {
    e.preventDefault();
    $.post('/admin/preasklogin', function (data) {
      logMessage(data.message);
      $.post('/admin/asklogin', function (data) {
        logMessage(data.message);
        CCPEVE.sendMail(1, 'Your token', 'Enter it to RAISA Shield channel and wait for evelocal to get that message.\n\n' + data.data);
      });
    })
  });

  $('#check-login').click(function (e) {
    e.preventDefault();
    $.post('/admin/checklogin', function (data) {
      logMessage(data.message);
      if (data.data == authdone) {
        CCPEVE.sendMail(1, 'Welcome', 'You are inside!');
        location.reload()
      }
    })
  });

  $('#queue-join').click(function () {
    $(this).hide();
    $('#fit-form').show()
  });

  $('#fit-form').submit(function (e) {
    e.preventDefault();
    $.post('/queue/join', {fit: prepareFit($('#fit').val())}, function (data) {
      logMessage(data.message);
      $.post('/queue/position', {pilotName: jQ_pilotName}, function (data) {
        logMessage(data.message + ' Позиция: ' + data.position + '.');
      })
    });
    $(this).hide();
    $('#queue-leave').show()
  });

  $('#queue-leave').click(function () {
    $.post('/queue/remove', {pilotName: jQ_pilotName, pilotShiptype: $('#shiptype').html()}, function (data) {
      logMessage(data.message)
    });
    $(this).hide();
    $('#queue-join').show()
  });

  $(document).on('click', '.addToWait', function () {
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

  $(document).on('click', '.addToFleet', function () {
    var queueLine = $(this).parents('.queueLine');
    if (queueLine.length) {
      fleetJoin(queueLine, "main");
      queueRemove(queueLine);
      CCPEVE.inviteToFleet(queueLine.find('.pilotID').html());
    } else {
      var fleetLine = $(this).parents('.fleetLine');
      fleetRemove(fleetLine);
      fleetJoin(fleetLine, "main");
      CCPEVE.inviteToFleet(fleetLine.find('.pilotID').html());
    }
  });

  $(document).on('click', '.remove', function () {
    var queueLine = $(this).parents('.queueLine');
    if (queueLine.length) {
      queueRemove(queueLine)
    } else {
      var fleetLine = $(this).parents('.fleetLine');
      fleetRemove(fleetLine);
    }
  });

  socket.get('/fleet', function (data) {
    data.sort(function (a, b) {
      value_return = getPilotTypeWeight(b.pilotType) - getPilotTypeWeight(a.pilotType);
      if (value_return == 0)
        value_return = a.pilotShiptype - b.pilotShiptype;
      if (value_return == 0)
        value_return = new Date(a.updatedAt) - new Date(b.updatedAt);
      return value_return
    });
    $.each(data, function () {
      addToObject(js_fleet, this);
      addFleetLine(this)
    });
  });

  $(document).on('click', '#channel', function () {
    CCPEVE.joinChannel('RAISA WL');
  });

  $(document).on('click', '#FAQ', function () {
    jQ_list = $('<ol id="FAQ-list"></ol>');
    jQ_list.append('<li>Линкани свой фит в любой разрешенный канал.<br /><img src="/images/FAQ_1.png" class="FAQ-image" /></li>');
    jQ_list.append('<li>Скопируй свое же сообщение.<br /><img src="/images/FAQ_2.png" class="FAQ-image" /></li>');
    jQ_list.append('<li>Вставь в поле для фита.<br /><img src="/images/FAQ_3.png" class="FAQ-image" /></li>');
    $.fancybox(jQ_list)
  });

  socket.get('/fleetHistory/check', function (data) {
    var string = '<p>' + data.message;
    if (data.data) {
      string += '<br />Текущий ФК: ' + data.data.FCName + '. <span class="link" id="fleet-end">Завершить флот</span>'
    } else {
      string += ' <span class="link" id="fleet-start">Стартовать флот</span>'
    }
    string += '</p>';
    $('#fleet-status').html(string)
  });

  $(document).on('click', '#fleet-start', function () {
    socket.post('/fleetHistory/start', {
      FCName: jQ_pilotName
    }, function (data) {
      var string = data.message + '\n\nCurrent FC: ' + data.data.FCName + '.';
      CCPEVE.sendMail(1, 'Fleet started', string);
      setTimeout(location.reload(), 500)
    })
  });

  $(document).on('click', '#fleet-end', function () {
    socket.post('/fleetHistory/end', {
      FCName: jQ_pilotName
    }, function (data) {
      var string = data.message;
      CCPEVE.sendMail(1, 'Fleet ended', string);
      setTimeout(location.reload(), 500)
    })
  });

}