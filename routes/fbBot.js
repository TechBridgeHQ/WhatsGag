var express = require('express');
var router = express.Router();
var fbBotUtil = require('./lib/fbbot.js');
var gag = require('node-9gag');
var nlp = require('./lib/nlp');
var JOKE = require('./lib/joke');

router.get('/', function (req, res) {
	if (req.query['hub.verify_token'] === 'whatsgag') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong validation token');
})

router.post('/', function (req, res) {
	messaging_events = req.body.entry[0].messaging;
	for (i = 0; i < messaging_events.length; i++) {
		event = req.body.entry[0].messaging[i];
		console.log(event);
		sender = event.sender.id;
		if (event.message && event.message.text) {

			// parse text
			text = event.message.text;
			console.log('input:', text);
			var resp = nlp.parseText(text);
			console.log('text:', resp);

			if(resp=='JOKE') {
				fbBotUtil.sendGenericMessage(sender);
			} else {
				fbBotUtil.sendTextMessage(sender, resp);
			}

	 	} else if(event.postback && event.postback.payload){
	 		var payload = event.postback.payload;
	 		if(payload == 'IMAGE'){
	 			gag.section('funny', 'hot', function (err, res) {
				  fbBotUtil.sendGagMessage(sender, res);	
				});
	 		} else if( payload == 'TEXT'){
	 			var num = Math.floor(Math.random()*JOKE.length);
	 			fbBotUtil.sendTextMessage(sender, JOKE[num]);
	 		}
	 	}
	}
  res.sendStatus(200);
});

module.exports = router;
