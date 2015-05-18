/** @jsx React.DOM */
var APP = require('./components/app');
var React = require('react');

// Main.js is what starts the rendering for the flux data flow system, and all renders will go 
// it as the program progresses

React.render(
	<APP />,
	document.getElementById('main')
);