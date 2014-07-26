/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

  /**
   * Проверяет наличие файла и, если его нет, создает пустой JSON
   * @param filepath Путь к файлу
   * @param comment Комментарий внутри
   */
  function checkCreateJSON(filepath, comment) {
    var fs = require('fs');
    fs.exists(filepath, function(exists) {
      if (!exists) fs.writeFile(filepath, '// ' + comment + '\n{}', function(err) {
        if (err) sails.log.error(err); else sails.log.info('Created ' + filepath + '.');
      });
    });
  }

  checkCreateJSON('config/banList.json', '"%Имя персонажа%": "banned"');
  checkCreateJSON('config/levelList.json', '"%Имя персонажа%": %Уровень доступа%');

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};