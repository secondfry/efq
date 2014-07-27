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

/**
 * Устанавливает статус пилота
 * @param message Текст статуса
 */
function setStatus(message) {
  $('#messages').prepend('<p><span class="time">[' + moment.utc().format('YYYY-MM-DD HH:mm') + ']: </span>' + message + '</p>');
  $('#pilot_status').html(message)
}

/**
 * Возвращает статус пилота
 * @return string Текст статуса
 */
function getStatus() {
  return $('#pilot_status').html()
}

/**
 * Что-то пошло не так
 * @return {boolean} Ложь.
 */
function failStatus() {
  setStatus('Редис. Ананас. Изумруд. Свекла. Авокадо. Случилось что-то непривиденное. Сообщаем -> Lenai Chelien.');
  return false;
}

/**
 * Вычленяет DNA из переданной строки
 * @param string Входящая строка
 * @return string Фит в формате DNA
 */
function prepareFit(string) {
  var retval = string.match(/<url=fitting:([^>]*)>/);
  if (retval)
    return retval[1];
  else
    return null;
}

jQuery.fn.extend({
  /**
   * jQuery функция для подсветки готовности
   * @param options Опции для $.animate
   * @return {*} Исходный объект jQuery
   */
  blink: function(options) {
    var that = this, old_options = {};
    if (!options) {
      options = {}
    }
    $.each(options, function(k){
      old_options[k] = that.css(k)
    });
    options.opacity = 0.5;
    old_options.opacity = 1;
    return this
      .animate(options, 100)
      .animate({opacity: 1}, 100)
      .animate({opacity: 0.5}, 100)
      .animate({opacity: 1}, 100)
      .animate({opacity: 0.5}, 100)
      .animate(old_options, 100);
  }
});

/**
 * Добавляет в строке стандартные ячейки
 * @param jQ_line Строка $('<tr></tr>')
 * @param queueLine Данные из очереди
 * @param pilot Данные о пилоте
 * @return {*} Строка jQ_line с данными из очереди и о пилоте
 */
function addCommonCells(jQ_line, queueLine, pilot) {
  jQ_line.append($('<td class="pilotID"></td>').html(queueLine.pilotID).attr('id', 'pilotID' + queueLine.pilotID));
  jQ_line.append($('<td class="eveID"></td>').html(pilot.eveID));
  jQ_line.append($('<td class="fit"></td>').html(queueLine.fit));

  var jQ_pilot = $('<span class="link"></span>').html(pilot.name).click(function(){
    CCPEVE.showInfo(1377, pilot.eveID); // 1377 - Character
  });
  jQ_line.append($('<td class="name"></td>').html(jQ_pilot));

  var js_shiptype = queueLine.shiptype;
  switch(queueLine.shiptype) {
    case 'Basilisk':
    case 'Skimitar':
      js_shiptype += ' (L' + queueLine.logistics + ')';
      break;
  }
  var jQ_fit = $('<span class="link"></span>').html(js_shiptype).click(function(){
    CCPEVE.showFitting(queueLine.fit)
  });
  jQ_line.append($('<td class="shiptype"></td>').html(jQ_fit));

  jQ_line.append($('<td class="location"></td>').html(pilot.location));
  jQ_line.append($('<td class="createdAt"></td>').html(moment.utc(queueLine.createdAt).format('YYYY-MM-DD <b>HH:mm</b>')));
  return jQ_line
}

/**
 * Добавляет строки в таблицы очередей
 * @param line Данные из очереди
 * @param pilot Данные о пилоте
 */
function addQueueLine(line, pilot) {
  var jQ_line = $('<tr class="line"></tr>').attr('id', pilotNameToId(pilot.name));
  addCommonCells(jQ_line, line, pilot);
  var jQ_actionCell = $('<td class="pilotActions"></td>');
  jQ_actionCell.append($('<span class="actionButton smallButton addToWait"></span>').html('В запас'));
  jQ_actionCell.append($('<span class="actionButton smallButton readyAsk"></span>').html('Проверка'));
  jQ_actionCell.append($('<span class="actionButton smallButton addToFleet"></span>').html('Во флот'));
  jQ_actionCell.append($('<span class="actionButton smallButton remove"></span>').html('Прогнать'));
  jQ_line.prepend(jQ_actionCell);
  switch(line.queueType) {
    case 'reserve':
      var str_ready;
      switch(line.ready) {
        case 'idk': str_ready = '<div class="tac">???</div>'; break;
        case 'yes': str_ready = 'Готов!'; break;
        case 'no': str_ready = 'Нет'; break;
      }
      jQ_line.append($('<td class="ready"></td>').html(str_ready));
  }
  $('#' + line.queueType).append(jQ_line)
}

