
var util = require('util');
helpers = require("../lib/helpers");
var chai = require('chai'), spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
describe("helpers", function() 
{
	describe("#tellMeSomething", function () {
		it("should return a Renzo-style random message", function()
		{
			var something = helpers.tellMeSomething();
			expect(something).to.be.a('string');
		})
	});
	describe("#notFoundMessage", function () {
		it("should return a 'not found' answer to some human", function()
		{
			username = "U12345678";
			var something = helpers.notFoundMessage(username);
			expect(something).to.include(username)
		})
	});
	describe("#notFoundMessages", function () {
		it("should return a 'not found' answer to some human", function()
		{
			username = "U03FYGH7K";
			messages = helpers.notFoundMessages();
			for (var elem of messages) {
				something = util.format(elem, username);
				expect(something).to.include(username);
			}
				
		})
	});

});
