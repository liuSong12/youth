let DefaultState = {
	isShow:true,
	storeNum:0,
	packageNum:0
}

function TabbarReducer(state=DefaultState,action){
	let newState = {...state}
	switch (action.type) {
		case "change-tabbar":
			newState.isShow = action.payload
			return newState;
		case "change-storenum":
			newState.storeNum = action.payload
			return newState;
		case "change-packageNum":
			newState.packageNum = action.payload
			return newState;
		default:
		    return state;
	}
}

export default TabbarReducer