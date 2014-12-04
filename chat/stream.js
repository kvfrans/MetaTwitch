//helper things to initiate
var socket = io.connect('localhost:5000');

var streamer = "";







function GetUrlValue(VarSearch){
    var SearchString = window.location.search.substring(1);
    var VariableArray = SearchString.split('&');
    for(var i = 0; i < VariableArray.length; i++){
        var KeyValuePair = VariableArray[i].split('=');
        if(KeyValuePair[0] == VarSearch){
            return decodeURIComponent(KeyValuePair[1]);
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






// This will get the first returned node in the jQuery collection.
// var myNewChart = new Chart(ctx);





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
  location.replace("?chat=" + $("#newstreamer").val());
}

function loaded()
{



	streamer = GetUrlValue("chat")
  console.log(streamer);


	if(streamer == null)
	{
		streamer = "Kappa";
	}

    $("#title").html("stats for \"" + streamer + "\"");





	jQuery.get('../trends/trends.json', function(data) {
    // var glacier = JSON.parse(data);
    console.log(data);

    var chatData;

    for(var i = 0; i < data.length; i++)
    {
      // console.log(data[i].message);
      if(data[i].message == streamer)
      {
        chatData = data[i].streamers;
        break;
      }
    }

    var sorted = [];
    for(var key in chatData) {
        sorted[sorted.length] = {message: key, repeats: chatData[key]};
    }
    sorted.sort(compare);
    // chatData.sort();

    console.log(sorted);
    // console.log(chatData.length);

    var chartdata = [];

                  var count = 0;

      for(var i = 0; i < sorted.length; i++)
        {

            console.log("filled row");
            $("#stats").html($("#stats").html() + "<tr><td><a href=\"../stream/?stream=" + sorted[i].message + "\">" + sorted[i].message + "</td><td>" + sorted[i].repeats + "</td></tr>");

            var partcolor;
            var parthighlight;

            count++;
            if(count > 4)
            {
              count = 1;
            }

            if(count == 1)
            {
              partcolor = "#F7464A";
              parthighlight = "#FF5A5E";
            }
            else if(count == 2)
            {
              partcolor = "#46BFBD";
              parthighlight = "#5AD3D1";
            }
            else if(count == 3)
            {
              partcolor = "#FDB45C";
              parthighlight = "#FFC870";
            }
            else if(count == 4)
            {
              partcolor = "#4D5360";
              parthighlight = "#616774";
            }

            chartdata.push({value: sorted[i].repeats, color: partcolor, highlight: parthighlight, label: sorted[i].message})
        }

        var ctx = $("#myChart").get(0).getContext("2d");




        var myDoughnutChart = new Chart(ctx).Doughnut(chartdata,{});

    // sortTable();
});
}

function compare(a,b) {
  if (a.repeats < b.repeats)
     return 1;
  if (a.repeats > b.repeats)
    return -1;
  return 0;
}

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}








