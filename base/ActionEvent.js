/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./Event');

module.exports = class ActionEvent extends Base {

    constructor (action) {
        super({action});
    }
};