
yooxlebot = require("../lib/j00xslebot");
var chai = require('chai'), spies = require('chai-spies');
chai.use(spies);

var expect = chai.expect;

describe("yooxlebot", function() {
   describe("on message event", function() {
       it("should answer if somebody greets the bot on group", function()
       {
 		var rtm = chai.spy.object([ 'sendMessage' ]);       		
 		yooxlebot.on_message({text: "hola <@bot_id>", channel: "G0RFP58EM", user: "U03FYGH7K"}, rtm, "bot_id");
 		expect(rtm.sendMessage).to.have.been.called.with("Bella <@U03FYGH7K>!", "G0RFP58EM");
       })
       it("should answer if somebody greets the bot on channel", function()
       {
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "hola <@bot_id>", channel: "C0RFP58EM", user: "U03FYGH7K"}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called.with("Bella <@U03FYGH7K>!", "C0RFP58EM");
       })
       it("should always answer if somebody greets on the channel", function()
       {
            var rtm = chai.spy.object([ 'sendMessage' ]);               
            yooxlebot.on_message({text: "hola", channel: "C0RFP58EM", user: "U03FYGH7K"}, rtm, "bot_id");
            expect(rtm.sendMessage).to.have.been.called.with("Bella <@U03FYGH7K>!", "C0RFP58EM");
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
   });
});
