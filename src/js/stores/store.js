var AppDispatcher = require('../dispatchers/dispatcher_app');
var AppConstants	= require('../constants/constants');
var merge 			= require('merge');
var EventEmitter	= require('events').EventEmitter;
var $ 				= require('jquery');

var CHANGE_EVENT = "change";

// usrName and passwrd will be used to access the data base
// usrname is going to be guaranteed to be unique
// usrName will store the username for the user
var usrName = "";

// passwrd will store the password for the user
var passwrd = "";

// State will store the current state that the website shoudl be in.
// On emitting a change the most important to be notified will be the app.js
// which will change the entire screen to represent the new state.
var state	 = AppConstants.LOGIN_STATE;

var error = false;

// Error text will be used for any error to be placed. It will be reset 
// automatically on any success to ensure that errors are not being placed
// when they shouldn't be
var errorText = "";

// take in user:String and pass:String
// log into the server and either be returned true or be given a response string
// on true, set usrName and pass and change the state
// on false, leave usrName blank, set error text, and emit change
function login(user, pass)
{
	error = false;

	$.ajax({
		type: 'POST',
		url: 'login',
		data: {
			user: user,
			pass: pass
		},
		success: function(data){
			usrName = user;
			passwrd = pass;
			setState(AppConstants.HOME_STATE);
			AppStore.emitChange();
			setCookie();
		},
		error: function(xhr, textStatus, error){
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
			errorText = xhr.responseText;
			setError(true);
			AppStore.emitChange();
		}
	});
}

// createNew() will go to the server and ask if there are any other
// users with this username. If their are no other users with this 
// username it will create the account and go to the home page.
// If not it will receive the error text and display
function createNew(user,pass)
{
	error = false;

	$.ajax({
		type: 'POST',
		url: 'create',
		data: {
			user: user,
			pass: pass
		},
		success: function(data){
			usrName = user;
			passwrd = pass;
			setState(AppConstants.HOME_STATE);
			AppStore.emitChange();
			setCookie();
		},
		error: function(xhr, textStatus, error){
			console.log(xhr.statusText);
			console.log(textStatus);
			console.log(error);
			errorText = xhr.responseText;
			setError(true);
			AppStore.emitChange();
		}
	});
}

// this function will ask the server to get all the bought entries
// that are associated with the account

var tableData={};
var tableFound = false;

function getInfoForTable()
{
	if(tableFound == true)
	{
		return;
	}
	var url = "getTable/" + usrName + "/" + passwrd;
	$.get(url,function(data){
		tableData = data;
		tableFound = true;
		AppStore.emitChange();
	});
}

var infoAndGraph    = {};
var infoGraphLoaded = false;

function getInfoAndGraphServer()
{
	infoGraphLoaded = false;
	var url = "getGraphAndInfo/" + usrName + "/" + passwrd;
	$.get(url,function(data){
		infoAndGraph = data;
		infoGraphLoaded = true;
		AppStore.emitChange();
	});
}

function getGlobalInfoAndGraphServer()
{
	infoGraphLoaded = false;
	var url = "getGlobalGraphAndInfo";

	$.get(url, function(data){
		infoAndGraph = data;
		infoGraphLoaded = true;
		AppStore.emitChange();
	});
}

// setCookie will set the current login and password to the cookie
function setCookie()
{
	// set username and password
	document.cookie = "usr=" + usrName +";";
	document.cookie = "pass="+ passwrd +";";
}

function logInCookie()
{
	var cookies = document.cookie.split('; ');
	
	if(cookies.length != 2)
	{
		// if it isn't two that means the cookie has been tampered with
		return;
	}
	// set password and username
	var user = cookies[0].split('=')[1];
	var pass = cookies[1].split('=')[1];

	// try and log in
	login(user,pass)
}

