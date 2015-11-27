var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var redis = require('redis');

server.listen(8890);

var clientsSessionId = [];

io.on('connection', function (socket) {
  console.log("new client connected");

  var redisClient = redis.createClient();
  redisClient.subscribe('message');

  redisClient.on("message", function(channel, message) {
    console.log("message :"+ message);
	var msgType = message.split("_")[0];
	if(msgType == "start"){
		console.log("start")
		socket.emit(channel, message);
		
	}
	else if(msgType == "played"){
		socket.emit(channel, message);			
		
	}
	else{
		console.log( "unknown info given to server !");
		console.log( msgTab[0], msgTab[1]);
	}
  });

  socket.on('disconnect', function() {
    redisClient.quit();
  });


});

