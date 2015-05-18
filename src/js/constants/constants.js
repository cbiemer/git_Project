// Creates a list of constants which will be exported
// actions will have no attachment, while states will 
// have '_STATE' attached to it at the end.
module.exports = {
	// STATES will be used to change state of the store
	LOGIN_STATE: 'LOGIN_STATE',
	SPEND_STATE:'SPEND_STATE',
	HOME_STATE: 'HOME_STATE',
	INFO_STATE:'INFO_STATE',
	STAT_STATE:'STAT_STATE',
	MYINFO_STATE:'MYINFO_STATE',
	//these will be used for actions
	LOGIN: 'LOGIN',
	CREATE: 'CREATE',
	STATS: 'STATS',
	INFO: 'INFO',
	SPEND: 'SPEND',
	ADD_SPENT: 'ADD_SPENT',
	SUBMIT_SPENT: 'SUBMIT_SPENT',
	BACK: 'BACK',
	MYINFO: 'MYINFO',
	COOKIE:'COOKIE',
	LOGOUT: 'LOGOUT'
};