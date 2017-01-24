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

var ReadyController = {

  ask: function (req, res) {
    if (req.body.pilotName) {
      sails.io.sockets.in(req.body.pilotName).emit('ready-ask');
      return res.send({action: 'ready-ask', result: 'ok'})
    } else {
      return res.send({action: 'ready-ask', result: 'fail'})
    }
  },

  check: function (req, res) {
    var
      query = {
        pilotID: req.session.pilotID
      },
      data = {
        ready: "yes"
      };
    sails.io.sockets.in('admin').emit('ready-check', {pilotName: req.session.pilotName});
    return Queue
      .update(query, data)
      .then(
        function (queueLine) {
          if (!queueLine) {
            throw new ErrorService.NoSuchLineError('ready-check');
          }

          return res.send({action: 'ready-check', result: 'ok'});
        }
      )
      .catch(ErrorService.handleErrors.bind(this, req, res));
  }

};

module.exports = ReadyController;
