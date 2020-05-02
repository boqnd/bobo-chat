const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:dbUser@bobo-chat-g7ymt.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

// module.exports =  function(func){
//      client.connect((err,db) => func(err,db))
// }
client.connect((err, db) => {

    var chat = db.db("chat");
    var users = chat.collection('users');

    function insertUser(username, password, callback) {

        if (err) throw err;

        var myobj = { username: username, password: password };
        users.insertOne(myobj, function (err, res) {
            if (err) throw err;

            callback( res);
        })

    }

    function selectUser(username, callback){
        if (err) throw err;

        users.findOne({username: username}, function (err, result) {
            if (err) throw err;

            if (result)
            {
                //console.log(result);
                callback( {username: username, password: result.password});
            }else{
                callback( null);
            }
        })
    }

    //var user = selectUser('username')

    module.exports.insertUser = insertUser;
    module.exports.selectUser = selectUser;
})


    