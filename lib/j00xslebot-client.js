
var requestify = require('requestify')
var util = require('util')

exports.get_market_by_id = function(id, callback, callback_error) {
	url = util.format("http://catlin016/market/%d", id)
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		})
		.fail(callback_error);
}

exports.get_markets_by_query = function(querystr, callback) {
	url = util.format("http://catlin016/market/search?q=%s", querystr)
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		});
}

exports.get_division_by_id = function(id, callback, callback_error) {
	url = util.format("http://catlin016/division/%d", id)
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		})
		.fail(callback_error);
}

exports.get_divisions_by_query = function(querystr, callback) {
	url = util.format("http://catlin016/division/search?q=%s", querystr)
	requestify.get(url)
		.then(function(response) {
			body = response.getBody()
			callback(JSON.parse(body))
		});
}
