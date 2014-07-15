module.exports = {

  attributes: {

    pilotName: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
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
