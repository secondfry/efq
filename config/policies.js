/**
 * Policy Mappings (sails.config.policies)
 * http://sailsjs.org/#!/documentation/concepts/Policies
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

module.exports.policies = {
  '*': ['setSession', 'checkBanList', 'update', 'checkSecret', 'checkPilotID'],
  FakeController: ['setSession', 'checkBanList', 'update', 'checkSecret'],
  PilotController: {
    'check': ['setSession', 'checkBanList', 'update', 'checkSecret'],
    'add': ['setSession', 'checkBanList', 'update', 'checkSecret'],
    'find': ['setSession', 'checkBanList', 'update', 'checkSecret'],
    'create': ['setSession', 'checkBanList', 'update', 'checkSecret']
  }
//  FleetHistory: {
//    '*': 'canInteractFleet'
//  }
};
