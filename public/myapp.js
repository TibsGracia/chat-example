$("#username").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#send_username").on('click');
    }
});

$("#send_username").on('click', function (e) {
    e.preventDefault();
    var socket = io.connect('http://localhost:8000')
    var message = $("#message-to-send");
    var username = $("#username");
    $('.login_form').hide();
    $('.container').show();
    $('#name').empty();
    $('#name').append("<h5><img src='https://icon-library.net/images/username-and-password-icon/username-and-password-icon-15.jpg' alt='avatar' class='user'/>" + username.val() + "</h5>");
    // $('#name').text(username.val())
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
            $('#messages').append('<div class= "box sb1 round"><b>me:</b> ' + msg.message +'<p class="time">'+moment().format('MMM Do YYYY, h:mm:ss a')+ '</p></div><br>');
            // window.scrollTo(0, document.body.scrollHeight);
        } else {
            $('#messages').append('<div class= "speech sb"><b>' + msg.username + ":</b> " + msg.message + '<p class="time">'+moment().format('MMM Do YYYY, h:mm:ss a')+ '</p></div><br>');
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
        $('.online_box').append("<h3><img src='https://cdn.pixabay.com/photo/2016/04/15/18/05/computer-1331579_960_720.png' alt='avatar' class='users'/>USERS</h3>");
        for (var user in data) {
            var isOnline = data[user].online
            if (isOnline) {
                $('.online_box').append('<div class= "online"' + user + " is online" + '</div>');
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