//helper things to initiate
// var socket = io.connect('localhost:5000');



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

jQuery.get('trends.json', function(data) {
    // var glacier = JSON.parse(data);
    console.log(data);

    data.sort(compare);

      for(var i = 0; i < 50; i++)
        {

            console.log("filled row");
            $("#stats").html($("#stats").html() + "<tr><td>\"" + data[i].message + "\"</td><td>" + data[i].repeats + "</td></tr>");
        }

    // sortTable();
});


function compare(a,b) {
  if (a.repeats < b.repeats)
     return 1;
  if (a.repeats > b.repeats)
    return -1;
  return 0;
}










