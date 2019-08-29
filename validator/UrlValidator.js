/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./Validator');

module.exports = class UrlValidator extends Base {

    constructor (config) {
        super({
            pattern: '^{schemes}:\\/\\/(([A-Z0-9][A-Z0-9_-]*)(\\.[A-Z0-9][A-Z0-9_-]*)+)',
            validSchemes: ['http', 'https'],
            defaultScheme: null,
            maxLength: 2000,
            ...config
        });
    }

    getMessage () {
        return this.createMessage(this.message, 'Invalid url');
    }

    async validateAttr (model, attr) {
        const value = model.get(attr);
        const message = await this.validateValue(value);
        if (message) {
            this.addError(model, attr, message);
        } else if (this.defaultScheme !== null && !value.includes('://')) {
            model.set(attr, `${this.defaultScheme}://${value}`);
        }
    }

    validateValue (value) {
        if (typeof value !== 'string' || value.length > this.maxLength) {
            return this.getMessage();
        }
        if (this.defaultScheme !== null && !value.includes('://')) {
            value = `${this.defaultScheme}://${value}`;
        }
        let pattern = this.pattern;
        if (pattern.includes('{schemes}')) {
            pattern = pattern.replace('{schemes}', `(${this.validSchemes.join('|')})`);
        }
        return (new RegExp(pattern, 'i')).test(value) ? null : this.getMessage();
    }
};