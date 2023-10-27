import {set,get} from "../../utils/setLocal.js"

let DefaultState = {
	storeInfo:get("storeInfo")||null,
	workerInfo:get("workerInfo")||null
}

function GlobalReducer(state=DefaultState,action){
	let newState = {...state}
	switch (action.type) {
		case "initStore":
			newState.storeInfo = action.payload
			set("storeInfo",action.payload)
			return newState;
		case "initWorker":
			newState.workerInfo = action.payload
			set("workerInfo",action.payload)
			return newState;
		default:
		    return state;
	}
}

export default GlobalReducer