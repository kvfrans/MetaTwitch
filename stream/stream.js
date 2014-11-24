//helper things to initiate
var socket = io.connect('localhost:5000');

var streamer;







function GetUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            return KeyValuePair[1];
        }
    }
}


// $.ajax({
// url: "trends.json",
// success: function (data) {
//   var obj = JSON.parse(data);
//   console.log(obj);

//   // for(var i = 0; i < obj.streamers.length; i++)
//   //   {

//   //       console.log("filled row");
//   //       $("#stats").html($("#stats").html() + "<tr><td>lol</td><td>1</td></tr>");
//   //       // }

//   //       streamerstats[data.streamers[i].name.toLowerCase()] = {name: data.streamers[i].name, chats: 0, secondslate: 0};

//   //   }
// }
// });

function compare(a,b) {
  if (a.repeats < b.repeats)
     return 1;
  if (a.repeats > b.repeats)
    return -1;
  return 0;
}









socket.on('newChat', function (data)
{
  if(data.channel == streamer)
  {
    $("#chats").html($("#chats").html() + '<br>' + data.user + ": " + data.message);
  }

});


function changeStreamer()
{
  // streamer =
  location.replace("?stream=" + $("#newstreamer").val());
}

function loaded()
{

	streamer = GetUrlValue("stream");
  $("#title").html("stats for \"" + streamer + "\"");

	if(streamer == null)
	{
		streamer = "scarra";
	}


	jQuery.get('streamdata.json', function(data) {
    // var glacier = JSON.parse(data);
    console.log(data);

    data = data[streamer];

    data.sort(compare);

      for(var i = 0; i < data.length; i++)
        {

            console.log("filled row");
            $("#stats").html($("#stats").html() + "<tr><td><a href=\"../chat/?chat=" + data[i].message + "\">" + data[i].message + "</td><td>" + data[i].repeats + "</td></tr>");
            // $("#stats").html($("#stats").html() + "<tr><td>\"" + data[i].message + "\"</td><td>" + data[i].repeats + "</td></tr>");
        }

    // sortTable();
});
}









