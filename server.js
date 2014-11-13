var irc = require('twitch-irc');

// Calling a new client..
var client = new irc.client({
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action'],
        logging: false,
        tc: 3
    },
    identity: {
        username: 'tacoexplosion',
        password: 'oauth:250js88su6tihuj85cxcaywmq0c6my'
    },
    channels: ['#imaqtpie']
});

// Connect the client to server..
client.connect();

// Your events..
client.addListener('chat', function (channel, user, message) {
    // If the message starts with !hello..
    // if (message.indexOf('!hello') === 0) {
    //     // Say something
    //     // https://github.com/Schmoopiie/twitch-irc/wiki/Command:-Say
    //     client.say(channel, 'Hey '+user.username+'! How you doing? Kappa');
    // }
    console.log(user.username + " says: " + message);
});