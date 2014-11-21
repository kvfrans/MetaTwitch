//helper things to initiate
var socket = io.connect('localhost:5000');

var streamerstats = {};

var isStarted = false;

var secondspast = 0;
// create an new instance of a pixi stage


socket.on('newChat', function (data)
{
    // console.log(data.user);
    if(isStarted)
    {
        if(streamerstats[data.channel].chats <= 0)
        {
            streamerstats[data.channel].secondslate = secondspast;
        }
        // $("#chatbox").html($("#chatbox").html() + '<br>' + "[" + data.channel + "] " + data.user + ": " + data.message);
        // console.log(data.channel);
        streamerstats[data.channel].chats++;
        // console.log(streamerstats[data.channel].chats);
        $("#chats-" + data.channel).html("chats: " + streamerstats[data.channel].chats);

        $("#cps-" + data.channel).html("CPM: " + streamerstats[data.channel].chats/(secondspast - streamerstats[data.channel].secondslate));
    }

});

socket.on('hasStreamers', function (data)
{

    console.log("get shrekt");
    for(var i = 0; i < data.streamers.length; i++)
    {

        console.log("filled row");
        $("#stats").html($("#stats").html() + "<div class=\"col-md-3\"><div class=\"panel panel-default\"><div class=\"panel-heading\"><h3 class=\"panel-title\">"+ data.streamers[i].name +"</h3></div><div class=\"panel-body\"><div id=\"game" + data.streamers[i].name.toLowerCase() + "\"> Playing: "+ data.streamers[i].game +"</div><div id=\"chats-" + data.streamers[i].name.toLowerCase() + "\">Warming up chats...</div><div id=\"cps-" + data.streamers[i].name.toLowerCase() + "\">Warming up CPS...</div><div id=\"trendcount-" + data.streamers[i].name.toLowerCase() + "\">Warming up number of trends...</div></div></div></div>");
        // }

        streamerstats[data.streamers[i].name.toLowerCase()] = {name: data.streamers[i].name, chats: 0, secondslate: 0};

    }

    isStarted = true;


    jQuery.get('stream/streamdata.json', function(data) {
    // var glacier = JSON.parse(data);
    // console.log(data);

    // data = data[streamer];

    for (var key in data) {
        console.log(data[key].length);

        $("#trendcount-" + key.toLowerCase()).html("trends: " + data[key].length);

        // console.log(data[key]);
        // for(var i = 0; i < data[key].length, i++)
        // {

        // }
  // do something with key
    }

    // sortTable();
    });
    // console.log(data.user);

});


window.setInterval(function(){
  /// call your function here
  secondspast++;
}, 1000);


// socket.on()



function changeStreamer()
{
    console.log("LOL!");
}