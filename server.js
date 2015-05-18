var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var multer       = require('multer');
var express      = require("express");
var mongoose     = require("mongoose");
var cors 	     = require("cors"); // will accept other connections
var python_shell = require('python-shell');

var app        = express();

app.use(cors());
mongoose.connect('mongodb://localhost/spentMuch');

var usrSchema = new mongoose.Schema({
	user:String,
	pass:String,
	spending:[{
		date:String,
		total: Number,
		bought:[String]
	}]
});

var User = mongoose.model('user',usrSchema);

// configure app
app.use(express.static(__dirname + '/dist'));   // app.set('view engine','ejs');
// app.engine('html', require('ejs').renderFile); // set rendering engine
app.set('views', path.join(__dirname,'dist'));    // folder that contains ideal scripts

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(multer());

// this is the client asking for data
app.get('/get',function(req,res){ // send blam:0 back
	console.log('get');
	console.log(req.body);

	res.status(201);
	res.json({"blam":0});
	res.end();
});

app.get('/getTable/:id/:pass',function(req,res){ // send value back
	var query = {
		"user":req.params.id, 
		"pass":req.params.pass
	};
	console.log("Got a table request from: " + req.params.id);
	User.findOne(query,function(err,doc){
		res.status(201);
		res.send(doc.spending);
		res.end();
	});
});

function getDataString(data,index)
{
	var string = "";
	for(var i =0; i < data[index].bought.length; i++)
	{
		if(i == 0)
		{
			string += data[index].bought[0];
		}
		else if(i != data[index].bought.length -1)
		{
			string += ", " + data[index].bought[i];
		}
		else
		{
			string += ", and " + data[index].bought[i];
		}
	}
	return string;
}

// Finds largest and smallest year and purchase.
function getInfo(spending)
{
	var mean                  = 0;
	var largestPurchaseIndex  = 0;
	var SmallestPurchaseIndex = 0;
	var largestYear			  = parseInt(spending[0].date.split('-')[0]);
	var smallestYear          = largestYear

	for(var i = 0; i < spending.length; i++)
	{
		// add to find mean later
		mean += spending[i].total;

		// teest values to see if large or small for purchase value and year
		if(spending[largestPurchaseIndex].total < spending[i].total)
		{
			largestPurchaseIndex = i;
		}
		else if(spending[SmallestPurchaseIndex].total > spending[i].total)
		{
			SmallestPurchaseIndex = i;
		}

		var year = parseInt(spending[i].date.split('-')[0]);
		if(largestYear < year)
		{
			largestYear = year;
		} 
		else if( smallestYear > year)
		{
			smallestYear = year;
		}
	}

	// Calculate mean
	mean /= spending.length;

	// Construct purchase string
	var largeString = getDataString(spending,largestPurchaseIndex);
	var smallString = getDataString(spending,SmallestPurchaseIndex);

	// Construct dictionary for table containing largest and smallest purchase
	var largestPurchase = {
		"spent": spending[largestPurchaseIndex].total,
		"items": largeString
	};

	var smallestPurchase = {
		"spent": spending[SmallestPurchaseIndex].total,
		"items": smallString
	};

	// Build general information difcionary
	var generalInformation = {
		"largestPurchase":  largestPurchase,
		"smallestPurchase": smallestPurchase,
		"mean": mean,
		"largestYear": largestYear,
		"smallestYear": smallestYear
	};

	return generalInformation;
}

// this will build the dictionary for all the key values, years
function buildYearDictionary(largestYear, smallestYear,difference)
{
	var totalKeys={}
	for(var i = 0; i <= difference; i++)
	{
		totalKeys[smallestYear+i] = 0;
	}
	return totalKeys;
}

// Find largest value in dictionary
function largestValue(totalKeys, smallestYear,difference)
{
	var largestTotal = totalKeys[smallestYear];
	for(var i = 1; i <= difference; i++)
	{
		var newTotal = totalKeys[smallestYear + i];
		if(largestTotal < newTotal)
		{
			largestTotal = newTotal;
		}
	}

	return largestTotal
}

// This function will be used to gather the information which will be used to generate
// the graph on the infor page. 
function getGraphInformation(spending,largestYear,smallestYear)
{
	// create array of years
	var difference = largestYear - smallestYear;

	// create keys array
	var keys = [];
	for(var i = 0; i <= difference; i++)
	{
		keys.push(smallestYear+i);
	}
 
	// build dictionary to put key values into
	var totalKeys = buildYearDictionary(largestYear,smallestYear,difference);

	// Loop through spending to find all of the values for that year
	for(var i = 0; i < spending.length; i++)
	{
		totalKeys[parseInt(spending[i].date.split('-')[0])] += spending[i].total;
	}

	// get highest values in totals for graph
	// Largest total will be used for defining graph Y axis
	var largestTotal = largestValue(totalKeys, smallestYear, difference);

	// create return dictionary
	var graphInformation = {
		"keys": keys,
		"spendOnYear": totalKeys,
		"largestTotal": largestTotal
	};

	return graphInformation;
}

app.get('/getGraphAndInfo/:id/:pass',function(req,res){
	var query = {
		"user": req.params.id,
		"pass": req.params.pass
	}
	console.log("Got a graph and info request from: " + req.params.id);
	User.findOne(query,function(err,doc){
		var spending = doc.spending;

		var generalInformation = getInfo(spending);

		var sendToClient = {
			"genInfo": generalInformation,
			"graph":   getGraphInformation(spending, generalInformation.largestYear, generalInformation.smallestYear)
		};

		// Send information to client
		res.status(201);
		res.send(sendToClient);
		res.end();
	});
});

