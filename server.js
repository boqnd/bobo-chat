const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const db = require('./db/mongoDb');

app.set('view engine', 'ejs');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', true)

require('./routes/loginRoutes')(app);
require('./routes/chatRoutes')(app);

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        //document.cookie
        let sender = data.user;
        let receiver = data.receiver;
        let message = data.user + " - " + data.msg;

        if (data.receiver !== 'general') {
            db.insertMessage(sender, receiver, message, () => {
            })
        }

        io.emit('chat message', {sender:sender, receiver:receiver, message:message});
    })
});

app.get('/test',(req,res) => {
    db.insertMessage('user4','user2','asas', () =>{});
})

//<form action="/selectUser" method='get' id="selectUserForm">
http.listen(4002, () => {
    console.log('Server is running!')
});
