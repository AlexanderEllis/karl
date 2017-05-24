var slack = require('@slack/client');
var WebClient = slack.WebClient;

// Bot User OAuth Access Token from app's OAuth & Permissions page
var token = process.env.SLACK_API_TOKEN || '';

// initialize node slack client
var web = new WebClient(token);

var channel = process.env.CHANNEL_ID || '';

web.chat.postMessage(channel, 'Hello there', function(err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log('Message sent: ', res);
  }
});