/*
 * Copyright (c) 2017. Rustam @Second_Fry Gubaydullin.
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
  NotTokenError = subError('NotTokenError', 'Error: Not a token');

module.exports = {
  NoSuchLineError: NoSuchLineError,
  NoSuchLineFatalError: NoSuchLineFatalError,
  NotTokenError: NotTokenError,
  handleErrors: function(req, res, err) {
    if (err instanceof NoSuchLineError) {
      return res.send({action: err.action, result: 'fail'});
    }

    if (err instanceof NoSuchLineFatalError) {
      return res.send({action: err.action, result: 'fatal'});
    }

    if (err instanceof NotTokenError) {
      return res.send({action: err.action, result: 'fail', message: 'Сначала получите токен, а уже потом подтверждайте его!'});
    }

    return res.serverError(err);
  }
};
