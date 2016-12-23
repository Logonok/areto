'use strict';

const Base = require('../base/Component');

module.exports = class Connection extends Base {
    
    init () {
        super.init(this);
        if (!this.driver) {
            this.setDriver();
        }
    }

    setDriver () {
        let params = {
            settings: this.settings,
            module: this.module
        };
        let drivers = Object.assign({
            mongodb: [ MongoDriver, params ],
            mysql: [ MysqlDriver, params ]
        }, this.drivers);

        if (this.schema in drivers) {
            let driver = drivers[this.schema];
            if (driver instanceof Array) {
                this.driver = new driver[0](driver[1]);
            } else if (driver instanceof Function) {
                this.driver = new driver;
            } else {
                throw new Error('Connection: Invalid driver');
            }
        } else {
            throw new Error('Connection: Driver not found');
        }
    }
};

const MongoDriver = require('./MongoDriver');
const MysqlDriver = require('./MysqlDriver');