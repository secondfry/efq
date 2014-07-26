# EVE Fleet Queue
Онлайн очередь во флот. Используется [Sails](http://sailsjs.org/).
## Установка
- Установить nodeJS.
- Установить все зависимости - `npm install`.
- Настроить подходящий [adapter](http://sailsjs.org/#!documentation/config.adapters) в файлах config/adapters.js и/или config/local.js.
- Настроить порт и среду в [config/local.js](http://sailsjs.org/#!documentation/config.local).
- Запустить приложение - `sails lift`.

### Пример config/adapters.js
```js
module.exports.adapters = {
  'default': 'supermysql'
};
```
### Пример config/local.js
```js
module.exports = {
  port: 80,
  environment: 'production',
  adapters: {
    supermysql: {
      module: 'sails-mysql',
      host: '127.0.0.1',
      user: 'root', // Not really.
      password: 'root', // Wait, what?!
      database: 'root' // Why would you?..
    }
  }
};
```
## Лицензия
Продукт распространяется по GNU Affero General Public License v3.