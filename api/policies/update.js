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

function updateCookie(req, res, cookie, expires) {
  var
    bcrypt = require('bcrypt-nodejs'),
    userCookie = {};
  userCookie[bcrypt.hashSync(req.session.pilotName)] = bcrypt.hashSync(req.cookies[cookie]);
  req.cookies[cookie] = userCookie;
  if (expires) res.cookie(cookie, userCookie);
  else res.cookie(cookie, userCookie, {expires: new Date(2100, 1, 1)});
}

module.exports = function update(req, res, next) {
  if (req.cookies) {
    if (typeof req.cookies.check == 'string') updateCookie(req, res, 'check', false);
    if (typeof req.cookies.ask == 'string') updateCookie(req, res, 'ask', true);
  }
  next();
};
