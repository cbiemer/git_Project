/**@jsx React.DOM */
var React      = require('react');
var AppActions = require('../actions/action');
var AppStore   = require('../stores/store');
var $          = require('jquery');

var usr  = '';
var pass = '';

var Login = React.createClass({
	handleLogin:function(){
		// if(usr =='' || pass ==''){
		// 	return;
		// }
		AppActions.login({"user": usr, "pass": pass});
	},

	handleCreatenewAccount:function(){
		if(usr =='' || pass ==''){
			return;
		}
		AppActions.create({"user": usr, "pass": pass});
	},

	updateUsr:function(event){
		usr = event.target.value;
	},

	updatePass:function(event){
		pass = event.target.value;
	},

	componentDidMount: function() {
		document.getElementById('focusMe').focus();
	},

	handleSubmit: function(e){
		e.preventDefault();
	},

	render:function(){
		if(AppStore.getError() == true)
		{
			// Error means a change was emitted and instead of it being a change of state
			// when the login suceedes, it is a a chagne of state for login failing
			var divStyle = {
				color:"red",
				fontSize:"medium"
			};
			return(
				<center>
					<br /><br /><br />
					<h4>
						<form onSubmit={this.handleSubmit}>
							<div>
							<input type="text" id="focusMe" required title="This field should not be left blank." placeholder = "User" onChange={this.updateUsr} autofocus />
							</div>
							<div>
								<input type="password" required title="This field should not be left blank." placeholder="Password" onChange={this.updatePass} />
							</div>
							<div style={divStyle}>
								{AppStore.getErrorMessage()}
							</div>
							<div>
								<button className="ladda-button" data-color="blue" data-style="slide-down" onClick={this.handleLogin}>Login</button>
								<button className="ladda-button" data-color="red" data-style="slide-down" onClick={this.handleCreatenewAccount}>Make Account</button>
							</div>
						</form>
					</h4>
				</center>
			)
		}

		// No error so give regular login Page
		return(
			<center>
				<br /><br /><br />
				<h4>
					<form onSubmit={this.handleSubmit}>
						<div>
							<input type="text" id="focusMe" required title="This field should not be left blank." placeholder = "User" onChange={this.updateUsr} autofocus />
						</div>
						<div>
							<input type="password" required title="This field should not be left blank." placeholder="Password" onChange={this.updatePass} />
						</div>
						<br />
						<div>
							<button className="ladda-button" data-color="blue" data-style="slide-down" onClick={this.handleLogin}>Login</button>
							<button className="ladda-button" data-color="red" data-style="slide-down" onClick={this.handleCreatenewAccount}>Make Account</button>
						</div>
					</form>
				</h4>
			</center>
		)
	}
});

module.exports = Login;