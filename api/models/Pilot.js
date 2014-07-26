/*
 * Copyright (c) 2014. Rustam @Second_Fry Gubaydullin
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

module.exports = {

  attributes: {

    eveID: {
      type: 'integer',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    location: {
      type: 'string',
      required: true
    },
    logistics: {
      type: 'integer',
      decimal: true
    },
    token: {
      type: 'string',
      required: true
    },
    secret: {
      type: 'string',
      required: true
    },
    level: {
      type: 'integer',
      required: true,
      decimal: true
    }
    
  }

};
