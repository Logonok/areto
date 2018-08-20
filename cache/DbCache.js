'use strict';

const Base = require('./Cache');

module.exports = class DbCache extends Base {

    constructor (config) {
        super(Object.assign({
            table: 'cache'
        }, config));

        this._cache = {};
    }

    getValue (key, cb) {        
        this.getQuery().and({key}).one((err, doc)=> {
            if (err || !doc) {
                return cb(err);
            }
            if (!doc.expiredAt || doc.expiredAt > Date.now() / 1000) {
                return cb(null, doc.value);
            }
            cb();
        });
    }

    setValue (key, value, duration, cb) {
        let expiredAt = duration
            ? Math.trunc(Date.now() / 1000 + duration)
            : 0;
        let query = this.getQuery().and({key});
        query.one((err, stored)=> {
            err ? cb(err)
                : query.upsert({key, value, expiredAt}, cb);
        });
    }

    removeValue (key, cb) {
        this.getQuery().and({key}).remove(cb);
    }

    flushValues (cb) {
        this.db.truncate(this.table, cb);
    }

    getQuery () {
        return (new Query).db(this.module.getDb()).from(this.table);
    }
};

const Query = require('../db/Query');