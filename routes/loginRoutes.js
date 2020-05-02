const bcrypt = require('bcrypt');
const db = require('../db/mongoDb');

module.exports = function(app){

    app.get('/',(req, res) => {
        console.log( req.ip + ' -> /');

        return res.redirect('/login');

    })

    app.get('/login', (req, res) => {
        console.log( req.ip + ' -> /login');

        res.render('login',  {al: false})
    })

    app.get('/signup', (req, res) => {
        console.log( req.ip + ' -> /signup');

        res.render('signup', {al: false})
    })

    app.post('/login', (req, res) => {
        console.log(req.ip + ' -> loging in');

        var username = req.body.username;
        var password = req.body.password;

        if (password !== "") {
            db.selectUser(username, (user) => {
                if (user) {
                    if (bcrypt.compareSync(password, user.password)) {

                        res.cookie('username', username, { maxAge: 900000 });

                        console.log(req.ip + " -> " + username + " just logged in");
                        return res.redirect("/chat")
                    } else {
                        console.log(req.ip + " -> " + username + " entered wrong password => " + password);
                        res.render('login', { al: true, msg: "Wrong username or password." })
                    }
                } else {
                    console.log(req.ip + " -> " + "username " + username + " does not exist");
                    res.render('login', { al: true, msg: "Wrong username or password." })
                }
            })
        } else {
            console.log(req.ip + " -> " + username + " entered blank password");
            res.render('login', { msg: "Password can not be blank.", al: true })
        }
    })

    app.post('/signup', async (req, res) => {
        console.log(req.ip + " -> " + ' signing up');

        var username = req.body.username;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;

        let hash = bcrypt.hashSync(password, 10);

        db.selectUser(username, function(user){
            if (!user)
            {
                if (password !== "") {
                    if (password === confirmPassword) {
                        db.insertUser(username, hash, (dbResponse) => {
                            console.log(req.ip + " -> " + "Account " + username + " created");
                            res.render('login', { msg: "Account " + username + " created. Now you can login.", al: true })
                        })
                    }else {
                        console.log(req.ip + " -> " + "Wrong confirm password => " + password + " != " + confirmPassword);
                        res.render('signup', { msg: "You did not confirm the password correctly.", al: true })
                    }
                }else {
                    console.log(req.ip + " -> " + "Blank password");
                    res.render('signup', { msg: "Password can not be blank.", al: true })
                }
            }else {
                console.log(req.ip + " -> " + "Username " + username + " exists");
                res.render('signup', { msg: "Username " + username + " already exists.", al: true })
            }
        })
    })
}