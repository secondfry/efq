/**
 * LoginController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  storeState: function (req, res) {
    // FIXME only POST should be allowed
    req.session.state = req.body.state;
    return res.send({action: 'login-storeState', result: 'ok'});
  },

  performAuth: function (req, res) {
    // FIXME only GET should be allowed
    // FIXME check req.session.state == req.body.state
    OAuthService
      .requestToken(req.query.code)
      .then(OAuthService.requestVerification)
      .then(CharacterService.createIfNotExistsFromSSO)
      .then(TokenService.createOrUpdate)
      .then((tokenLine) => {
        req.session.characterID = tokenLine.characterID;
        return res.redirect('/fleet');
      })
      .catch(res.serverError.bind(res));
  }

};
