/*
 * Copyright (c) 2014. Rustam @Second_Fry Gubaydullin, RAISA Incursions.
 *
 * This file is part of EVE Fleet Queue.
 *
 * EVE Fleet Queue is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * EVE Fleet Queue is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with EVE Fleet Queue.  If not, see <http://www.gnu.org/licenses/>.
 */

/*-----*//* Стартап *//*-----*/
/**
 * Проверка начилия пилота в базе
 * @return {boolean} Успешно ли завершена функция
 */
function checkPilot() {
  var status = false;
  $.ajaxSetup({async: false});
  $.post('/pilot/check', function(data){
    if (data.result == 'fail') {
      setStatus('Вы не найдены в базе. Автоматическая регистрация.');
      $.post('/pilot/add', function(data){
        if (data.result == 'ok') {
          setStatus('Вы зарегистрированы!');
          status = true;
        } else if(data.result == 'fatal') setStatus('Регистрация не удалась. Сообщаем -> Lenai Chelien. Остановка процедур.');
        else status = failStatus()
      })
    } else if (data.result == 'ok') {
      setStatus('Вы найдены в базе! Поиск в списках ФК.');
      status = true;
    } else status = failStatus();
  });
  $.ajaxSetup({async: true});
  return status;
}

function checkLevel() {
  var status = false;
  $.ajaxSetup({async: false});
  $.post('/pilot/checkLevel', function(data){
    if (data.result == 'ok') {
      setStatus('Вы найдены в списках ФК! Поиск в очередях.');
      $('#login_ask, #login_check').show();
      status = true;
    } else if (data.result == 'fail') {
      setStatus('Вы не найдены в списках ФК! Поиск в очередях.');
      status = true;
    } else status = failStatus()
  });
  $.ajaxSetup({async: true});
  return status;
}

/**
 * Проверка наличия пилота в очередях ожидания и возрат позиции, если таковая будет найдена
 * @return {boolean} Успешно ли завершена функция
 */
function checkQueue() {
  var status = false;
  $.ajaxSetup({async: false});
  $.post('/queue/checkType', function(data){
    if (data.result == 'ok') {
      var stringType = '';
      switch(data.queueType) {
        case 'queue':
          stringType = 'очереди в запас';
          break;
        case 'mainfleet':
          stringType = 'основном флоте';
          break;
        case 'reserve':
          stringType = 'очереди в основу';
          break;
      }
      setStatus('Вы найдены в ' + stringType + ' в категории "' + data.category + '". Поиск позиции в очереди.');
      $('#queue_leave').show();
      $.post('/queue/checkPosition', function(data){
        if (data.result == 'ok') {
          setStatus(getStatus().match(/^[^.]*./) + ' Ваша позиция: ' + data.position);
          status = true;
        } else if (data.result == 'fail') setStatus('Позиция в очереди не найдена!');
        else status = failStatus()
      })
    } else if (data.result == 'fail') {
      setStatus('Вы не найдены в очередях.');
      $('#queue_join').show();
      status = true;
    } else status = failStatus();
  });
  $.ajaxSetup({async: true});
  return status;
}

/**
 * Проверка на логин ФК и выдача ему списков флотов
 * @return {boolean} Успешно ли завершена функция
 */
function getQueue() {
  var status = false;
  $.ajaxSetup({async: false});
  $.post('/queue/get', function(data){
    if (data.result == 'ok') {
      queueSort(data.data);
      $.each(data.data, function(k, v){
        socket.get('/pilot', {id: v.pilotID}, function(pilot){
          addQueueLine(v, pilot);
          addToObject(v);
        });
      });
      setStatus('Получена очередь флота.');
      status = true;
    } else if (data.result == 'fail') {
      setStatus('Очередь пуста!');
      status = true;
    }
    else status = failStatus();
  });
  $.ajaxSetup({async: true});
  return status;
}

/**
 * Поток функций к порядковому выполнению
 * @type {*[]} Функция
 */
var functionQueue = [
  checkPilot,
  checkLevel,
  checkQueue,
  getQueue
];
while (functionQueue.length > 0) {
  if(!functionQueue.shift()())
    break;
}

/*-----*//* Хандлеры *//*-----*/
/**
 * Хандлер для добавления в траст
 */
$(document).on('click', '#trust_add', function(){
  CCPEVE.requestTrust('http://' + document.location.host);
  location.reload()
});

/**
 * Хандлер для появления формы фиты
 */
$(document).on('click', '#queue_join', function() {
  $(this).hide();
  $('#fit_form').show()
});

/**
 * Хандлер для входа в очередь
 */
