const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
let connUser = [];
let inOut = {};
//socket.io connect
io.on('connection', socket => {
  console.log('a user connected');
  let name = '';
  //login
  socket.on('login', user => {
    name = user.nickname;
    connUser.push(name);
    inOut = {
      'login': name
    };
    undateUserName();
    console.log(connUser);
  });

  //chat
  socket.on('chat', msg => {
    io.emit('message', {
      nickname: name,
      msg: msg.chatmsg
    })
  });
  //disconnect
  socket.on('disconnect', () => {
    console.log('user disconnect');
    connUser.splice(connUser.indexOf(name), 1);
    inOut = {
      'logout': name
    };
    undateUserName();
    console.log(connUser);
  });
});

function undateUserName() {
  io.emit('loaduser', connUser, inOut)
};
http.listen(3000, () => {
  console.log('listening on *:3000');
});