const express = require('express');
const app = express();
var http = require('http').createServer(app);
// const https = require('https');
// const fs = require('fs');

var io = require('socket.io')(http);
require('./loginRoutes')(app);
var cookieParser = require('cookie-parser');



app.use(cookieParser());

app.set('view engine', 'ejs')

var user = "";

app.get('/chat', (req, res) => {
    var cookie = req.cookies.username;

    if (cookie === undefined)
    {
        return res.redirect('/login');
    }else{
        user = cookie;
        res.render('home')
    }
});

app.get('/clear', (req, res) => {
    res.clearCookie('username');
    res.send('cookie foo cleared');
})

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        //document.cookie
        io.emit('chat message', msg.user + " -> " + msg.msg);
    })
});

app.get('/c', (req, res) => {
    res.cookie('name', 'express').send('cookie set'); //Sets name = express
})

app.get('/co', (req, res) => {
    console.log('Cookies: ', req.cookies);
})

http.listen(4002);


// const options = {
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// };
//
// https.createServer(options, app).listen(443);