/**@jsx React.DOM */
var React	   = require('react');
var AppActions = require('../actions/action');

// this class is in charge of allowing the user to go back once they reach one of the tail 
// end pages. For example: spent or info.
var Back = React.createClass({
	handleClick:function(){
		AppActions.goBack();
	},

	handleHover:function(){
		console.log('handling that young hover');
	},

	render:function(){
		var imgStyle = {
			position:"fixed",
			top:"25px",
			left:"30px"
		};
		return(
			<img id="backButton"src = "/Images/backButton.png" height="50" width="50" style={imgStyle} onMouseEnter={this.handleHover} onClick={this.handleClick}/>
		)
	}
});

module.exports = Back;