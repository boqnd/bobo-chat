const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUser@bobo-chat-g7ymt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });

client.connect((err, db) => {

    let chat = db.db("chat");
    let users = chat.collection('users');

    function insertUser(username, password, callback) {
        if (err) throw err;

        users.insertOne({ username: username, password: password }, function (err, res) {
            if (err) throw err;

            callback(res);
        })
    }

    function selectUser(username, callback){
        if (err) throw err;

        users.findOne({username: username}, function (err, result) {
            if (err) throw err;

            if (result) {
                callback( {username: username, password: result.password})
            }
            else{
                callback( null);
            }
        })
    }


    module.exports.insertUser = insertUser;
    module.exports.selectUser = selectUser;
})


    