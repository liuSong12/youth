function setUserInfo({avatar,nikeName,orderNumber,receiveNumber,defaultAddress,identity,id,lastOperateTime},store){
	store.data.defaultAddress = defaultAddress
	store.data.avatar = avatar
	store.data.lastOperateTime = lastOperateTime
	store.data.id = id
	store.data.identity = identity
	store.data.nikeName = nikeName
	store.data.orderNumber = orderNumber
	store.data.receiveNumber = receiveNumber
}

export default setUserInfo