module.exports = function(app){
    let user = "";

    app.get('/chat', (req, res) => {
        let cookie = req.cookies.username;

        if (cookie === undefined)
        {
            return res.redirect('/login');
        }else{
            user = cookie;
            res.render('home')
        }
    });
}