/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../base/Base');

module.exports = class Item extends Base {

    static getConstants () {
        return {
            TYPE_PERMISSION: 'permission',
            TYPE_ROLE: 'role',
            TYPE_ROUTE: 'route'
        };
    }

    static isType (type) {
        return type === this.TYPE_PERMISSION
            || type === this.TYPE_ROLE
            || type === this.TYPE_ROUTE;
    }

    isPermission () {
        return this.type === this.TYPE_PERMISSION;
    }

    isRole () {
        return this.type === this.TYPE_ROLE;
    }

    isRoute () {
        return this.type === this.TYPE_ROUTE;
    }

    addParent (item) {
        if (!this.parents) {
            this.parents = [];
        }
        this.parents.push(item);
    }

    async create () {
        if (!this.constructor.isType(this.data.type)) {
            throw new Error(`Item: ${this.name}: Invalid type: ${this.data.type}`);
        }
        const item = await this.store.findItemByName(this.name).one();
        if (item) {
            return this.store.log('warn', `Item already exists: ${this.name}`);
        }
        const data = {
            name: this.name,
            ...this.data,
            ...await this.resolveRelations()
        };
        ObjectHelper.deleteProperties(['children', 'parents'], data);
        await this.store.findItem().insert(data);
    }

    async resolveRelations () {
        const result = {};
        await this.resolveRuleRelation(result);
        return result;
    }

    async resolveRuleRelation (result) {
        if (!this.data.rule) {
            return result.rule = null;
        }
        result.rule = await this.store.findRuleByName(this.data.rule).scalar(this.store.key);
        if (!result.rule) {
            throw new Error(`Rule not found for item: ${this.name}`);
        }
    }

    async setChildren () {
        if (!this.data.children || !this.data.children.length) {
            return null;
        }
        this.data.children = await this.resolveRelatives('children');
        await this.store.findItemChild().and({
            parent: this.data.itemId,
            child: this.data.children
        }).delete();
        const items = this.data.children.map(child => ({parent: this.data.itemId, child}));
        await this.store.findItemChild().insert(items);
    }

    async setParents () {
        if (!this.data.parents || !this.data.parents.length) {
            return null;
        }
        this.data.parents = await this.resolveRelatives('parents');
        await this.store.findItemChild().and({
            parent: this.data.parents,
            child: this.data.itemId
        }).delete();
        const items = this.data.parents.map(parent => ({child: this.data.itemId, parent}));
        await this.store.findItemChild().insert(items);
    }

    async resolveRelatives (relKey) {
        const item = await this.store.findItemByName(this.name).one();
        this.data.itemId = item ? item[this.store.key] : null;
        const items = await this.store.findItemByName(this.data[relKey]).all();
        if (items.length === this.data[relKey].length) {
            return items.map(item => item[this.store.key])
        }
        throw new Error(`'${this.data[relKey]}' not found ${relKey} for item: ${this.name}`);
    }
};
module.exports.init();

const ObjectHelper = require('../../helper/ObjectHelper');