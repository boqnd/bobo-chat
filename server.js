const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('trust proxy', true)

require('./routes/loginRoutes')(app);
require('./routes/chatRoutes')(app);

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        //document.cookie
        io.emit('chat message', msg.user + " -> " + msg.msg);
    })
});

app.post('/selectUser', (req, res) => {
  let username= req.body.username;
  res.send (username);
});

app.get('/logout', (req, res) => {
    res.clearCookie('username');

    res.render('login',  {al: false})
})


//<form action="/selectUser" method='get' id="selectUserForm">
http.listen(4002, () => {
    console.log('Server is running!')
});
