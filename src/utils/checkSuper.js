function checkSuper(isWorker,isStore){
	if((isWorker && isWorker.wokerName == "刘松" && isWorker.workerPhone=="15087238064")|| (isStore && isStore.responseName == "刘松" && isStore.responsePhone == "15087238064")){
		return true
	}else {
		return false
	}
}


export default checkSuper