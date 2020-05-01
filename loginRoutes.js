const express = require('express');
const app = express();
const mysql = require('mysql');
const bcrypt = require('bcrypt');

module.exports = function(app){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "rootroot"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });

    con.query("use chat");


    app.set('view engine', 'ejs')
    app.use(express.urlencoded({ extended: true }))

    app.get('/',(req, res) => {
        return res.redirect('/login');
    })

    app.get('/login', (req, res) => {
        res.render('login',  {al: false})
    })

    app.get('/signup', (req, res) => {
        res.render('signup', {al: false})
    })

    app.post('/login', (req, res) => {
        var username = req.body.username;
        var password = req.body.password;

        if (password !== "") {

            con.query("select password from users where username='" + username + "'", (err, result) => {

                if (result.length > 0) {

                    if (bcrypt.compareSync(password, result[0].password)) {

                        res.cookie('username', username, { maxAge: 360000 });

                        return res.redirect("/chat")
                    } else {
                        res.render('login', { al: true, msg: "Wrong username or password." })
                    }
                }else {
                    res.render('login', { al: true, msg: "Wrong username or password." })
                }

            })
        } else {
            console.log("blank password");
            res.render('login', { msg: "Password can not be blank.", al: true })
        }
    })


    app.post('/signup', async (req, res) => {
        console.log('start');

        var username = req.body.username;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;


        let hash = bcrypt.hashSync(password, 10);


        await con.query("select * from users where username='"+username+"'",(err, result) => {

                if (result.length === 0)  {
                    if (password !== "" ) {
                        if (password === confirmPassword) {
                            con.query("INSERT INTO users (username, password) VALUES ('" + username + "', '" + hash + "');", (err, result) => {
                                if (err) throw err;
                                console.log("Account " + username + " created");
                                res.render('login', { msg: "Account " + username + " created. Now you can login.", al: true })
                            })
                        } else {
                            console.log("confirm error");
                            res.render('signup', { msg: "You did not confirm the password correctly.", al: true })
                        }
                    }else {
                        console.log("blank password");
                        res.render('signup', { msg: "Password can not be blank.", al: true })
                    }
                }else{
                    console.log("username exists");
                    res.render('signup', {msg: "Username "+username+" already exists.", al: true})
                }
            }
        )})
}