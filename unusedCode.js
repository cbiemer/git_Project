// Unused code, which may be used in the future so is currently
// being saved for that just in case moment

// set up day array for combobox
var i = 0;
var days = $.map(new Array(31),function(n){
	i++;
	return(
		<option value={i}>{i}</option>
	)
});

// set up month array for combobox
var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var months = $.map(monthArr,function(n){
	return(
		<option value={n}>{n}</option>
	)
});

// set up year array for combobox
i = -1;
var year = new Date().getFullYear();
var years = $.map(new Array(14),function(n){
	i++;
	var val = year - i;
	return(
		<option value={val}>{val}</option>
	)
});

<select onChange={this.handleInputChange.bind(null,'day')}>
	{days}
</select>
/ 
<select onChange={this.handleInputChange.bind(null,'month')}>
	{months}
</select>
/ 
<select onChange={this.handleInputChange.bind(null,'year')}>
	{years}
</select>