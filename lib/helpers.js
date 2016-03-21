
var util = require('util');

var getRandomArbitrary = function(min, max) {
	return Math.random() * (max - min) + min;
}

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.notFoundMessage = function(username) {
	var not_found = require('./messages.json').not_found;
	var rnd = getRandomInt(0, not_found.length);
	return util.format(not_found[rnd], username);
}

module.exports.getRandomArbitrary = getRandomArbitrary;

module.exports.tellMeSomething = function() {
	var so_to_speak = require('./messages.json').so_to_speak;
	var rnd = getRandomInt(0, so_to_speak.length);
	return so_to_speak[rnd];
}

