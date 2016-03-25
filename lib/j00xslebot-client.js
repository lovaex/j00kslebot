
var requestify = require('requestify')
var util = require('util')

var AI = {
	version: "20160325",
	token: require('./token.json').AI_token
}

exports.get_market_by_id = function(id, callback, callback_error)
{
	url = util.format("http://catlin016/market/%d", id)
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		})
		.fail(callback_error);
}

exports.get_markets_by_query = function(querystr, callback) 
{
	url = util.format("http://catlin016/market/search?q=%s", escape(querystr))
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		});
}

exports.get_division_by_id = function(id, callback, callback_error)
{
	url = util.format("http://catlin016/division/%d", id)
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		})
		.fail(callback_error);
}

exports.get_divisions_by_query = function(querystr, callback)
{
	url = util.format("http://catlin016/division/search?q=%s", escape(querystr))
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		});
}

exports.trainAI = function(message) 
{
	url = util.format("https://api.wit.ai/message?v=%s&q=%s", AI.version, escape(message.text));
	requestify.get(url, {headers: {Authorization: AI.token}})
		.then(function(response) {
			body = response.getBody();
			console.log(body);
		});
}
