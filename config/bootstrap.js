/**
 * Bootstrap (sails.config.bootstrap)
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  /**
   * Проверяет наличие файла и, если его нет, создает пустой JSON
   * FIXME move config to mongoDB
   * @param filepath Путь к файлу
   */
  function checkCreateJSON(filepath) {
    var fs = require('fs');
    Promise.resolve(
      fs.open(filepath, 'r', (err, fd) => {
        if (err) {
          throw err;
        }

        return fd;
      })
    )
      .catch((err) => {
        if (err.code == "ENOENT") {
          fs
            .writeFile(filepath, '{}')
            .then(() => {
              sails.log.info('Created ' + filepath + '.');
            })
            .catch((err) => {
              sails.log.error(err);
            })
        }
      });
  }

  checkCreateJSON('config/banList.json'); // "%Имя персонажа%": "banned"
  checkCreateJSON('config/levelList.json'); // "%Имя персонажа%": %Уровень доступа%

  cb();
};
