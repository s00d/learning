var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var decConv = require('../index');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

describe('conv', function() {
    var i = getRandomInt(1000, 100000)

    var dCond = new decConv([]);

    it('Ткестирование конвертации в Двоичную систему счисления', function() {
        var item = dCond.conv(i, 2);
        var res = dCond.inv(item, 2);
        assert.equal(i.toString(2), item)
        assert.equal(i, res)
    });

    it('Ткестирование конвертации в Восьмиричную систему счисления', function() {
        var item = dCond.conv(i, 8);
        var res = dCond.inv(item, 8);
        assert.equal(i.toString(8), item)
        assert.equal(i, res)
    });

    it('Ткестирование конвертации в Шеснадцатиричную систему счисления', function() {
        var item = dCond.conv(i, 16);
        var res = dCond.inv(item, 16);
        assert.equal(i.toString(16), item)
        assert.equal(i, res)
    });

});