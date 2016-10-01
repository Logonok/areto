'use strict';

let Base = require('./Validator');

module.exports = class UrlValidator extends Base {

    constructor (config) {
        super(Object.assign({
            pattern: '^{schemes}:\\/\\/(([A-Z0-9][A-Z0-9_-]*)(\\.[A-Z0-9][A-Z0-9_-]*)+)',
            validSchemes: ['http', 'https'],
            defaultScheme: null
        }, config));
    }

    init () {
        super.init();
        this.createMessage('message', 'Invalid url');
    }

    validateAttr (model, attr, cb) {
        let value = model.get(attr);
        this.validateValue(value, (err, message, params)=> {
            if (!err) {
                if (message) {
                    this.addError(model, attr, message, params);
                } else if (this.defaultScheme !== null && value.indexOf('://') < 0) {
                    model.set(attr, `${this.defaultScheme}://${value}`);
                }    
            }
            cb(err);
        });
    }

    validateValue (value, cb) {
        // make sure the length is limited to avoid DOS attacks
        if (typeof value !== 'string' || value.length > 2000) {
            cb(null, this.message);
        } else {
            if (this.defaultScheme !== null && value.indexOf('://') < 0) {
                value = `${this.defaultScheme}://${value}`;
            }
            let pattern = this.pattern;
            if (pattern.indexOf('{schemes}') > -1) {
                pattern = pattern.replace('{schemes}', `(${this.validSchemes.join('|')})`);
            }
            cb(null, (new RegExp(pattern, 'i')).test(value) ? null : this.message);
        }
    }
};