function logout()
{
	// clear local data
	usrName = ""
	passwrd = ""
	tableFound = false;
	tableData  = {};

	// clear cookies
	document.cookie = 'usr=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
	document.cookie = 'pass=; expires=Thu, 01-Jan-70 00:00:01 GMT;';

	setState(AppConstants.LOGIN_STATE);
}

// This function will take the dictionary and post it to the server.
// The function will give a dictionary in the format of:
// {
// 	usrname:"___",
// 	pass:"____",
// 	dicitonary:dictionary 
// }
// where dictionary is what we have been passed and will be pushed on 
// to the users array which represent all that they have spent.
// The server will be in charge of appending it to the correct account.
// by taking advantage of the username and password we pass to it
function submit(dictionary)
{
	tableFound = false;
	tableData  = {};
	error = false;
	$.post('submit',{
		usrname: usrName,
		passwrd: passwrd,
		dictionary: dictionary
	}, function(data,status){
		console.log("POSTED");
	});
}

// set state will set the state variable
function setState(new_state)
{
	state = new_state;
}

function getState()
{
	return state;
}

function setError(_err)
{
	error = _err
}

function getError()
{
	return error;
}

function getErrorText()
{
	return errorText;
}

function dataFound()
{
	return tableFound;
}

function getData()
{
	return tableData;
}

function getInfoAndGraph()
{
	return infoAndGraph;
}

function infoAndGraphIsLoaded()
{
	return infoGraphLoaded;
}

var AppStore = merge(EventEmitter.prototype, {
	emitChange:function(){
		this.emit(CHANGE_EVENT);
	},
	
	addChangeListener:function(callback){
		this.on(CHANGE_EVENT, callback);
	},

	getUsrname: function(){
		return usrName;
	},

	getError:function(){
		return getError();
	},

	getErrorMessage:function(){
		return getErrorText();
	},

	getState: function(){
		return getState();
	},

	dataFound: function(){
		return dataFound();
	},

	getData: function(){
		return getData();
	},

	getInfoAndGraph: function(){
		return getInfoAndGraph();
	},

	infoAndGraphIsLoaded: function()
	{
		return infoAndGraphIsLoaded();
	},

	deleteInfoAndGraph: function(){
		infoAndGraph = {};
		infoGraphLoaded = false;
	},

	removeChangeListener:function(callback){
		this.removeListener(CHANGE_EVENT, callback);
	},

	dispatcherIndex:AppDispatcher.register(function(payload){
		var action = payload.action;
		switch(action.actionType)
		{
			case AppConstants.LOGIN:
				var dictionary = payload.action.dictionary;
				login(dictionary['user'],dictionary['pass']);
				break;
			case AppConstants.STATS:
				getGlobalInfoAndGraphServer();
				// State set to info since stat and info page would be the exact same, and server
				// will send exactly the same formated data.
				setState(AppConstants.INFO_STATE);
				break;
			case AppConstants.INFO:
				console.log('info and graph!!');
				getInfoAndGraphServer();
				setState(AppConstants.INFO_STATE);
				break;
			case AppConstants.SPEND:
				setState(AppConstants.SPEND_STATE);
				break;
			case AppConstants.SUBMIT_SPENT:
				setState(AppConstants.HOME_STATE);
				var dictionary = payload.action.dictionary;
				submit(dictionary);
				break;
			case AppConstants.CREATE:
				var dictionary = payload.action.dictionary;
				createNew(dictionary['user'],dictionary['pass']);
				break;
			case AppConstants.BACK:
				setState(AppConstants.HOME_STATE);
				break;
			case AppConstants.MYINFO:
				getInfoForTable();
				setState(AppConstants.MYINFO_STATE);
				break;
			case AppConstants.COOKIE:
				logInCookie();
				break;
			case AppConstants.LOGOUT:
				logout()
				break;
			default:
				console.log("No action type found " + action.actionType);
				setState(AppConstants.LOGIN_STATE);
				break;
		}
		AppStore.emitChange();
	})
})

module.exports = AppStore;

