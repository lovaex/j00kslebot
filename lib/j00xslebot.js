
var util = require('util')
var client = require('./j00xslebot-client')

var slack_client = require('slack-client')
var CLIENT_EVENTS = slack_client.CLIENT_EVENTS;
var RTM_EVENTS = slack_client.RTM_EVENTS;

var token = require('./token.json').token

var rtm = new slack_client.RtmClient(token, {logLevel: 'info'});

rtm.start();

var myself;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
	myself = rtmStartData.self
	console.log(util.format("Connected. I am <@%s> :-)", myself.id))
});

var on_message = function (message, rtm, my_id) {
	console.log(message);

	is_dm = false;
	is_mention = false;

	if (/^[CG]/.test(message.channel)) {
		me = util.format('<@%s>', my_id)
		is_mention = (message.text.indexOf(me) != -1);
	}
	else {is_dm = true;}

	if (is_dm || is_mention)
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
				text = util.format("Non ho trovato una fava, ragionier <@%s>", message.user);
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
			else text = util.format("Non ho trovato una fava, ragionier <@%s>", message.user);
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
				text = util.format("Non ho trovato una fava, ragionier <@%s>", message.user);
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
			else text = util.format("Non ho trovato una fava, ragionier <@%s>", message.user);
			rtm.sendMessage(text, message.channel)
		})
	}

	m = /^(buongiorno|ciao|hola|hello)/i.exec(message.text)
	if (m) {
		text = util.format("Bella <@%s>!", message.user)
		rtm.sendMessage(text, message.channel)		
	}
}

exports.on_message = on_message;

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
	return on_message(message, rtm, myself.id);
});
