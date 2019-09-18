var socket = io.connect('http://localhost:3000')
    var message = $("#message-to-send");
    var usernameBtn = $("#send_username");
    var username = $("#username")


    $('.chat-message').submit(function (e) {
      e.preventDefault();
      socket.emit('chat message', message.val());
      message.val('');
      return false;
    });
    socket.on('is_online', function (username) {
      $('#messages').append($('<li>').html(username));
    });

    socket.on('chat message', function (msg) {
      console.log(username.val())
      $('#messages').append($('<div')).addClass("box sb1 round">' + msg.message + '</div>');
      // window.scrollTo(0, document.body.scrollHeight);
    });

    usernameBtn.click(function () {
      $("#name").text(username.val())
      socket.emit('chat_username', username.val());

    })

    message.bind("keypress", function () {
      socket.emit('typing')
    })

    socket.on('typing', function (msg) {
      $('#messages').html("<p><i>" + msg.username + " is typing a message..." + "</i></p>")
    })

  });