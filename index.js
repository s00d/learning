function decConv() {}

decConv.prototype.conv = function(x, cc) {
    var result = ""
    var hex = { 10: 'a', 11: 'b', 12: 'c', 13: 'd', 14: 'e', 15: 'f' };
    while(x > 0) {
        var b = x % cc;
        if (b > 9) b = hex[b]
        result = b.toString() + result;
        x = Math.floor(x / cc);
    }
    return result;
};

decConv.prototype.inv = function(x, cc) {
    var result = 0;
    var hex = { 'a': 10, 'b': 11, 'c': 12, 'd': 13, 'e': 14, 'f': 15 };
    for (var i = 0; i < x.length ; i++) {
        var item = x[i];
        if(hex[item]) item = hex[item]
        result += item * Math.pow(cc, x.length - i - 1)
    }

    return result;
};

module.exports = decConv;


