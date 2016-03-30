
yooxlebot = require("../lib/j00xslebot");
var chai = require('chai'), spies = require('chai-spies');
chai.use(spies);

var client = require("../lib/j00xslebot-client");

var expect = chai.expect;

describe("yooxlebot", function() 
{
   describe("on message event", function() 
   {
       it("should answer if somebody greets the bot on group", function()
       {
 		var rtm = chai.spy.object([ 'sendMessage' ]);       		
 		yooxlebot.on_message({text: "hola <@bot_id>", channel: "G0RFP58EM", user: "U03FYGH7K"}, rtm, "bot_id");
 		expect(rtm.sendMessage).to.have.been.called();
       })
       it("should answer if somebody greets the bot on channel", function()
       {
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "hola <@bot_id>", channel: "C0RFP58EM", user: "U03FYGH7K"}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       })
       it("should always answer if somebody greets on the channel", function()
       {
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "hola", channel: "C0RFP58EM", user: "U03FYGH7K"}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       })
       it("should answer on mentioned 'thank you's if group", function()
       {
 		var rtm = chai.spy.object([ 'makeAPICall' ]);       		
 		yooxlebot.on_message({text: "grazie <@bot_id>!", channel: "G0RFP58EM", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
 		expect(rtm.makeAPICall).to.have.been.called.with('reactions.add', {name: 'thumbsup', channel: "G0RFP58EM", timestamp: 1.0})
       })
       it("should answer on mentioned 'thank you's if channel", function()
       {
            var rtm = chai.spy.object([ 'makeAPICall' ]);               
            yooxlebot.on_message({text: "grazie <@bot_id>!", channel: "C0RFP58EM", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.makeAPICall).to.have.been.called.with('reactions.add', {name: 'thumbsup', channel: "C0RFP58EM", timestamp: 1.0})
       })
       it("should answer on direct 'thank you's", function()
       {
 		var rtm = chai.spy.object([ 'makeAPICall' ]);       		
 		yooxlebot.on_message({text: "grazie!", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
 		expect(rtm.makeAPICall).to.have.been.called.with('reactions.add', {name: 'thumbsup', channel: "D0R7PPGNQ", timestamp: 1.0})
       });	
       it("should correctly parse messages like m 2 where 2 is an existing market", function()
       {
            client.get_market_by_id = function(market_id, cb_ok, cb_fail) {
                  return cb_ok({id: 2, descrizione: 'Italia', codice: 'IT'});
            }
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "m 2", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       });  
       it("should correctly parse messages like m 1000 where 1000 is an unexisting market", function()
       {
            client.get_market_by_id = function(market_id, cb_ok, cb_fail) {
                  return cb_fail({id: 2, descrizione: 'Italia', codice: 'IT'});
            }
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "m 1000", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       });
       it("should correctly parse messages like 'm  4' (there's a space).", function()
       {
            client.get_market_by_id = function(market_id, cb_ok, cb_fail) {
                  return cb_ok({id: 4, descrizione: 'Italia', codice: 'IT'});
            }
            var rtm = chai.spy.object([ 'sendMessage' ]);
            yooxlebot.on_message({text: "m  4", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       });
       it("should correctly parse messages like m IT where IT is an existing market", function()
       {
            client.get_markets_by_query = function(query, cb_ok, cb_fail) {
                  return cb_ok({id: 2, descrizione: 'Italia', codice: 'IT'});
            }
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "m IT", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       });
       it("should correctly parse messages like d 3 where 3 is an existing division", function()
       {
            client.get_division_by_id = function(market_id, cb_ok, cb_fail) {
                  return cb_ok({"id": 3, "descrizione": "YOOX", "codice": "yoox"});
            }
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "d 3", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       });
       it("should correctly parse messages like d yo where yo is an existing division", function()
       {
            client.get_divisions_by_query = function(market_id, cb_ok, cb_fail) {
                  return cb_ok({"id": 3, "descrizione": "YOOX", "codice": "yoox"});
            }
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "d yo", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       });
       it("should correctly parse messages like 'd  12' (there's a space).", function()
       {
            client.get_division_by_id = function(market_id, cb_ok, cb_fail) {
                  return cb_ok({"id": 3, "descrizione": "YOOX", "codice": "yoox"});
            }
            var rtm = chai.spy.object([ 'sendMessage' ]);
            yooxlebot.on_message({text: "d  12", channel: "D0R7PPGNQ", user: "U03FYGH7K", ts: 1.0}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called();
       });
   });
});
