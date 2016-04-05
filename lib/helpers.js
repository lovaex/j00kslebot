
var util = require('util');

var getRandomArbitrary = function(min, max) {
	return Math.random() * (max - min) + min;
}

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var notFoundMessages = function() {
	return require('./messages.json').not_found;
}

module.exports.notFoundMessages = notFoundMessages;

module.exports.notFoundMessage = function(username) {
	var not_found = notFoundMessages();
	var rnd = getRandomInt(0, not_found.length - 1);
	console.log(rnd);

	return util.format(not_found[rnd], username);
}

module.exports.getRandomArbitrary = getRandomArbitrary;

module.exports.greetUser = function (userId) {
	var greetings = require('./messages.json').greetings;
	var rnd = getRandomInt(0, greetings.length - 1);
	return util.format(greetings[rnd], userId);
}
