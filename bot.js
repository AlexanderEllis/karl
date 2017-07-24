var SlackBot = require('slackbots');

var config = require('./config');

var bot_token = process.env.SLACK_BOT_TOKEN || config.SLACK_BOT_TOKEN || '';
var bot_name = 'mrsocks';

var params = {
icon_emoji: ':dog:'
};

var bot = new SlackBot({
  token: bot_token,
  name: bot_name
});

bot.on('start', function() {
  bot.postMessageToChannel('general', 'Hello!', params);
});

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype !== 'bot_message') {
    bot.postMessageToChannel('general', 'Hi!!', params);
  }
});