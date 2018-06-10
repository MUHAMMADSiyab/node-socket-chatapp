
// Loading modules
var express = require('express');
var app = express();
var socket = require('socket.io');
var fs = require('fs');
var db = require('./connection');

// Setting view path
app.use(express.static('public'));

// When route is /
app.get('/', (req, res) => {
    res.sendFile('index');
});

var server = app.listen(4000, function(){
    console.log('Server listening on port 4000');
});

// Socket.IO
var io = socket(server);

// On connection
io.on('connection', function(socket){

    var chatData = [];

    let query = 'SELECT * FROM `chat_data`';
    db.query(query, function(err, data){
        if (err) {
            console.log('Error reading data from DB');
        } else {       
            for (let i = 0; i < data.length; i++) {
                chatData.push(data[i]);
            }
        }
    });

    // Listening to `user entered` event
    socket.on('user entered', function(data){
        // Emitting `user entered` event
        io.emit('user entered', chatData);
    });

    // Listening to `chat` event
    socket.on('chat', function(data){

        // Saving chat data to database
        let q = 'INSERT INTO `chat_data` (`id`, `sender`, `message`) VALUES (null, "' + data.username +  '","' + data.msg + '")';
        db.query(q, function(err) {
            if (err) {
                console.log('Error inserting data');
            } else {
                console.log('data inserted');
            }
        });

        // Emitting `chat` event
        io.sockets.emit('chat', data);
    });

    // Listening to `typing` event 
    socket.on('typing', function(data){
        
        // Emitting `typing` event
        socket.broadcast.emit('typing', data);
    });

});

