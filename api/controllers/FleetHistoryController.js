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

var FleetHistoryController = {

  check: function (req, res) {
    var fleetHistoryLine = FleetHistoryService.getNotEnded(res);
    if (fleetHistoryLine) {
      return res.send({message: 'There is active fleet.', data: fleetHistoryLine});
    }

    return res.send({message: 'There is no active fleet.'});
  },

  end: function (req, res) {
    var
      query = {
        FCName: req.body.FCName
      },
      data = {
        isEnded: true
      };
    return FleetHistory
      .update(query, data)
      .then(
        function (fleetHistoryLine) {
          return res.send({message: 'Fleet ended.', data: fleetHistoryLine});
        }
      )
      .catch(res.serverError);
  },

  start: function (req, res) {
    var fleetHistoryLine = FleetHistoryService.getNotEnded(res);
    if (fleetHistoryLine) {
      return res.send({message: 'You can\'t start fleet - there is one active already.', data: fleetHistoryLine});
    }

    var data = {
      FCName: req.body.FCName,
      isEnded: 'false'
    };
    return FleetHistory
      .create(data)
      .then(
        function (fleetHistoryLine) {
          return res.send({message: 'Fleet started.', data: fleetHistoryLine});
        }
      )
      .catch(res.serverError);
  }

};

module.exports = FleetHistoryController;
