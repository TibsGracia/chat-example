

$("#send_username").on('click', function (e) {
    e.preventDefault();
    var online = [];
    var socket = io.connect('http://localhost:8000')
    var message = $("#message-to-send");
    var usernameBtn = $("#send_username");
    var username = $("#username");
    $('.login_form').hide();
    $('.container').show();
    $('#name').text(username.val())
    socket.emit('username', { username: username.val() })
    socket.emit('online');

    $('.chat-message').submit(function () {
        socket.emit('chat message', {
            message: message.val()
        });
        message.val('');
        return false;
    });
    // socket.on('is_online', function () {
    //   io.emit('is_online', socket.username );
    // });

    socket.on('chat message', function (msg) {
        console.log(username.val());
        if (msg.username == username.val()) {
            $('#messages').append('<div class= "box sb1 round">' + msg.message + '</div><br>');
            // window.scrollTo(0, document.body.scrollHeight);
        } else {
            $('#messages').append('<div class= "speech sb">' + msg.username + ": " + msg.message + '</div><br>');
            // $('#messages').append('<br><p>' + msg.username + ' join the group chat'+'</p>');
        }
    });

    socket.on('online', function (msg) {
        if (msg.username != username.val()) {
            $('#messages').append('<div class= "join_chat">' + msg.username + " join the group chat" + '</div>');
        }
    })

    message.bind("keypress", function () {
        socket.emit('typing');
    })

    socket.on('typing', function (msg, err) {
        console.log(err);
        $('#typing').html(msg.username + " is typing a message...");
        setTimeout(function () {
            $("#typing").html('');
        }, 3000);
    })

    socket.on('username', function (data) {
        $('.online_box').empty();
        for (var user in data) {
            var isOnline = data[user].online
            if (isOnline) {
                $('.online_box').append('<div class= "online" id=' + user + '>' + user + " is online" + '</div>');
                current.push(user)
            }
            else {
                $('.online_box').append('<div class= "not_online">' + user + " is offline" + '</div>');
            }
        }

    });

    // socket.on('disconnect', function (msg) {
    //     console.log(err);
    //     $('#messages').append('<div class= "join_chat">' + msg.username + ' left the group chat' + '</div>');
    // })


});