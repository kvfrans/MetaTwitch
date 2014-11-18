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

var streamersReady = false;

// io.emit("hasStreamers",{});


 io.on('connect', function() {
    // console.log('connected');
    if(streamersReady)
    {
        io.emit("hasStreamers",{streamers: streamers});
    }
 });




var streamers = [];


var http = require('https');

var options = {
  host: 'api.twitch.tv',
  path: '/kraken/games/top?limit=10'
};

var req = http.get(options, function(res) {
  // console.log('STATUS: ' + res.statusCode);
  // console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    // console.log('BODY: ' + body);

    var json = JSON.parse(body);
    // console.log(json);
    for(var i = 0; i < json.top.length; i++)
    {
        var name = json.top[i].game.name;
        name = name.replaceAll(" ","+");
        if(i < json.top.length - 1)
        {
            addStreamersForGame(name,false);
        }
        else
        {
            addStreamersForGame(name,true);
        }

    }

    //JSON = THE JSON WITH ALL TOP 100 GAMES ON TWITCH.
  })
});

function addStreamersForGame(game,isLast)
{
    console.log("attempting to load streamers for " + game);
    var http = require('https');

    var options2 = {
      host: 'api.twitch.tv',
      path: '/kraken/streams?limit=10&game=' + game
    };

    var req = http.get(options2, function(res) {
      // console.log('STATUS: ' + res.statusCode);
      // console.log('HEADERS: ' + JSON.stringify(res.headers));

      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        var body = Buffer.concat(bodyChunks);
        // console.log('BODY: ' + body);


        var json = JSON.parse(body);

        // var tempstreamers = [];
        // console.log(json);
        for(var i = 0; i < json.streams.length; i++)
        {
            var name = json.streams[i].channel.display_name;
            var game = json.streams[i].game;
            // name = name.replaceAll(" ","+");
            // addStreamersForGame(name);
            // console.log(name);
            // tempstreamers.push(name);
            var data = {
                name: name,
                game:game
            }
            streamers.push(data);
        }
        // console.log("added streamers for " + game + " and they are " + tempstreamers);


        if(isLast)
        {
            console.log(streamers);
            io.emit("hasStreamers",{streamers: streamers});
            streamersReady = true;
            // io.emit("hasStreamers",{message: message, user: user.username, channel: channel});

            var irc = require('twitch-irc');

            var streamernames = [];

            for(var i = 0; i < streamers.length; i++)
            {
                streamernames.push(streamers[i].name);
            }

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
                channels: streamernames
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
                console.log("[" + channel + "] " + user.username + ": " + message);
                io.emit("newChat",{message: message, user: user.username, channel: channel.replaceAll("#","")});
            });
        }

        //JSON = THE JSON WITH ALL TOP 100 GAMES ON TWITCH.
      })
    });
}

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});



String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}



