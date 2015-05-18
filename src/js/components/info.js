/**@jsx React.DOM */
var React			= require('react');
var AppActions = require('../actions/action');
var AppStore	 = require('../stores/store')

var Info = React.createClass({
	render:function(){
		if(AppStore.infoAndGraphIsLoaded() == false)
		{
			return(
				<div>
					<h1>
						Loading...
					</h1>
				</div>
			)
		}
		// build table information set:
		var data = AppStore.getInfoAndGraph();
		AppStore.deleteInfoAndGraph();
		
		// Calculate difference
		var smallestYear = data.genInfo.smallestYear;
		var largestYear  = data.genInfo.largestYear;
		var difference   = largestYear - smallestYear;
		
		// Create sample array to map over. 
		// Needs initialized values to be looped over
		var sampleArr = [];
		for(var i = 0; i <= difference; i++)
		{
			sampleArr.push(0);
		}

		// Generate x grid for graph
		var index = 0;
		var xGrid = sampleArr.map(function(){
			var x1 = ((600/(difference))*index) + 100;
			var x2 = x1
			var y1 = -5;
			var y2 = 440;

			index += 1;
			return(
				<line x1={x1} x2={x2} y1={y1} y2={y2}></line>
			);
		});

		// Generate y grid for graph
		index = 0;
		var yGrid = sampleArr.map(function(){
			var x1 = 100;
			var x2 = 700;
			var y1 = ((500/difference)*index);
			var y2 = y1;

			index += 1;
			
			return(
				<line x1={x1} x2={x2} y1={y1} y2={y2}></line>
			);
		});

		// Generate width text (years)
		index = 0;
		var widthText = sampleArr.map(function(){
			var x = ((600/(difference))*index) + 85; //100
			var y = 460;
			var year = smallestYear + index;
			index += 1;

			return(
				<text x={x} y={y}>{year}</text>
			);
		});

		// Generate height text (money spent)
		index = 0;
		var heightText = sampleArr.map(function(){
			var x = 35;
			var y = ((500/difference)*index)+10;

			var purchaseNum = ((data.graph.largestTotal + (data.graph.largestTotal * .2)) / (difference - 1))*(difference - index - 1)

			index += 1;

			return <text x={x} y={y}>{purchaseNum.toFixed(0)}</text>
		});

		// Generate circles and path
		index = 0;
		// Move to start point or origin of the graph
		var pathString = "M100,443 ";
		var circles = sampleArr.map(function(){
			var x = ((600/(difference))*index) + 100;
			var y = 450 - (450 * (data.graph.spendOnYear[data.graph.keys[index]] / (data.graph.largestTotal + (data.graph.largestTotal * .2))));

			// create line from dot to dot
			pathString += "L"+ x + "," + y + " ";

			index += 1;

			return <circle cx={x} cy={y} r={5}></circle>
		});
		
		// move to end of graph and fill
		pathString += "L700,443 Z";

		// Styles for Graph
		var gridStyle = {
			stroke:"white",
			strokedasharray: 1,
			strokeWidth:1
		};

		var bodyStyle = {
			fillOpacity : 0.3
		};

		return(
			<div>
				<table className ="table table-striped">
					<thead>
						<th>Category</th>
						<th>Spent</th>
						<th>Item(s)</th>
					</thead>
					<tbody>
						<tr>
							<td>Largest Purchase</td>
							<td>${data.genInfo.largestPurchase.spent.toFixed(2)}</td>
							<td>{data.genInfo.largestPurchase.items}</td>
						</tr>
						<tr>
							<td>Smallest Purchase</td>
							<td>${data.genInfo.smallestPurchase.spent.toFixed(2)}</td>
							<td>{data.genInfo.smallestPurchase.items}</td>
						</tr>
					</tbody> 
				</table>
				
				Average spent: ${data.genInfo.mean.toFixed(2)}
				<br />
				<br />

				<center>
					Spent Per a Year
					<br />
					<br />
					<svg width={800} height={500} version="1.1" xmlns="http://www.w3.org/2000/svg">
						<g id="xGrid" style={gridStyle}>
							{xGrid}
						</g>
						<g id="yGrid" style={gridStyle}>
							{yGrid}
						</g>

						<g id="points">
							{circles}
						</g>
						<g className="surfaces" style={bodyStyle}>
							<path className="first_set" d={pathString}></path>
						</g>
						<g id="xLabel">
							{widthText}
						</g>

						<g id="yLabel">
							{heightText}
						</g>
					</svg>
				</center>
			</div>
		);
	}
});

module.exports = Info;