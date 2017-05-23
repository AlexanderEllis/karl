var slack = require('@slack/client');
var RtmClient = slack.RtmClient;
var CLIENT_EVENTS = slack.CLIENT_EVENTS;
var RTM_EVENTS = slack.RTM_EVENTS;
var RTM_CLIENT_EVENTS = slack.CLIENT_EVENTS.RTM;

var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);
rtm.start();

// The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
});

var channel = process.env.CHANNEL_ID || ''; // MUST be a channel, group, DM, or user ID (C1234)

rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
  console.log(`Connected to channel ${channel}`);
  rtm.sendMessage('Hello!', channel);
});

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  console.log('Message:', message); 
  rtm.sendMessage('Thank you for your message! Unfortunately I can\'t currently respond.', channel);
});
