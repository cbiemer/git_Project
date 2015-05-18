var AppConstants  = require('../constants/constants.js');
var AppDispatcher = require('../dispatchers/dispatcher_app.js');

var AppActions = {
	login:function(dictionary){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.LOGIN,
			dictionary: dictionary
		})
	},

	create:function(dictionary){
		AppDispatcher.handleViewAction({
			actionType: AppConstants.CREATE,
			dictionary: dictionary
		});
	},

	submit:function(dictionary){
		AppDispatcher.handleViewAction({
			actionType: AppConstants.SUBMIT_SPENT,
			dictionary: dictionary
		});
	},

	goToStats:function(){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.STATS
		})
	},

	goToInfo:function(){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.INFO
		})
	},

	goToHome:function(){
		console.log('going home');
	},

	goToSpent:function(){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.SPEND
		})
	},

	goBack:function(){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.BACK
		})
	},

	goToMyInfo:function(){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.MYINFO
		});
	},

	logInCookie:function(){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.COOKIE
		});
	},

	logout:function(){
		AppDispatcher.handleViewAction({
			actionType:AppConstants.LOGOUT
		});
	}
}

module.exports = AppActions;