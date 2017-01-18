'use strict';
var readline = require('readline');

var reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var setting = {
    numDisks: 3,
    won: [1,0,0],
    steps: 0
}

function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

function HonoiInstance(numDisks) {
    if(numDisks === 'undefined') numDisks = setting.numDisks
    else setting.numDisks = numDisks

    this.stacks = [[],[],[]]
    for (var i = numDisks; i > 0; i--) {
        this.stacks[0].unshift(i);
        for(var j = 1; j < this.stacks.length; j++) this.stacks[j].unshift(0);
    }
    console.log("Minimum: ", (Math.pow(2, numDisks) - 1) * 2);
}

HonoiInstance.prototype.repeat = function(str, count) {
    if (count == 0) return "";
    var array = [];
    for(var i = 0; i <= count - 1; i++) array[i] = str;
    return array.join('');
}

HonoiInstance.prototype.checkRow = function (i, index) {
    if(typeof index === 'undefined') index = setting.numDisks - 1
    if(index < 0) return setting.won[i] = 1
    if(this.stacks[i][index] === index+1) return this.checkRow(i, index-1)
    else return false;

    return false;
}

HonoiInstance.prototype.isWon = function () {
    for(var j = 1; j < this.stacks.length; j++) this.checkRow(j)
    return (setting.won[1] === 1 && setting.won[2] === 1)
};

HonoiInstance.prototype.isValidMove = function (startTowerIdx, endTowerIdx, startIndex, endIndex) {
    if(typeof startIndex == 'undefined') startIndex = 0
    if(typeof endIndex == 'undefined') endIndex = setting.numDisks - 1
    if(startIndex > setting.numDisks - 1 || endIndex < 0) return false;

    if (this.stacks[startTowerIdx][startIndex] === 0) {
        return this.isValidMove(startTowerIdx, endTowerIdx, startIndex+1, endIndex);
    } else if (this.stacks[endTowerIdx][endIndex] != 0) {
        if (this.stacks[startTowerIdx][startIndex] < this.stacks[endTowerIdx][endIndex]) {
            return this.isValidMove(startTowerIdx, endTowerIdx, startIndex, endIndex-1);
        } else {
            return false;
        }
    } else return {start: startIndex, end: endIndex};
};

HonoiInstance.prototype.move = function (startTowerIdx, endTowerIdx) {
    var idexes = this.isValidMove(startTowerIdx, endTowerIdx)
    if (idexes) {
        this.stacks[endTowerIdx][idexes.end] = this.stacks[startTowerIdx][idexes.start];
        this.stacks[startTowerIdx][idexes.start] = 0
        setting.steps++;
        return true;
    } else {
        return false;
    }
};

HonoiInstance.prototype.print = function () {
    // process.stdout.write('\x1B[2J');
    for (var i = 0; i < this.stacks.length; i++) {
        console.log( "Stack " + (i + 1) + ": " + JSON.stringify(this.stacks[i]))
    }

    var max = setting.numDisks + 1;
    var line = this.repeat('-', 100);
    console.log("Steps: " + setting.steps);
    console.log("Result: " + setting.won);
    console.log(line);
    for (var i = 0; i < setting.numDisks; i++) {
        line = " "
        for(var j in this.stacks) {
            var count = (this.stacks[j][i] === undefined) ? 0 : this.stacks[j][i];
            line += this.repeat(' ', max - count);
            line += this.repeat('-', count);
            line += '|';
            line += this.repeat('-', count);
            line += this.repeat(' ', max - count + 1);
        }
        console.log(line);
    }
};

HonoiInstance.prototype.runBot = function(cb) {
    var bot = setInterval(function () {
        var a1 = parseInt(getRand(0, 3));
        var a2 = parseInt(getRand(0, 3));
        console.log(a1, a2)
        var moved = game.move(a1, a2);
        if (!moved) console.log("Invalid move!");
        else game.print()

        if (game.isWon()) {
            clearInterval(bot);
            game.complite()
        }

    }, 10)
}

// "number" - это колличество дисков.
// "from" - это стержень с которого переносим все диски.
// "to" - это стержень на который переносим все диски.
// "free" - это третий стержень.
HonoiInstance.prototype.solve = function(n, from, to, free, cb) {
    var self = this;
    if (n > 0) {
        self.solve(n-1, from, free, to)
        console.log(n+': Переместить диск со стержня ' + from + ' на стержень ' + to)
        game.move(from, to);
        // game.print()

        self.solve(n-1, free, to, from);
    }
    if (game.isWon()) {
        game.print()
        return game.complite()
    }
    if(typeof cb !== 'undefined') cb()
}

HonoiInstance.prototype.moveSet = function(cb) {
    this.print();
    var self = this;
    reader.question ("From?: ", function(a1) {
        reader.question ("To?: ", function(a2) {
            if(a1 == 'r') self.runBot();
            if(a1 == 't') {
                var run = false
                self.solve(setting.numDisks, 0, 1, 2, function () {
                    console.log("sleep and wait");
                    if(!run)setTimeout(function () { self.solve(setting.numDisks, 1, 2, 0); run = true }, 2000)
                });
            }
            if(typeof a1 === 'undefined' || a1 < 1 || a1 > 3) return self.moveSet(cb);
            if(typeof a2 === 'undefined' || a2 < 1 || a2 > 3) return self.moveSet(cb);
            cb(parseInt(a1) - 1, parseInt(a2) - 1);
        })
    })
};

HonoiInstance.prototype.run = function(completionCallback) {
    var game = this;

    this.moveSet(function (start, end) {
        var moved = game.move(start, end);
        if (!moved) console.log("Invalid move!");

        if (!game.isWon()) {
            game.run(completionCallback)
        } else {
            completionCallback();
        }
    });
};

HonoiInstance.prototype.complite = function () {
    var count = 0;
    var interval = setInterval(function () {
        count++;
        if(count < 100) console.log(game.repeat(' ', count)+"You win!");
        else {
            clearInterval(interval);
            reader.close();
        }

    }, 100)
}

var game = new HonoiInstance(5);

game.run(function() {
    game.complite();
})