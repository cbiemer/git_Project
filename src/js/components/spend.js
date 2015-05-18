/**@jsx React.DOM */
var React      = require('react');
var AppActions = require('../actions/action');
var $          = require('jquery');


var months = {
	"Jan":'01',
	"Feb":'02',
	"Mar":'03',
	"Apr":'04',
	"May":'05',
	"Jun":'06',
	"Jul":'07',
	"Aug":'08',
	"Sep":'09',
	"Oct":'10',
	"Nov":'11',
	"Dec":'12'
};

var Spend = React.createClass({
	createDateString:function(){
		var today = (new Date()).toString().split(' ');
		var day   = today[2]
		var month = today[1];
		var year  = today[3];

		today =year+'-'+months[month]+'-'+day;

		return today
	},

	getInitialState:function(){
		var strDate = this.createDateString();
		return{
			date: strDate,
			total: 0,
			bought: ''
		}
	},

	handleInputChange:function(key,event){
		var partialState={};
		if(key == 'bought')
		{
			partialState[key] = event.target.value;
		}
		else if(key == 'date')
		{
			partialState[key] = event.target.value.toString();
		}
		else
		{
			partialState[key] = parseFloat(event.target.value);
		}
		this.setState(partialState);
	},

	submit:function()
	{
		// error checking
		if(this.state.total == null || this.state.total=="" || isNaN(this.state.total) == true ){
			return;
		}
		if(this.state.date=="" || this.state.total == null ){
			return;
		}
		if(this.state.bought == ""){
			return;
		}
		// submitting
		this.state.bought = this.state.bought.split(',');
		AppActions.submit(this.state);
	},

	handleSubmit:function(e){
		e.preventDefault();
		this.submit();
	},

	render:function(){
		return(
			<div className = "container">
				<center>
					<form onSubmit={this.handleSubmit}>
						<input type="number" min="0" placeholder="total spent" required title="Total must be greater than 0" onChange={this.handleInputChange.bind(null,'total')}/>
						<br />
						<br />
						<input type="date" value={this.state.date} placeholder="Date Bought" required title="Please enter a date or use the calendar" onChange={this.handleInputChange.bind(null,'date')}/>
						<br />
						<br />
						<input type="text" placeholder="Items bought" required title="Sepearate items by commas" size="40" onChange={this.handleInputChange.bind(null,'bought')}/>
						<br />
						<small> seperate bought by commas </small>
						<br />
						<br />
						<button className="ladda-button" data-color="red" data-style="slide-down" >Submit</button>
					</form>
				</center>
			</div>
		)
	}
});

module.exports = Spend;
//onClick={this.submit}