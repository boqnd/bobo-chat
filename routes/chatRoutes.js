const db = require('../db/mongoDb');

module.exports = function(app){
    let user = "";

    app.get('/chat', (req, res) => {
        let cookie = req.cookies.username;

        if (cookie === undefined)
        {
            return res.redirect('/login');
        }else{
            user = cookie;
            res.render('home', {chatUser: 'general', oldMessages: []})
        }
    });

    app.post('/selectUser', (req, res) => {
        let cookie = req.cookies.username;

        if (cookie === undefined)
        {
            return res.redirect('/login');
        }else{
            user = cookie;
            let username= req.body.username;

            db.loadMessages(user,username,(messages) => {

                res.render('home', {chatUser: username, oldMessages: messages});

            })

        }
    });
}