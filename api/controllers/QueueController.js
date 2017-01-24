/*
 * Copyright (c) 2014 – 2017. Rustam @Second_Fry Gubaydullin.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var QueueController = {

  checkType: function (req, res) {
    return Queue
      .findOneByPilotID(req.session.pilotID)
      .then(
        function (queueLine) {
          if (!queueLine) {
            throw new ErrorService.NoSuchLineError('queue-checktype');
          }

          req.session.queueType = queueLine.queueType;
          req.session.category = queueLine.category;
          return res.send({
            action: 'queue-checktype',
            result: 'ok',
            queueType: queueLine.queueType,
            category: queueLine.category
          });
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  checkPosition: function (req, res) {
    var query = {
      queueType: req.session.queueType,
      category: req.session.category
    };
    return Queue
      .find(query)
      .then(
        function (queue) {
          if (!queue) {
            throw new ErrorService.NoSuchLineError('queue-checkposition');
          }

          var
            i = 0,
            queueLength = queue.length;
          while (i < queueLength) {
            if (queue[i].pilotID == req.session.pilotID) {
              return res.send({action: 'queue-checktype', result: 'ok', position: ++i});
            }
            i++;
          }

          return res.send({action: 'queue-checkposition', result: 'fatal'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  join: function (req, res) {
    var
      shiptype = ItemService.items[req.body.fit.match(/(^[^:]*):/)[1]].name,
      queueType = req.body.queueType ? req.body.queueType : "queue",
      pilotID = req.body.pilotID ? req.body.pilotID : req.session.pilotID,
      category, data;
    switch (shiptype) {
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
        if (!req.body.logistics || req.body.logistics == 0) {
          return res.send({
            action: 'queue-join',
            result: 'fail-logistics'
          });
        }
        break;
      default:
        category = 'Other';
    }
    data = {
      pilotID: pilotID,
      queueType: queueType,
      category: category,
      shiptype: shiptype,
      fit: req.body.fit,
      logistics: req.body.logistics,
      ready: 'idk'
    };
    return Queue
      .create(data)
      .then(
        function (queueLine) {
          if (!queueLine) {
            throw new ErrorService.NoSuchLineError('queue-join');
          }

          req.session.queueType = queueLine.queueType;
          req.session.category = queueLine.category;
          req.session.shiptype = queueLine.shiptype;
          req.session.ready = queueLine.ready;
          sails.io.sockets.in('admin').emit('queue', {action: 'join', queueLine: queueLine});
          // FIXME PilotHistoryService.add(queueLine, queueLine.queueType);
          return res.send({action: 'queue-join', result: 'ok'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  leave: function (req, res) {
    var
      pilotID = req.body.pilotID ? req.body.pilotID : req.session.pilotID,
      queueLine, query;
    queueLine = Queue
      .findOneByPilotID(pilotID)
      .then(
        function (queueLine) {
          if (!queueLine) {
            throw new ErrorService.NoSuchLineFatalError('queue-leave');
          }

          return queueLine;
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
    query = {
      pilotID: pilotID
    };
    return Queue
      .destroy(query)
      .then(function () {
        req.session.queueType = null;
        req.session.category = null;
        req.session.shiptype = null;
        req.session.ready = null;
        sails.io.sockets.in('admin').emit('queue', {action: 'leave', pilotID: pilotID, queueLine: queueLine});
        return res.send({action: 'queue-leave', result: 'ok', pilotID: req.session.pilotID});
      })
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  get: function (req, res) {
    return Queue
      .find()
      .then(
        function (queue) {
          if (!queue) {
            throw new ErrorService.NoSuchLineError('queue-get');
          }

          return res.send({action: 'queue-get', result: 'ok', data: queue});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  },

  update: function (req, res) {
    var queueLineOld, query, data;
    queueLineOld = Queue
      .findOneByPilotID(req.body.pilotID)
      .then(
        function (queueLine) {
          if (!queueLine) {
            throw new ErrorService.NoSuchLineFatalError('queue-update');
          }

          return queueLine;
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
    query = {
      pilotID: req.body.pilotID
    };
    data = {
      queueType: req.body.queueType
    };
    return Queue
      .update(query, data)
      .then(
        function (queueLine) {
          if (!queueLine) {
            throw new ErrorService.NoSuchLineFatalError('queue-update');
          }

          sails.io.sockets.in('admin').emit('queue', {
            action: 'update',
            pilotID: req.body.pilotID,
            queueType: req.body.queueType,
            queueLine: queueLineOld
          });
          return res.send({action: 'queue-update', result: 'ok'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  }

};

module.exports = QueueController;
