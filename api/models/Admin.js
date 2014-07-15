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
    },

    beforeCreate: function (attrs, next) {
      var bcrypt = require('bcrypt');

      bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(attrs.password, salt, function(err, hash) {
          if (err) return next(err);

          attrs.password = hash;
          attrs.level = 0;
          next();
        });
      });
    }

  }

};
