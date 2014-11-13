var fs = require("fs");
var host = "localhost";
var port = 5000;
var express = require("express");
var app = express();
//app.use(app.router); //use both root and other routes below
app.use(express.static(__dirname + "")); //use static files in ROOT/public folder
app.get("/", function(request, response){ //root dir
    response.send("Hello!!");
});
var io = require('socket.io').listen(app.listen(process.env.PORT || port));




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
    channels: ['#TSM_Dyrus']
});


// Connect the client to server..
client.connect();
// io.emit("newChat",{message: "troll"});

// Your events..
client.addListener('chat', function (channel, user, message) {
    // If the message starts with !hello..
    // if (message.indexOf('!hello') === 0) {
    //     // Say something
    //     // https://github.com/Schmoopiie/twitch-irc/wiki/Command:-Say
    //     client.say(channel, 'Hey '+user.username+'! How you doing? Kappa');
    // }
    console.log(user.username + " says: " + message);
    io.emit("newChat",{message: message, user: user.username});
});