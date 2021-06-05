const fetch = require('node-fetch');
const { APIError } = require('./utils/errors');

class Horace {
    baseURL = 'https://race.danyarub.ru/api/';
    onPaymentCallback

    /**
     * @param {string} access_token - Токен мерчанта.
     */
    constructor(access_token) {
        if(!access_token) throw new ReferenceError('Параметр access_token обязателен.');
        this.access_token = this.access_token
    }

    /**
    * @param {string} methodName Название метода
    * @param {object} params Параметры метода
    * @description Вызов любого метода API
    * @returns {string | object} Ответ на Ваш API запрос
    */

    async call(methodName, params = {}) {
        if (!methodName) {throw new ReferenceError('Вы не указали параметр "methodName"')};
        const json = await fetch(this.baseURL + methodName, {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({access_token: this.access_token,...params}),
            method: 'POST'
        });const response = await json.json();
        if (response.error) {throw new APIError({code: response.error.error_code,msg: response.error.error_msg})};
        return response.response.msg;
    }

    /**
     * @description Вернет информацию о вашем мерчанте.
     * @returns {object} Информация о вашем мерчанте.
    */

    getMerchant() {
        return this.call('merchant.get');
    };

    /**
     * @param {string} name - Новое имя мерчанта.
     * @param {string} description - Редактирует описание мерчанта
     * @param {Number} group_id - Цифровой ID нового сообщества мерчанта.
     * @param {string} avatar - Прямая ссылка на новый аватар мерчанта(принимаются URL только от источника imgur, и только png\jpg\jpeg форматы).
     * @description - Редактирует данные вашего мерчанта.
    */

    editMerchant(name, description, group_id, avatar) {
        return this.call('merchant.edit', { name, description, avatar, group_id });
    };

    /**
     * @param {Number} count - Количество возвращаемых переводов, по умолчанию: 100.
     * @param {string} type - Тип возвращаемых переводов(all — все, out — исходящие, in — входящие).
     * @param {Number} offset - Сместить поиск на указанное кол-во записей.
     * @description - Возвращает вам историю платежей.
     * @returns {object} - Объект перевода.
    */

    getHistory(count = 100, type = "all", offset = 0) {
        return this.call('payment.getHistory', { count, type, offset })
    };

    /**
     * @param {Number|Array<Number>} ids - Список ID платежей, информацию о которых нужно получить.
     * @param {string} type - Тип возвращаемых переводов(all — все, out — исходящие, in — входящие).
    */
   
    getHistoryByIds(ids, type = "all") {
        if(!Array.isArray(ids) && !+ids) throw new ReferenceError('Параметр "ids" должен быть массивом или числом.');
        return this.call('payment.getHistoryByIds', { ids, type})
    };

    /**
     * @param {string} field - Передаваемая валюта(coin - доллары, diamonds - алмазы).
     * @param {Number} amount - Количество передаваемой валюты.
     * @param {Number} id - ID пользователя, кому нужно перевести валюту.
    */

    payTo(field, amount, id) {
        if(field !== 'coin' && field !== 'diamonds') throw new ReferenceError('Параметр "field" должен быть либо "coin", либо "diamonds".');
        return this.call('payment.send', { field, amount, id });
    };

    /**
     * @param {Number|Array<Number>} userIds - ID пользователя или пользователей, информацию о которых вы хотите получить.
    */
    getUsers(userIds) {
        if (!userIds) throw new ReferenceError('Параметр "userIds" обязателен.');
        if (!Array.isArray(userIds) && !+userIds) throw new ReferenceError('Параметр "userIds" должен быть массивом или числом.');
        return this.call('users.get', { userIds });
    };

    /**
     * @param {String|Number} url - На какой адрес будут приходить уведомления.
    */

    webhookNew(url) {
        if(!url) throw new ReferenceError('Параметр "url" обязателен.');
        if(!url.startsWith('http')) throw new ReferenceError('Параметр "url" должен начинаться с протокола http(s):// .');
        return this.call('webhooks.create', { url });
    };

    /**
     * @description - Возвращает URL текущего вебхука.
     * @returns {string}
     */

    webhookGet() {
        return this.call('webhooks.get');
    };

    /**
     * @description - CallBack входящих переводов.
     * @returns {object} - Информация о переводе.
    */
    onPayment(context) {
        this.onPaymentCallback = context;
    };
}

module.exports = { Horace };