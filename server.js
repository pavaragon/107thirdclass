var http = require('http');
var express = require('express');


/**********************************************
 * Configuration section
 **********************************************/
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

//Allow CORS policy
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}); 


// Db connection settings

var mongoose = require('mongoose');
mongoose.connect('mongodb://ThiIsAPassword:TheRealPassword@cluster0-shard-00-00-euadh.mongodb.net:27017,cluster0-shard-00-01-euadh.mongodb.net:27017,cluster0-shard-00-02-euadh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db = mongoose.connection;

/**********************************************
 * Web SErver functionality 
 **********************************************/



app.get('/', function(req, res){
    console.log("Req on root page");
    res.send("Hello world!");
}); 

app.get('/about', function(req,res){
    res.send("I'm Pavel Aragon");
});

/********************************************** 
Api functionality
**********************************************/

var ItemDb; // this is the model for database items

app.get('/api/items', function(req,res){
    ItemDb.find({}, function(error, data){
        if(error){
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }

        // no error

        res.status(200);
        res.json(data);
    });
});

app.get('/api/items/:name', function(req, res){
    var name = req.params.name;
    ItemDb.find({user: name}, function(error, data){
        if(error){
            console.log("Error reading items");
            res.status(500);
            res.send(error);
        }

        // no error

        res.status(200);
        res.json(data);
    });
});

app.get('/api/items/priceLowerThan/:price', function(req, res){
    var val = req.params.price;
    ItemDB.find({ price: {$lte: val} }, function(error, data){
        if(error){
            console.log("Error reading items");
            res.status(500);res.send(error);
        }
        
        // no error
        res.status(200);res.json(data);
    })
});


app.post('/api/items', function(req,res){
    var itemForMongo = ItemDb(req.body);
    itemForMongo.save( function(error, savedItem){
        if(error){
            console.log("Error savin object", error);
            res.status(500); // eror 500 means internal server error
            res.send(error);
        }

        // no error

        console.log('Object saved!!');
        res.status(201); // 201: created
        res.json(savedItem);
    });

});

/** START THE SERVER AND DB CHECK CONNECTION */

/*  Data types allowed for schemas:
    String, Number, Date, Buffer, Boolean, ObjectId, Array
*/

db.on('open', function(){
    console.log('good, connected to DB');

    var itemSchema = mongoose.Schema({
        code: String,
        title: String,
        price: Number,
        description: String,
        category: String,
        image: String,
        user: String,
    })

    // creat obj constructor

    ItemDb = mongoose.model('itemCH7', itemSchema);
});

db.on('error', function(details){
    console.log('Error: DB connection error');
    console.log('Error details: ' + details);
});

app.listen(8080, function () {
    console.log("Server running at localhost:8080")
});
