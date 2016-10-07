'use strict';

let Base = require('../base/Action');
let gm = require('gm');
let path = require('path');
let helper = require('../helpers/MainHelper');

module.exports = class Captcha extends Base {

    constructor (config) {
        super(Object.assign({
            minLength: 5,
            maxLength: 5,
            width: 180,
            height: 60,
            backColor: '#ffffff00', // rgba
            foreColor: '#00000000',
            offset: -2,
            symbolPool: '0123456789',
            fontFile: path.join(__dirname, 'CaptchaFont.ttf'),
            fixedVerifyCode: null,
            quality: 30
        }, config));
    }

    run (cb) {
        this.renderImage(this.getVerifyCode(true), cb);
    }

    getSessionKey () {
        return `__captcha/${this.getUniqueId()}`;
    }

    getVerifyCode (generate) {
        if (this.fixedVerifyCode !== null) {
            return this.fixedVerifyCode;
        }
        let session = this.controller.req.session;
        let name = this.getSessionKey();
        if (!session[name] || generate) {
            session[name] = this.generateVerifyCode();
        }
        return session[name];
    }

    generateVerifyCode () {
        let length = helper.getRandom(this.minLength, this.maxLength);
        let buffer = [];
        for (let i = 0; i < length; ++i) {
            buffer.push(this.symbolPool.charAt(helper.getRandom(0, this.symbolPool.length - 1)));
        }
        return buffer.join('');
    }

    validate (value) {
        let code = this.getVerifyCode();
        return value.toLowerCase() === code;
    }

    renderImage (code, cb) {
        let w = this.width, h = this.height;
        let image = gm(w, h, this.backColor);
        image.fill(this.foreColor);
        image.font(this.fontFile);
        //image.affine(5,5);
        let step = (w - 0) / code.length + this.offset;
        for (let i = 0; i < code.length; ++i) {
            image.fontSize(`${helper.getRandom(25, 65)}px`);
            let angle = helper.getRandom(-16, 16);
            this.drawText(image, i * step + 10, helper.getRandom(35, 60), code[i], angle);
        }
        let downB = 20, topB = 20; //частота сетки
        for (let x = 4; x < w; x += step) {
            image.drawLine(helper.getRandom(0, w), 0, helper.getRandom(0, w), h);
            step = helper.getRandom(downB, topB);
        }
        for (let y = 3; y < h; y += step) {
            image.drawLine(0, helper.getRandom(0, w), w, helper.getRandom(0, w));
            step = helper.getRandom(downB, topB);
        }
        //image.noise(1);
        image.setFormat('jpg').quality(this.quality).toBuffer((err, buffer)=> {
            err ? cb(err) : this.controller.sendData(buffer, "binary");
        });
    }

    drawText (image, x, y, text, angle) {
        image.draw('skewX', angle, 'text', `${x},${y}`, `"${text}"`);
    }
};