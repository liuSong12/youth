import {set,get,remove} from "../../utils/setLocal.js"

let DefaultState = {
	detailInfo:get("detailInfo")|| null
}

function DetailReducer(state=DefaultState,action){
	let newState = {...state}
	switch (action.type) {
		case "changeDetail":
			set("detailInfo",action.payload)
			newState.detailInfo = action.payload
			if(action.payload==null){
				remove("detailInfo")
			}
			return newState;
		default:
		    return state;
	}
}

export default DetailReducer