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
            res.render('home', {chatUser: 'general', oldMessages: [], al: 'This is the global chat. Everyone can see your messages. No messages are stored.'})
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
                res.render('home', {chatUser: 'general', oldMessages: [], al: 'This is the global chat. Everyone can see your messages. No messages are stored.'})
            }else {
                db.selectUser(username, (response) => {
                    if (response) {
                        db.loadMessages(user, username, (messages) => {

                            res.render('home', { chatUser: username, oldMessages: messages, al: 'This is private chat with ' +  username + ". Your messages will be saved."});

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