module.exports = {

  attributes: {

    pilotName: {
      type: 'string',
      unique: true,
      required: true
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
      decimal: true,
      required: true
    }

  }

};
