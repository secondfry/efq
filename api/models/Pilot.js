/**
 * Capsuleer
 *
 * @module      :: Model
 * @description :: Information about specific person.
 * @docs		:: http://sailsjs.org/#!documentation/models
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
