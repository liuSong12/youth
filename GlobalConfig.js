let GlobalConfig = {
	pathName:isProduct()? "https://lsplus.cloud":"http://localhost:8080",
	imgUrl:isProduct()?"https://lsplus.cloud/images/orderImg/":"http://localhost:8080/images/orderImg/",
	PACKAGE_TEMPLATE_ID:"Hq48nOhdGqD7cNJMBuTRF-RX2vIiZFNmjQqXxEjmhUw",//送达模版
}
function isProduct(){
	// return true 
	return wx.getAccountInfoSync().miniProgram.envVersion !== "develop"
}

export default GlobalConfig