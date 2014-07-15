/**
 * PilotHistory
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    pilotName: {
      type: 'string',
      required: true
    },
    pilotShiptype: {
      type: 'string',
      required: true
    },
    pilotFit: {
      type: 'string',
      required: true
    },
    historyType: {
      type: 'string',
      required: true
    }
    
  }

};
