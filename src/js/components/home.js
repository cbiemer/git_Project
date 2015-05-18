/**@jsx React.DOM */
var React			= require('react');
var AppActions      = require('../actions/action');

var Home = React.createClass({
	goToSpent:function(){
		AppActions.goToSpent();
	},

	goToInfo:function(){
		AppActions.goToInfo();
	},

	goToStats:function(){
		AppActions.goToStats();
	},

	goToMyInfo:function(){
		AppActions.goToMyInfo();
	},

	render:function(){
		return(
			<div>
				<center>
					<button className="ladda-button" data-color="red" data-style="slide-down" data-size="xl" onClick={this.goToSpent}>Spend</button>
					<button className="ladda-button" data-color="blue" data-style="slide-down" data-size="xl" onClick={this.goToInfo}>Info</button>
					<button className="ladda-button" data-color="green" data-style="slide-down" data-size="xl" onClick={this.goToStats}>Stats</button>
					<button className="ladda-button" data-color="purple" data-style="slide-down" data-size="xl" onClick={this.goToMyInfo}>Table</button>
				</center>
			</div>

		)
	}
});

module.exports = Home;

// onClick={this.goToStats}