// create general information using getGraphInformation except on a scale for all the users
function getGlobalInfo(users)
{
	// Error checking could be done here, but is omitted for time saving
	var generalInformation = getInfo(users[0].spending);
	for(var i = 1; i < users.length; i++)
	{
		// Get User information
		var usr = getInfo(users[i].spending);

		// Calculate information for all users one user at a time
		if(usr.largestPurchase.spent > generalInformation.largestPurchase.spent)
		{
			generalInformation.largestPurchase.spent = usr.largestPurchase.spent;
			generalInformation.largestPurchase.items = usr.largestPurchase.items;
		}

		if(usr.smallestPurchase.spent < generalInformation.smallestPurchase.spent)
		{
			generalInformation.smallestPurchase.spent = usr.smallestPurchase.spent;
			generalInformation.smallestPurchase.items = usr.smallestPurchase.items;
		}

		// mean will be the mean of the mean for users
		generalInformation.mean += usr.mean;

		if(usr.largestYear > generalInformation.largestYear)
		{
			generalInformation.largestYear = usr.largestYear;
		}

		if(usr.smallestYear < generalInformation.smallestYear)
		{
			generalInformation.smallestYear = usr.smallestYear;
		}
	}

	generalInformation.mean /= users.length;

	return generalInformation;
}

// This function will create the graph information, except for a global scale
function getGlobalGraph(users, largestYear, smallestYear)
{
	var difference = largestYear - smallestYear;
	// create keys array
	var keys = [];
	for(var i = 0; i <= difference; i++)
	{
		keys.push(smallestYear+i);
	}

	// build dictionary to put key values into
	var totalKeys = buildYearDictionary(largestYear,smallestYear,difference);

	for(var i = 0; i < users.length; i++)
	{
		for(var j = 0; j < users[i].spending.length; j++)
		{
			totalKeys[parseInt(users[i].spending[j].date.split('-')[0])] += users[i].spending[j].total;
		}
	}

	// Largest total will be used for defining graph Y axis
	var largestTotal = largestValue(totalKeys, smallestYear, difference);

	var graphInformation = {
		"keys": keys,
		"spendOnYear": totalKeys,
		"largestTotal": largestTotal
	};

	return graphInformation;
}

// Open database and get all users
app.get('/getGlobalGraphAndInfo', function(req,res){
	console.log("Got a global graph request");
	User.find({}, function(err,users){
		var generalInformation = getGlobalInfo(users);

		var sendToClient = {
			"genInfo": generalInformation,
			"graph": getGlobalGraph(users, generalInformation.largestYear, generalInformation.smallestYear)
		};

		res.status(201);
		res.send(sendToClient);
		res.end();
	});
});

// this is the user sending information for the server to append
// to the users array of spent events
app.post('/submit',function(req,res){
	var query = {
		"user":req.body.usrname, 
		"pass":req.body.passwrd
	};

	User.find(query,function(err,doc){
		if(doc.length <= 0){
			// No valid user found
			res.status(404);
			res.send("invalid submit");
		}
		else
		{
			// console.log("doc " + doc[0]._id);
			// console.log("dic " + req.body.dictionary.total);
			User.findByIdAndUpdate(
				doc[0]._id,
				{$push: {"spending": req.body.dictionary}},
				{safe: true, upsert:true},
				function(err,model){
					console.log(err);
					res.status(404);
				}
			);
			// console.log(doc);
			res.status(201);
		}
		res.end();
	});
});

// this is the client sending data
app.post('/login',function(req,res){ // receive data and print it out
	User.find(req.body,function(err,doc){
		if(doc.length == 0){
			// No valid user found
			res.status(404);
			res.send("Error: invalid log in.");
		}
		else
		{
			// valid user found
			res.status(201);
			res.send(doc);
		}
		res.end();
	});
});

//this is the client creating a new account
app.post('/create',function(req,res){
	var user = req.body.user;
	var pass = req.body.pass;
	User.find({"user": user},function(err,doc){
		if(doc.length == 0)
		{
			// no user with same username was found, and is therefore valid for the taking
			// create new user with no spending history
			var newUser = new User({
				user: user,
				pass: pass,
				spending: []
			});

			// save user
			newUser.save(function(err,response){
				console.log(err);
				console.log(response);
				if(!err)
				{
					console.log('success!');
					res.status(201);
					res.send("success");
					res.end();
				} 
				else 
				{
					console.log('save fail');
					res.status(404);
					res.send("Error: try again please");
					res.end();
				}
			});			
		}
		else
		{
			// user with this username was found, return error
			console.log('username taken');
			console.log(doc);
			res.status(404);
			res.send("Error: username already taken");
			res.end();
		}
	});
});

// have server listen to port 27017
var port = 3000;
app.listen(3000, function(){
	console.log("listening on port 3000");
});

/*
// test largest year and add keys to array and dictionary if needed
if(usr.largestYear > generalInformation.largestYear)
{
	for(var j = 1; j < usr.largestYear; j++)
	{
		generalInformation.keys
	}
}

// test smallest year and add keys to array and dictionary if needed
if(usr.smallestYear < generalInformation.smallestYear)
{

}
*/