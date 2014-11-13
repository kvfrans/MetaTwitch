//helper things to initiate
var socket = io.connect('localhost:5000');
// create an new instance of a pixi stage


socket.on('newChat', function (data)
{
    // console.log(data.user);
    $("#chatbox").html($("#chatbox").html() + '<br>' + data.user + ": " + data.message);
});