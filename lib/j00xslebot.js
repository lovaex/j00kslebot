
var util = require('util')
var client = require('./j00xslebot-client')
var bind = require('lodash').bind;
var helpers = require('./helpers');

var slack_client = require('slack-client')
var CLIENT_EVENTS = slack_client.CLIENT_EVENTS;
var RTM_EVENTS = slack_client.RTM_EVENTS;

var token = require('./token.json').token

var rtm = new slack_client.RtmClient(token, {logLevel: 'info'});

rtm.start();

var startData;
var myself;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
	startData = rtmStartData;
	myself = rtmStartData.self
	console.log(util.format("Connected. I am <@%s> :-)", myself.id));
});

var repeating_callback = function(rtm) 
{
	// don't bother to message people outside of working hours.

	var now_hours = (new Date()).getHours();
	if (now_hours < 9 || now_hours > 18) return;

	var random = helpers.getRandomArbitrary(0, 24*60*60); // seconds in one day
	if (random < 4.0) { // avg number of sponteanous post expected
		console.log('spontaneuos message');
		var channel_id = startData.channels.filter(function (e) {return e.is_member == true})[0].id;
		var renzo_speaks = helpers.tellMeSomething();
		rtm.sendMessage(renzo_speaks, channel_id);
	}
}

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function ()
{
	var repeatable = function () {return repeating_callback(rtm)};
	rtm.ws.my_repeating_callback = setInterval(repeatable, 1000);
});

var on_message = function (message, rtm, my_id) 
{
	console.log(message);
	if (!message.text) return;

	var context = 
	{
		time: new Date(),
		event: message,
		is_dm: false,
		is_mention: false		
	};

	if (/^[CG]/.test(message.channel)) {
		me = util.format('<@%s>', my_id)
		context.is_mention = (message.text.indexOf(me) != -1);
	}
	else {context.is_dm = true;}

	if (context.is_dm || context.is_mention)
		if (/grazie/i.test(message.text))
			rtm.makeAPICall('reactions.add', {
				name: 'thumbsup',
				channel: message.channel,
				timestamp: message.ts
			});

	m = /^m (\d+)/i.exec(message.text)
	if (m) {
		var market_id = m[1]
		client.get_market_by_id(market_id, 
			function(info) {
				text = util.format("%d - %s (*%s*)", info.id, info.descrizione, info.codice);
				rtm.sendMessage(text, message.channel)
			},
			function(info) {
				text = helpers.notFoundMessage(message.user);
				rtm.sendMessage(text, message.channel)
			})
		return
	}

	m = /^m (\S+)/i.exec(message.text)
	if (m) {
		var market_name = m[1]
		client.get_markets_by_query(market_name, function(infos) {
			text = ""
			if (infos.length > 0) 
			{				
				for (info of infos) {
					text += util.format("%d - %s (*%s*)\n", info.id, info.descrizione, info.codice);
				}				
			}
			else text = helpers.notFoundMessage(message.user);
			rtm.sendMessage(text, message.channel)
		})
		return;
	}

	m = /^d (\d+)/i.exec(message.text)
	if (m) {
		var division_id = m[1]
		client.get_division_by_id(division_id, 
			function(info) {
				text = util.format("%d - %s (*%s*)", info.id, info.descrizione, info.codice);
				rtm.sendMessage(text, message.channel)
			},
			function(info) {
				text = helpers.notFoundMessage(message.user);
				rtm.sendMessage(text, message.channel)
			})
		return;
	}

	m = /^d (\S+)/i.exec(message.text)
	if (m) {
		var division_name = m[1]
		client.get_divisions_by_query(division_name, function(infos) {
			text = ""
			if (infos.length > 0)
			{
				for (info of infos) {
					text += util.format("%d - %s (*%s*)\n", info.id, info.descrizione, info.codice);
				}
			}
			else text = helpers.notFoundMessage(message.user);
			console.log(text);

			rtm.sendMessage(text, message.channel)
		})
	}

	m = /^(buongiorno|ciao|hola|hello)/i.exec(message.text)
	if (m) {
		text = helpers.greetUser(message.user);
		rtm.sendMessage(text, message.channel)		
	}

	m = /^viking/i.exec(message.text)
	if (m) {
		text = util.format("Hai detto Viking <@%s>?! Spero che tu abbia informato il cardinal Bertini!", message.user);
		rtm.sendMessage(text, message.channel);
	}
}

exports.on_message = on_message;

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
	return on_message(message, rtm, myself.id);
});
