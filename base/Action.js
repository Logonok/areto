/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./Base');

module.exports = class Action extends Base {

    execute () {
        throw new Error('Need to override');
    }

    getRelativeModuleName () {
        return `${this.controller.NAME}/${this.name}`;
    }

    getUniqueName () {
        return this.controller.module.getRoute(this.getRelativeModuleName());
    }

    // REQUEST

    isGet () {
        return this.controller.isGet();
    }

    isPost () {
        return this.controller.isPost();
    }

    getQueryParam () {
        return this.controller.getQueryParam.apply(this.controller, arguments);
    }

    getQueryParams () {
        return this.controller.getQueryParams.apply(this.controller, arguments);
    }

    getPostParam () {
        return this.controller.getPostParam.apply(this.controller, arguments);
    }

    getPostParams () {
        return this.controller.getPostParams.apply(this.controller, arguments);
    }

    // RENDER

    render () {
        return this.controller.render.apply(this.controller, arguments);
    }

    // SEND

    send () {
        return this.controller.send.apply(this.controller, arguments);
    }

    sendText () {
        return this.controller.sendText.apply(this.controller, arguments);
    }
};