/**
 * CapsuleerController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var PilotController = {

  add: function (req, res) {
    Pilot.create({
      name: req.headers.eve_charname,
    }).done(function(err, pilot) {
      if (err) {
        console.log(err)
      }
    });
  },

  findOrAdd: function (req, res) {
    Pilot.findOneByName(req.headers.eve_charname).done(function(err, pilot) {
      if (err) {
        console.log(err)
      } else {
        if (pilot == undefined) {
          PilotController.add(req, res)
        }
      }
    });
    req.session.pilot = req.headers.eve_charname
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CapsuleerController)
   */
  _config: {}

};

module.exports = PilotController;