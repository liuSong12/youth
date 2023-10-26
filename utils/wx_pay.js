import https from '../utils/https.js'
import Decimal from "decimal.js"
//flag:0:下单代拿，1：下单零食
function pay(money,time,flag){
	return new Promise(async(resolve,reject)=>{
		if(Number(money) <= 0){
			reject()
			return;
		} 
		money = new Decimal(money).mul(100).toNumber()
		let pay = await https({url:"/api/pay",method:"POST",data:{money,time:time,flag}}).then(res=>res.data)
		if(pay.code!==1) {
			reject()
			return;
		};
		wx.requestPayment({
			 timeStamp:pay.data.timeStamp,
			 nonceStr:pay.data.nonceStr,
			 package:pay.data.package,
			 signType:'MD5',
			 paySign:pay.data.paySign,
		  success (res) {
			resolve()
		  },
		  fail (err) {
			  reject()
		  }
		})
	})
}

export default pay