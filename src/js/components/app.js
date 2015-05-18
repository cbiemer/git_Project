/** @jsx React.DOM */
var React         = require('react');
var AppConstants  = require('../constants/constants');
var AppStore      = require('../stores/store');
var AppActions    = require('../actions/action');
var Login         = require('../components/login');
var Home          = require('../components/home');
var Spend         = require('../components/spend');
var Info          = require('../components/info');
var Stat          = require('../components/stat');
var Back          = require('../components/back');
var MyInfo        = require('../components/myInfo');
var Logout		  = require('../components/logout');

var current_state = AppStore.getState();

// APP is in charge of dealing with change of states from the store.
// Meaning that when the store is in login mode it will display the log in
// mode. Likewise, if in homepage mode then it will go to the home page 
// screen
var APP = React.createClass({
	componentWillMount:function(){
		AppStore.addChangeListener(this._onChange);
		AppActions.logInCookie();
	},
	
	_onChange:function(){
		this.forceUpdate();
	},

	render:function(){
		var state = AppStore.getState();
		if(state == AppConstants.LOGIN_STATE)
		{
			return(
				<div>
					<Login />
				</div>
			)
		}
		else if(state == AppConstants.SPEND_STATE)
		{
			return(
				<div>
					<Logout />
					<Back />
					<Spend />
				</div>
			)
		}
		else if(state == AppConstants.HOME_STATE)
		{
			return(
				<div>
					<Logout />
					<Home />
				</div>
			)
		}
		else if(state == AppConstants.INFO_STATE)
		{
			return(
				<div>
					<Logout />
					<Back />
					<Info />
				</div>
			)
		}
		else if(state == AppConstants.STAT_STATE)
		{
			return(
				<div>
					<Logout />
					<Back />
					<Stat />
				</div>
			)
		}
		else if(state == AppConstants.MYINFO_STATE)
		{
			return(
				<div>
					<Logout />
					<Back />
					<MyInfo />
				</div>
			)
		}
		else
		{
			// Error that should never actually be able to happen, but just in case
			return <h2 class="jumbotron">Sorry, please refersh your page</h2>
		}
	}
});

module.exports = APP;