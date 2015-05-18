/**@jsx React.DOM */
var React	   = require('react');
var AppActions = require('../actions/action');

// this class is in charge of allowing the user to go back once they reach one of the tail 
// end pages. For example: spent or info.
var Logout = React.createClass({
	handleClick:function(){
		AppActions.logout();
	},

	handleHover:function(){
	
	},

	render:function(){
		var imgStyle = {
			position:"fixed",
			top:"30px",
			right:"30px"
		};
		return(
			<img id="logOut"src = "/Images/Logout.png" height="30" width="30" style={imgStyle} onMouseEnter={this.handleHover} onClick={this.handleClick}/>
		)
	}
});

module.exports = Logout;