/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const path = require('path');
const ClassHelper = require('../helper/ClassHelper');

module.exports = class Base {

    static init (nodeModule) {
        if (nodeModule) {
            ClassHelper.defineClassProperty(this, 'CLASS_FILE', nodeModule.filename);
            ClassHelper.defineClassProperty(this, 'CLASS_DIRECTORY', path.dirname(nodeModule.filename));
        }
        ClassHelper.defineConstantClassProperties(this);
        return this;
    }

    static wrapClassMessage (message) {
        return `${this.name}: ${message}`;
    }

    constructor (config) {
        if (config) {
            Object.assign(this, config);
        }
    }

    getClass () {
        return this.module.getClass(...arguments);
    }

    spawnSelf (params) {
        return this.spawn(this.constructor, params);
    }

    spawn (config, params) {
        if (!params) {
            params = {module: this.module};
        } else if (params.module === undefined) {
            params.module = this.module;
        }
        return ClassHelper.spawn(config, params);
    }

    wrapClassMessage (message) {
        return this.constructor.wrapClassMessage(message);
    }
};

// to fix JSON.stringify(new RegExp) => {}
RegExp.prototype.toJSON = RegExp.prototype.toString;