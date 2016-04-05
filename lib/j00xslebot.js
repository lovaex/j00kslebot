
"use strict";

var util = require('util')
var client = require('./j00xslebot-client')
var helpers = require('./helpers')
var bind = require('lodash').bind;

var slack_client = require('slack-client')
var CLIENT_EVENTS = slack_client.CLIENT_EVENTS;
var RTM_EVENTS = slack_client.RTM_EVENTS;

var token = require('./token.json').slack_token

var rtm = new slack_client.RtmClient(token, {logLevel: 'info'});

rtm.start();

var startData;
var myself;

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
	startData = rtmStartData;
	myself = rtmStartData.self
	console.log(util.format("Connected. I am <@%s> :-)", myself.id));
});

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function ()
{
	// I don't care at the moment.
});

class ChainOfResponsibilityMessageHandler
{
	constructor(successor) {
		this._successor = successor;	
	}

	handleEvent (event) {
		return this._successor.handleEvent(event);
	}
}

var FallbackHandler = function() {
	this.handleEvent = function() {return false;}
}

class AIHandler extends ChainOfResponsibilityMessageHandler
{
	constructor(successor) {
		super(successor)
	}

	handleEvent(slack_event) {
		client.trainAI(slack_event);
		return super.handleEvent(slack_event);
	}
}

class ThanksHandler extends ChainOfResponsibilityMessageHandler
{	
	constructor(successor) {
		super(successor);
	}

	handleEvent(slack_event) {
		if (slack_event.is_dm || slack_event.is_mention)
		{
			var message = slack_event.message;
			
			if (/grazie/i.test(message.text)) {
				slack_event.rtm.makeAPICall('reactions.add', {
					name: 'hand',
					channel: message.channel,
					timestamp: message.ts
				});
				return true;
			}
		}
		return super.handleEvent(slack_event);
	}
}

class QueryByMarketId extends ChainOfResponsibilityMessageHandler
{
	constructor(successor, get_market_by_id) {
		super(successor);
	}

	handleEvent(slack_event) {
		var message = slack_event.message;
		var m = /^m\s+(\d+)/i.exec(message.text);
		if (m) {

			var market_id = +m[1];
			client.get_market_by_id(market_id, 
				function(info) {
					var text = util.format("%d - %s (*%s*)", info.id, info.descrizione, info.codice);
					slack_event.rtm.sendMessage(text, message.channel)
				},
				function(info) {
					var text = helpers.notFoundMessage(message.user);
					slack_event.rtm.sendMessage(text, message.channel)
				});

			return true;
		}
		return super.handleEvent(slack_event);
	}
}

class SearchForMarket extends ChainOfResponsibilityMessageHandler
{
	constructor(successor) {
		super(successor);
	}

	handleEvent(slack_event) {
		var message = slack_event.message;
		var m = /^m\s+(\S+)/i.exec(message.text);
		if (m) {
			var market_name = m[1];
			client.get_markets_by_query(market_name, function(infos) {
				var text = ""
				if (infos.length > 0) 
				{
					var info;
					for (info of infos) {
						text += util.format("%d - %s (*%s*)\n", info.id, info.descrizione, info.codice);
					}
					console.log(text);
				}
				else text = helpers.notFoundMessage(message.user);
				slack_event.rtm.sendMessage(text, message.channel);
			});

			return true;
		}
		return super.handleEvent(slack_event);
	}
}

class QueryByDivisionId extends ChainOfResponsibilityMessageHandler
{
	constructor(successor) {
		super(successor);
	}

	handleEvent(slack_event) {
		var message = slack_event.message;
		var m = /^d\s+(\d+)/i.exec(message.text)
		if (m) {
			var division_id = m[1]
			client.get_division_by_id(division_id, 
				function(info) {
					var text = util.format("%d - %s (*%s*)", info.id, info.descrizione, info.codice);
					slack_event.rtm.sendMessage(text, message.channel)
				},
				function(info) {
					var text = helpers.notFoundMessage(message.user);
					slack_event.rtm.sendMessage(text, message.channel)
				})
			
			return true;
		}
		return super.handleEvent(slack_event);
	}
}

class SearchForDivision extends ChainOfResponsibilityMessageHandler
{
	constructor(successor) {
		super(successor);
	}

	handleEvent(slack_event) {
		var message = slack_event.message;
		var m = /^d\s+(\S+)/i.exec(message.text)
		if (m) {
			var division_name = m[1]
			client.get_divisions_by_query(division_name, function(infos) {
				var text = ""
				if (infos.length > 0)
				{
					var info;
					for (info of infos) {
						text += util.format("%d - %s (*%s*)\n", info.id, info.descrizione, info.codice);
					}
				}
				else text = helpers.notFoundMessage(message.user);
				
				slack_event.rtm.sendMessage(text, message.channel)
			});
			return true;
		}
		return super.handleEvent(slack_event);
	}
}

class Greetings extends ChainOfResponsibilityMessageHandler
{
	constructor(successor) {
		super(successor);
	}

	handleEvent(slack_event) {
		var message = slack_event.message;
		var m = /^(buond[iì]|buongiorno|ciao|hola|hello)/i.exec(message.text)
		if (m) {
			var text = helpers.greetUser(message.user);
			slack_event.rtm.sendMessage(text, message.channel);
			return true;
		}
		return super.handleEvent(slack_event);
	}
}

var on_message = function (message, rtm, my_id) 
{
	console.log(message);
	if (!message.text) return;

	var slack_event = 
	{
		rtm: rtm,
		time: new Date(),
		message: message,
		is_dm: false,
		is_mention: false		
	};

	if (/^[CG]/.test(message.channel)) {
		var me = util.format('<@%s>', my_id)
		slack_event.is_mention = (message.text.indexOf(me) != -1);
		if (!slack_event.is_mention) 
			slack_event.is_mention = /\bbot\b/i.test(message.text);
	}
	else {slack_event.is_dm = true;}

	var handler =   new AIHandler(
					new ThanksHandler(
					new QueryByMarketId(
					new SearchForMarket(
					new QueryByDivisionId(
					new SearchForDivision(					
					new FallbackHandler()
					))))));

	var handled = handler.handleEvent(slack_event);
	if (handled) return;
}

exports.on_message = on_message;

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
	return on_message(message, rtm, myself.id);
});
