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

var
  bluebird_util = require('./../../node_modules/bluebird/js/release/util'),
  notEnumerableProp = bluebird_util.notEnumerableProp,
  inherits = bluebird_util.inherits;

// Credit to petkaantonov/bluebird @ /src/errors.js
function subError(nameProperty, defaultMessage) {
  function SubError(action, message) {
    if (!(this instanceof SubError)) return new SubError(message, action);
    notEnumerableProp(this, "message",
      typeof message === "string" ? message : defaultMessage);
    notEnumerableProp(this, "action",
      typeof action === "string" ? action : 'unknown-action');
    notEnumerableProp(this, "name", nameProperty);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      Error.call(this);
    }
  }

  inherits(SubError, Error);
  return SubError;
}

var
  NoSuchLineError = subError('NoSuchLineError', 'Error: No such line'),
  NoSuchLineFatalError = subError('NoSuchLineFatalError', 'Fatal error: No such line'),
  NotTokenError = subError('NotTokenError', 'Error: Not a token'),
  DBError = subError('DBError', 'Error: DB error');

module.exports = {
  NoSuchLineError: NoSuchLineError,
  NoSuchLineFatalError: NoSuchLineFatalError,
  NotTokenError: NotTokenError,
  DBError: DBError,
  handleErrors: function (req, res, err) {
    if (err instanceof NoSuchLineError) {
      return res.send({action: err.action, result: 'fail'});
    }

    if (err instanceof NoSuchLineFatalError) {
      return res.send({action: err.action, result: 'fatal'});
    }

    if (err instanceof NotTokenError) {
      return res.send({
        action: err.action,
        result: 'fail',
        message: 'Сначала получите токен, а уже потом подтверждайте его!'
      });
    }

    return res.serverError(err);
  }
};
