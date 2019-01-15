/**
 * @copyright Copyright (c) 2019 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

module.exports = class ArrayHelper {

    static diff (target, excluded, indexOf) {
        let result = [];
        for (let item of target) {
            if (indexOf ? indexOf(item, excluded) === -1 : !excluded.includes(item)) {
                result.push(item);
            }
        }
        return result;
    }

    static intersect (source, target, indexOf) {
        let result = [];
        for (let item of source) {
            if (indexOf ? indexOf(item, target) !== -1 : target.includes(item)) {
                result.push(item);
            }
        }
        return result;
    }

    static unique (values) {  // cast value to object key
        return Object.keys(this.flip(values));
    }

    static uniqueStrict (values, indexOf) {
        let result = [];
        for (let i = 0; i < values.length; ++i) {
            let value = indexOf ? indexOf(values[i], values) : values.indexOf(values[i]);
            if (value === i) {
                result.push(values[i]);
            }
        }
        return result;
    }

    static flip (values) {
        let map = {};
        if (values instanceof Array) {
            for (let i = 0; i < values.length; ++i) {
                map[values[i]] = i;
            }
        }
        return map;
    }

    static removeValue (value, values) {
        value = values.indexOf(value);
        if (value === -1) {
            return false;
        }
        values.splice(value, 1);
        return true;
    }

    static concatValues (values) {
        return values instanceof Array
            ? Array.prototype.concat.apply([], values)
            : values;
    }

    static getObjectPropValues (items, prop) {
        let values = [];
        for (let item of items) {
            if (item && Object.prototype.hasOwnProperty.call(item, prop)) {
                values.push(item[prop]);
            }
        }
        return values;
    }

    static searchByProp (value, searchProp, items, returnProp) {
        if (items instanceof Array) {
            for (let item of items) {
                if (item && item[searchProp] === value) {
                    return returnProp === undefined ? item : item[returnProp];
                }
            }
        }
    }

    // INDEX

    static indexObjects (docs, keyProp, valueProp) {
        let map = {};
        if (!(docs instanceof Array)) {
            return map;
        }
        for (let doc of docs) {
            if (doc === null || doc === undefined) {
                continue;
            }
            let value = valueProp === undefined ? doc : doc[valueProp];
            let key = doc[keyProp];
            if (!Object.prototype.hasOwnProperty.call(map, key)) {
                map[key] = value;
            } else if (map[key] instanceof Array) {
                map[key].push(value);
            } else {
                map[key] = [map[key], value];
            }
        }
        return map;
    }

    static indexUniqueKeyObjects (docs, keyProp, valueProp) {
        let map = {};
        if (!(docs instanceof Array)) {
            return map;
        }
        for (let doc of docs) {
            if (doc !== null && doc !== undefined) {
                map[doc[keyProp]] = valueProp === undefined
                    ? doc
                    : doc[valueProp];
            }
        }
        return map;
    }

    static indexModels (models, keyAttr, valueAttr) {
        let map = {};
        if (!(models instanceof Array)) {
            return map;
        }
        for (let model of models) {
            let value = valueAttr ? model.get(valueAttr) : model;
            let key = model.get(keyAttr);
            if (!Object.prototype.hasOwnProperty.call(map, key)) {
                map[key] = value;
            } else if (map[key] instanceof Array) {
                map[key].push(value);
            } else {
                map[key] = [map[key], value];
            }
        }
        return map;
    }

    static indexUniqueKeyModels (models, keyAttr, valueAttr) {
        let map = {};
        if (!(models instanceof Array)) {
            return map;
        }
        for (let model of models) {
            map[model.get(keyAttr)] = valueAttr
                ? model.get(valueAttr)
                : model;
        }
        return map;
    }

    // RANDOM

    static getRandom (values) {
        if (values instanceof Array && values.length) {
            return values[Math.floor(Math.random() * values.length)];
        }
    }

    static shuffle (values) {
        if (values instanceof Array) {
            let i = values.length;
            while (i) {
                let j = Math.floor((i--) * Math.random());
                let t = values[i];
                values[i] = values[j];
                values[j] = t;
            }
            return values;
        }
    }

    // HIERARCHY
    // order children after parents
    static sortHierarchy (items, idProp, parentProp) {
        let result = [], map = {};
        for (let item of items) {
            if (!item[parentProp]) {
                result.push(item);
            } else if (map[item[parentProp]] instanceof Array) {
                map[item[parentProp]].push(item);
            } else {
                map[item[parentProp]] = [item];
            }
        }
        for (let i = 0; i < result.length; ++i) {
            let item = result[i];
            if (map[item[idProp]] instanceof Array) {
                result = result.concat(map[item[idProp]]);
            }
        }
        return result;
    }
};