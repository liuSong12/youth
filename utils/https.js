import GlobalConfig from "../GlobalConfig.js"
import setGlobalInfo from './setGlobalInfo.js'
export default function(obj){
	const token = wx.getStorageSync("token")
	const method = obj.method || "GET"
	let header =  {
		"Content-Type":"application/json",
		"Authorization":`Bearer ${token}`,
		...obj.header
	}
	const url = GlobalConfig.pathName + (obj.url||'')
	const data = obj.data || ''
	return new Promise((resolve,reject)=>{
		wx.request({
			...obj,
			method,
			header,
			url,
			data,
			success(res) {
				const {statusCode} = res
				if(statusCode===401){
					wx.removeStorageSync("token")
					wx.removeStorageSync("address")
				}
				const {Authorization} = res.header
				Authorization && wx.setStorageSync("token",Authorization)
				resolve(res)
			},
			fail(err) {
				reject(err)
			},
			complete() {
			}
		})
	})
	
}

