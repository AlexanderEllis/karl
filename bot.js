var SlackBot = require('slackbots');

var config = require('./config');

console.log(config);

var bot_token = process.env.SLACK_BOT_TOKEN || config.SLACK_BOT_TOKEN || '';
var bot_name = 'mrsocks';

var params = {
  icon_emoji: ':dog:'
};

let storage = {};

var bot = new SlackBot({
  token: bot_token,
  name: bot_name
});

bot.on('start', function() {
  let firstMessage = `Hello!  I've just joined your channel.`  
  askUserNextAction(firstMessage);
});

bot.on('message', function(data) {
  if (data.type === 'message' && data.subtype !== 'bot_message') {
    let user = data.user;

    // Make sure the user has storage
    if (!storage[user]) {
      storage[user] = {};
    }
    console.log(storage[user]);

    // If there is no status or we're at the top, handle
    if (!storage[user].status || storage[user].status === 'top') {
      handleFromTop(data.user, data.text);
    } else {
      switch (storage[user].status) {
        case 'add':
          handleAdd(user, data.text);
        case 'reviewing':
      }
    }
  }
});

function askUserNextAction(messageToIncludeFirst) {
  botMessage = `${messageToIncludeFirst}\nWhat would you like to do next? As a reminder, you can say *review* or *add*.`
  bot.postMessageToChannel('general', botMessage, params);
}

// Handle option from first message
function handleFromTop(user, message) {
  let botMessage = '';
  switch (message) {
    case 'review':
      // record user as reviewing
      setUserStatusTo(user, 'review');
      let items = getListOfItems(user);
      botMessage = `Great! Let's review! Here are your items:\n ${items}`
      break;
    case 'add':
      // record user as adding
      setUserStatusTo(user, 'add');
      botMessage = `Please enter the title followed by a short description. *Example:* \n Draw: Practice drawing unicorns`;
      break;
    default:
      // nothing found here, sorry team
      botMessage = `Sorry, I didn't understand that!  You can say *review* or *add*.`
  }
  bot.postMessageToChannel('general', botMessage, params);
}

function handleAdd(user, message) {
  let botMessage;
  if (message.indexOf(': ') === -1) {
    botMessage = 'Incorrect format!  Please try again.';
    bot.postMessageToChannel('general', botMessage, params);
  } else {
    let splitMessage = message.split(': ');
    let title = splitMessage[0];
    let details = splitMessage[1];
    addItemToStorage(user, title, details);
    botMessage = `Great!  ${title} was added to your task list.`
    setUserStatusTo(user, 'top');
    askUserNextAction(botMessage);
  }
}

// Set user status
function setUserStatusTo(user, status) {
  storage[user].status = status;
}

// For now, add item
function addItemToStorage(user, title, details) {
  if (!storage[user].tasks) {
    storage[user].tasks = [{title, details}];
  } else {
    storage[user].tasks.push({title, details});
  }
}

function getListOfItems(user) {
  if (!storage[user].tasks) {
    return `No items found!`;
  } else {
    let storedItems = storage[user].tasks;
    let formattedItems = '';
    for (let i = 0; i < storedItems.length; i++) {
      formattedItems += storedItems[i].title + '\n';
    }
    return formattedItems;
  }
}