/**
 * Сводит имя пилота к стабильному #id
 * @param pilotName Имя пилота
 * @return {string} Строка #id
 */
function pilotNameToId(pilotName) {
  return pilotName.split(' ').join('')
}

/**
 * Удаляет выбранного пилота из очереди
 * @param line Строка с данными о очереди и пилоте
 */
function queueRemove(line) {
  var pilotName = line.find('.name span').html();
  socket.post('/queue/leave', {pilotID: line.find('.pilotID').html()}, function(data){
    if (data.result == 'ok') setStatus('Пилот ' + pilotName + ' успешно покинул флот.');
    else if (data.result == 'fatal') setStatus('Пилота ' + pilotName + ' не удалось удалить из флота. Сообщаем -> Lenai Chelien.');
    else failStatus()
  })
}

/**
 * Обновляет данные о пилоте и переносит в правильную очередь
 * @param line
 * @param type
 */
function queueUpdate(line, type) {
  var pilotName = line.find('.name span').html();
  socket.post('/queue/update', {pilotID: line.find('.pilotID').html(), queueType: type}, function(data) {
    if (data.result == 'ok') setStatus('Пилот ' + pilotName + ' успешно перенесен.');
    else if (data.result == 'fatal') setStatus('Пилот ' + pilotName + ' не удалось перенести. Сообщаем -> Lenai Chelien.');
    else failStatus()
  });
}

/**
 * Сортировка списка очередей по типу корабля -> времени в очереди
 * @param data Список строк данных
 * @return {*} Отсортированный список строк данных
 */
function queueSort(data) {
  return data.sort(function (a, b) {
    var criteriaArray = ['shiptype', 'createdAt'], criteria = '', value_return = 0;
    while (criteriaArray.length > 0) {
      criteria = criteriaArray.shift();
      value_return = a[criteria] > b[criteria];
      if (value_return != 0)
        break
    }
    return value_return
  })
}

/**
 * Мультимассив для подсчета кораблей на стороне клиента.
 * @type {{queue: {Ships: {count: number, Basilisk: {count: number, lines: Array}, Scimitar: {count: number, lines: Array}, Vindicator: {count: number, lines: Array}, Machariel: {count: number, lines: Array}, Nightmare: {count: number, lines: Array}}, Logistics: {count: number}, Close: {count: number}, Range: {count: number}, Other: {count: number}}}}
 */
var js_queue = {
  queue: {
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
  }
};
js_queue.mainfleet = JSON.parse(JSON.stringify(js_queue.queue));
js_queue.reserve = JSON.parse(JSON.stringify(js_queue.queue));
js_queue.queue.Type = "queue";
js_queue.mainfleet.Type = "mainfleet";
js_queue.reserve.Type = "reserve";

/**
 * Добавление строки из базы данных в мультимассив
 * @param object Строка из базы данных
 */
function addToObject(object) {
  var datastore = js_queue[object.queueType];

  if (typeof datastore.Ships[object.shiptype] == "undefined") {
    datastore.Ships[object.shiptype] = {
      count: 0,
      lines: []
    }
  }
  var shiptype = datastore.Ships[object.shiptype];

  shiptype.count++;
  shiptype.lines.push(object);
  switch(object.shiptype) {
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

/**
 * Удаление из мультимассива строки из базы данных
 * @param object Строка из базы данных
 */
function removeFromObject(object) {
  var datastore = js_queue[object.queueType];
  var shiptype = datastore.Ships[object.shiptype];

  shiptype.count--;
  $.each(shiptype.lines, function(k){
    if (this.id == object.id) {
      shiptype.lines.splice(k);
    }
  });

  switch(object.shiptype) {
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

/**
 * Пересчет статистики для ФК
 * @param datastore Подмассив определенного типа из мультимассива
 */
function recalculateStats(datastore) {
  var full = datastore.Logistics.count + datastore.Close.count + datastore.Range.count + datastore.Other.count;
  var stats = '<span>Логи: ' + datastore.Logistics.count + ' (' + datastore.Ships.Basilisk.count + 'B, ' + datastore.Ships.Scimitar.count + 'S). ' +
    'Клоз: ' + datastore.Close.count + '. ' +
    'Снайп: ' + datastore.Range.count + ' (' + datastore.Ships.Machariel.count + 'M, ' + datastore.Ships.Nightmare.count + 'N). ' +
    'Остальное: ' + datastore.Other.count + '. ' +
    'Всего: ' + full + '.</span>';
  $('#' + datastore.Type + '-data').html(stats)
}

/**
 * Проверка готовности пилота - всплывающее окно
 */
function amIReady() {
  var block_ready = $('<div class="tac"><p>ФК запрашивает вашу готовность!</p><span class="actionButton readyCheck">Я готов!</span></div>');
  $.fancybox(block_ready)
}