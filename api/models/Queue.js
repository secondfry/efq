/**
 * Queue
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    pilotID: {
      type: 'integer',
      unique: true,
      required: true
    },
    queueType: {
      type: 'string',
      required: true
    },
    category: {
      type: 'string',
      required: true
    },
//// TODO добавление фитов в хранилище
//    pilotShipID: {
//      type: 'integer',
//      unique: true,
//      required: true
//    },
    shiptype: {
      type: 'string',
      required: true
    },
    fit: {
      type: 'string',
      required: true
    },
    ready: {
      type: 'string',
      required: true
    }
    
  }

};
