const express     = require('express');
const http        = require('http');
const path    	  = require('path');
const compression = require('compression')
const app         = express();
const s_server    = express().listen(9099, '0.0.0.0');
const io 	      = require('socket.io').listen(s_server);

var clients       = [];
var currentCode   = "";
var oneYear       = 1 * 365 * 24 * 60 * 60 * 1000;

app.use(compression());

app.use(express.static(path.join(__dirname, 'dist'), { maxAge: oneYear }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});


io.on('connection', function(socket){
	console.log('User connected id: ' + socket.id);
	clients.push(socket);
	clients.forEach(function(client) {
		console.log(client.id);
		client.emit('updateCode', currentCode);
	});

	socket.on('disconnect', function() {
		var found 		 = false;
		var tmp_index    = 0;
		var i            = 0;      
		clients.forEach(function(item) {
			if(item.id == socket.id){
				found = socket.id;
				tmp_index = i;
			}
			i++;
		});
		if(found){
			clients.splice(tmp_index, 1);
			console.log("User Desconnected: " + found);
		}
	});

	socket.on('changeCode', function(newCode) {
		currentCode = newCode;
		console.log("Update code to all clients");
		console.log(newCode);
		clients.forEach(function(client) {
			console.log(client.id);
			client.emit('updateCode', newCode);
		});
	});
});


const server = http.createServer(app).listen(9098, '0.0.0.0');
console.log('WebApp running on http://localhost:9098');
console.log('Socket running on http://localhost:9099');