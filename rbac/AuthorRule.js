'use strict';

let Base = require('./Rule');
let helper = require('../helpers/main');

module.exports = class AuthorRule extends Base {

    execute (user, cb, params) {
        cb(null, params && helper.isEqualIds(user.getId(), params.authorId));
    }
};