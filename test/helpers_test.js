
helpers = require("../lib/helpers");
var chai = require('chai'), spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;
describe("helpers", function() 
{
	describe("#tellMeSomething", function {
		it("should return a Renzo-style random message", function()
		{
			var something = helpers.tellMeSomething();
			expect(something).to.be.a('string');
		})
	});
});
