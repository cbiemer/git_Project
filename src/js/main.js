/** @jsx React.DOM */
var APP   = require('./components/app');
var React = require('react');
var $     = require('jquery');

// Main.js is what starts the rendering for the flux data flow system, and all renders will go 
// it as the program progresses

React.render(
	<APP />,
	document.getElementById('main')
);

// prevent form default behaviour of changing url to match
// the items in the inpout
//prevent default
// $('form').submit(function() {
// 	return false;
// });

$('form').submit(function(e) {
	console.log('here');
	e.preventDefault();
});