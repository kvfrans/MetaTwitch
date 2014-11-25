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


 //logging messages to check for repeats
var recentChats = [];
var repeatedChats = [];

var streamerChats = {};

var streamerRatio = {};


var trendsjson = require('./trends/trends.json');

repeatedChats = trendsjson;

var streamdata = require('./stream/streamdata.json');

streamerChats = streamdata;
// console.log(repeatedChats);

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

    var http = require('https');

    // game.replaceAll("%E9","adsadasdsadsadasd");
    console.log(game);

    if(game.indexOf("\u00e9") > -1)
    {
        console.log("HEYEYHEY");
    }
    else
    {



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

        console.log("attempting to load streamers for " + options2.host + options2.path);


        var json = JSON.parse(body);

        // var tempstreamers = [];
        console.log(json);
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
                    username: 'tacomod1442',
                    password: 'oauth:h86863wkv1ozgufno15uhxoeyg98gq'
                },
                channels: streamernames
                // channels: ["moonmeander"]
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

                var lowchan = channel.replaceAll("#","");

                var didFind = false;
                for(var i = 0; i < recentChats.length; i++)
                {
                    if(recentChats[i] == message)
                    {
                        // console.log("two chts of " + message);
                        var foundInData = false;
                        for(var i = 0; i < repeatedChats.length; i++)
                        {
                            if(repeatedChats[i].message == message)
                            {
                                foundInData = true;
                                repeatedChats[i] = {message: message, repeats: repeatedChats[i].repeats + 1, streamers: repeatedChats[i].streamers};

                                if(repeatedChats[i].streamers[lowchan] != null)
                                {
                                    repeatedChats[i].streamers[lowchan] = repeatedChats[i].streamers[lowchan] + 1;
                                }
                                else
                                {
                                    repeatedChats[i].streamers[lowchan] = 1;
                                }

                                break;
                            }
                        }

                        if(foundInData)
                        {
                            // repeatedChats[i] = {message: message, repeats: repeatedChats[i].repeats + 1};
                        }
                        else
                        {
                            repeatedChats.push({message: message, repeats: 1, streamers: {}});
                            repeatedChats[repeatedChats.length-1].streamers[lowchan] = 1;
                        }

                        if(streamerChats[lowchan] == null)
                        {
                            streamerChats[lowchan] = [];
                            streamerChats[lowchan].push({message: message, repeats: 1});
                            // console.log("new");
                        }
                        else
                        {
                            // console.log("no new");
                            var foundOther = false;
                            for(var x = 0; x < streamerChats[lowchan].length; x++)
                            {
                                if(streamerChats[lowchan][x].message == message)
                                {
                                    streamerChats[lowchan][x] = {message: message, repeats: streamerChats[lowchan][x].repeats + 1};
                                    foundOther = true;
                                }
                            }

                            if(!foundOther)
                            {
                                streamerChats[lowchan].push({message: message, repeats: 1});
                            }
                        }

                        if(streamerRatio[lowchan] == null)
                        {
                            streamerRatio[lowchan] = {copy: 0, real: 0};
                        }
                        else
                        {
                            streamerRatio[lowchan].copy += 1;
                        }


                        fs.writeFile('trends/trends.json', JSON.stringify(repeatedChats), function (err) {
                              if (err) return console.log(err);
                              // console.log('Hello World > helloworld.txt');
                        });


                        didFind = true;
                        break;
                    }
                    else
                    {
                    }
                }
                if(!didFind)
                {
                    recentChats.push(message);
                    if(streamerRatio[lowchan] == null)
                    {
                        streamerRatio[lowchan] = {copy: 0, real: 0};
                    }
                    else
                    {
                        streamerRatio[lowchan].real += 1;
                    }
                }


                fs.writeFile('stream/ratio.json', JSON.stringify(streamerRatio), function (err) {
                              if (err) return console.log(err);
                              // console.log('Hello World > helloworld.txt');
                        });


                // console.log(streamerChats);
                fs.writeFile('stream/streamdata.json', JSON.stringify(streamerChats), function (err) {
                              if (err) return console.log(err);
                              // console.log('Hello World > helloworld.txt');
                        });


            });
        }

        //JSON = THE JSON WITH ALL TOP 100 GAMES ON TWITCH.
      })
    });
    }
}

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});











String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}



