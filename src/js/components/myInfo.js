/**@jsx React.DOM */
var React	   = require('react');
var AppActions = require('../actions/action');
var AppStore   = require('../stores/store');
var $		   = require('jquery');

var MyInfo = React.createClass({

	render:function(){
		if(AppStore.dataFound() == false)
		{
			return(
				<div>
					<h1>
						Loading...
					</h1>
				</div>
			)
		}
		// else display data
		var data = AppStore.getData();
		var total = 0;

		// sort data based on date
		data.sort(function(a, b){
		    var keyA = new Date(a.date),
			keyB = new Date(b.date);
			// Compare the 2 dates
			if(keyA > keyB)
			{
				return -1;
			}
			if(keyA < keyB)
			{
				return 1;
			}
		    return 0;
		});

		// create table rows
		var tableJSX = data.map(function(element){
			// create string of items that were bought from bought array in elements
			var boughtString = "";
			for(var i =0; i < element.bought.length; i++)
			{
				if(i == 0)
				{
					boughtString += element.bought[0];
				}
				else if(i != element.bought.length -1)
				{
					boughtString += ", " + element.bought[i];
				}
				else
				{
					boughtString += ", and " + element.bought[i];
				}
			}
			// add spent to total
			total += element.total;

			//create row to go in side of tableJSX which holds all the rows
			return(
				<tr>
					<td>{element.date}</td>
					<td>${element.total.toFixed(2)}</td>
					<td>{boughtString}</td>
				</tr>
			);
		});
		return(
			<div className = "container">
				<table className ="table table-striped">
					<thead>
						<th>Date (year-month-day)</th>
						<th>Spent</th>
						<th>Items</th>
					</thead>
					<tbody>
						{tableJSX}
					</tbody>
					<tfoot>
						<td colSpan="1" className="text-right">Total:</td>
						<td>${total.toFixed(2)}</td>
					</tfoot>
				</table>
			</div>
		)
		
	}
});

module.exports = MyInfo;