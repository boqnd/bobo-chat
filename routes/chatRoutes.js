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
            res.render('home', {chatUser: 'general', oldMessages: [], al: null})
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

            if (username === 'general') {
                res.render('home', {chatUser: 'general', oldMessages: [], al: null})
            }else {
                db.selectUser(username, (response) => {
                    if (response) {
                        db.loadMessages(user, username, (messages) => {

                            res.render('home', { chatUser: username, oldMessages: messages, al: null });

                        })
                    } else {
                        res.render('home', {
                            chatUser: 'general',
                            oldMessages: [],
                            al: 'No user with username ' + username
                        })
                    }

                })
            }



        }
    });
}