$(document).on('submit', '#fit_form', function(e){
  e.preventDefault();
  var status = false;
  $.ajaxSetup({async: false});
  $.post('/pilot/locate', function(data){ if (checkData(data)) {
    if (data.result == 'ok') {
      setStatus('Расположение установлено. Отправка фита.');
      var
        fit = prepareFit($('#fit').val()),
        logistics = $('#logistics').val();
      if (fit) {
        $.post('/queue/join', {
          fit: fit,
          logistics: logistics
        }, function(data){
          if (data.result == 'ok') {
            setStatus('Вы добавлены в очередь в запас!');
            status = true;
            checkQueue();
          }
          else if (data.result == 'fail-logistics') setStatus('Пилоты кораблей Basilisk, Skimitar обязаны указать уровень навыка Logistics.');
          else if (data.result == 'fail') setStatus('Попадание в очередь в запас не удалось. Сообщаем -> Lenai Chelien.');
          else failStatus()
        })
      } else setStatus('Вы забыли линкануть фит!')
    } else if (data.result == 'fail') setStatus('Вас не получается обнаружить на карте. Фит не отправлен.');
    else failStatus()
  }});
  $.ajaxSetup({async: false});
  if (status == true) {
    $(this).hide();
    $('#queue_leave').show();
    $('#queue_info').show()
  }
});

/**
 * Хандлер для выхода из очереди
 */
$(document).on('click', '#queue_leave', function(){
  $.post('/queue/leave', function(data){ if (checkData(data)) {
      if (data.result == 'ok') setStatus('Пилот ' + data.pilotID + ' успешно удален из очереди.');
      else if (data.result == 'fatal') setStatus('Пилота ' + data.pilotID + ' не удалось удалить из очереди.');
      else failStatus()
  }});
  $(this).hide();
  $('#queue_info').hide();
  $('#queue_join').show()
});

/**
 * Хандлер для запроса токена
 */
$(document).on('click', '#login_ask', function(e){
  e.preventDefault();
  $.post('/pilot/askLogin', function(data){ if (checkData(data)) {
    if (data.result == 'ok') {
      setStatus('Вам выдан токен. Отправьте его на канал RAISA Shield и, как только он появится на evelocal.com, делайте проверку токена.');
      CCPEVE.sendMail(1, 'Your token', 'Enter it to RAISA Shield channel and wait for evelocal.com to get that message.\n\n' + data.token);
    } else if (data.result == 'fatal') setStatus('Получить токен не удалось. Сообщаем -> Lenai Chelien.');
    else failStatus()
  }})
});

/**
 * Хандлер для подтверждения токена
 */
$(document).on('click', '#login_check', function(e){
  e.preventDefault();
  $.post('/pilot/checkLogin', function(data){ if (checkData(data)) {
    if (data.result == 'ok') {
      setStatus('Вы успешно авторизовались! Страница перезагрузится автоматически через 3 секунды.');
      CCPEVE.sendMail(1, 'Welcome', 'You are inside!');
      setTimeout(function(){location.reload()}, 3000)
    } else if (data.result == 'fail') setStatus(data.message);
    else if (data.result == 'fatal') setStatus('Пользователь не найден. Сообщаем -> Lenai Chelien.');
    else failStatus()
  }})
});

/**
 * Хандлер для переноса в запас флота
 */
$(document).on('click', '.addToWait', function(){
  var line = $(this).parents('.line');
  queueUpdate(line, 'reserve');
});

/**
 * Хандлер для проверки пилота
 */
$(document).on('click', '.readyAsk', function(){
  var
    line = $(this).parents('.line'),
    pilotName = line.find('.name span').html();
  $.post('/ready/ask', {pilotName: pilotName}, function(data){
    if (data.result == 'ok') setStatus(pilotName + ' - отправлен запрос на готовность.');
    else if (data.result == 'fail') setStatus('Не было отправлено имя пилота на проверку.');
    else failStatus()
  })
});

/**
 * Хандлер для отправки готовности
 */
$(document).on('click', '.readyCheck', function(){
  $.post('/ready/check', function(data){
    if (data.result == 'ok') setStatus('Вы подтвердили свою готовность.');
    else if (data.result == 'fail') setStatus('Подтвердить готовность не удалось!');
    else failStatus();
    $.fancybox.close()
  })
});

/**
 * Хандлер для переноса в основу
 */
$(document).on('click', '.addToFleet', function () {
  var line = $(this).parents('.line');
  if (queueUpdate(line, 'mainfleet'))
    CCPEVE.inviteToFleet(line.find('.eveID').html());
});

/**
 * Хандлер для удаления из флота
 */
$(document).on('click', '.remove', function () {
  var line = $(this).parents('.line');
  queueRemove(line);
});

/**
 * Хандлер для FAQ
 */
$(document).on('click', '#FAQ', function () {
  var jQ_list = $('<ol id="FAQ-list"></ol>');
  jQ_list.append('<li>Линкани свой фит в любой разрешенный канал.<br /><img src="/images/FAQ_1.png" class="FAQ-image" /></li>');
  jQ_list.append('<li>Отправь свое сообщение и после этого скопируй строчку из чата.<br /><img src="/images/FAQ_2.png" class="FAQ-image" /></li>');
  jQ_list.append('<li>Вставь в поле для фита.<br /><img src="/images/FAQ_3.png" class="FAQ-image" /></li>');
  $.fancybox(jQ_list)
});


// Old
/*
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
      setTimeout(function(){location.reload()}, 500)
    })
  });

  $(document).on('click', '#fleet-end', function () {
    socket.post('/fleetHistory/end', {
      FCName: jQ_pilotName
    }, function (data) {
      var string = data.message;
      CCPEVE.sendMail(1, 'Fleet ended', string);
      setTimeout(function(){location.reload()}, 500)
    })
  });



}*/
