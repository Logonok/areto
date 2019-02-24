/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = class CommonHelper {

    static log (type, message, data, prefix, logger) {
        logger = logger || console;
        if (typeof message === 'string') {
            return logger.log(type, `${prefix}: ${message}`, data);
        }
        logger.log(type, `${prefix}:`, message);
    }

    static isEmpty (value) {
        return value === undefined || value === null || value === '';
    }

    static getRandom (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static parseJson (data) {
        try {
            return JSON.parse(data);
        } catch (err) {}
    }

    static parseRelationChanges (data) {
        if (data && typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (err) {
                return false;
            }
        }
        if (!data) {
            return null;
        }
        if (!Array.isArray(data.links)) {
            data.links = [];
        }
        if (!Array.isArray(data.unlinks)) {
            data.unlinks = [];
        }
        if (!Array.isArray(data.removes)) {
            data.removes = [];
        }
        let all = data.links.concat(data.unlinks, data.removes);
        return all.length === ArrayHelper.unique(all).length ? data : false;
    }

    // ESCAPE

    static escapeRegExp (text) {
        return String(text).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    static escapeHtml (html) {
        return String(html).replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }
};

const ArrayHelper = require('./ArrayHelper');