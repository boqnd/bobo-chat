// const express = require('express');
// var app = express();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);
//
// app.set('view engine', 'ejs')
//
// app.get('/d', (req, res) => {
//     res.render('home')
// });
//
//
// io.on('connection', (socket) => {
//     console.log('a user connected');
// });
//
// http.listen(4000, () => {
//     console.log('listening on *:3000');
// });


const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//require('./loginRoutes')(app);

app.set('view engine', 'ejs')

app.get('/d', (req, res) => {
    res.render('home')
});


io.on('connection', (socket) => {
    console.log('a user connected');
});

http.listen(4000);