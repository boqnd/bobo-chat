const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require('./routes/loginRoutes')(app);
require('./routes/chatRoutes')(app);

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        //document.cookie
        io.emit('chat message', msg.user + " -> " + msg.msg);
    })
});

http.listen(4002, () => {
    console.log('Server is running!')
});
