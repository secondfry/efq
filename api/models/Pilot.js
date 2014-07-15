/**
 * Capsuleer
 *
 * @module      :: Model
 * @description :: Information about specific person.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
      unique: true
    },
    logi: {
      type: 'integer',
      decimal: true
    }
    
  }

};
