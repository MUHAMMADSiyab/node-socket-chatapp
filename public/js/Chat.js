$(document).ready(function(){

    var socket = io.connect('https://node-socket-chatapp.herokuapp.com/');
    var users = [];
    // User 
    $('#user-form').submit(function(e){
        e.preventDefault();

        users.push($('#userName').val());
        $('#user-form').hide();
        $('#chat-form, #chat-messages-area').fadeIn('fast');

        // User entered
        socket.emit('user entered', {});
    });

    // On user entry
//     socket.on('user entered', function(data){
//         data.forEach(function(item){
//             $('#chat-messages-area .chat').prepend('<p><strong>' + item.sender + '</strong>: ' + item.message + '</p>');
//         });
//     })

    // Chat
    $('#chat-form').submit(function(e){
        e.preventDefault();

        socket.emit('chat', {
            username: users[0],
            msg: $('#message').val()
        });
        
        $('#message').val('');

    });

    socket.on('chat', function(data){
        $('.typing').empty();
        $('#chat-messages-area .chat').prepend('<p><strong>' + data.username + '</strong>: ' + data.msg + '</p>');
     });


    //  Typing
     $('#message').keypress(function(){
        socket.emit('typing', users[0]);
     });

     socket.on('typing', function(data){
        $('.typing').html('<small class="text-muted"><em>' + data + ' is typing..</em></small>');
     });

});
