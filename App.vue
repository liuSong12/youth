<script>
	import useGlobalStore from '/store/globalStore.js'; 
	import https  from "./utils/https.js"
	import setGlobalInfo from "./utils/setGlobalInfo.js"
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: async function() {
			console.log('App Show')
			//有可能没有token，所以这个notice和swiper重新发请求
			const store = useGlobalStore();
			let someNotice;
			try{
				someNotice = await https({url:"/api/getNotice"})
			}catch(e){
				wx.showToast({
					title:"出错了",
					icon:"none"
				})
				return;
			}
			if(someNotice.data.code!==1) return;
			const {notices,priceArr,swipers} = someNotice.data.data
			store.data.priceTable = priceArr
			store.data.notice = notices
			store.data.swiper = swipers
			//这里要请求身份信息，校验类型等
			let token = wx.getStorageSync("token")
			if(!token) return;
			let res = await https({url:"/api/init"})
			if(res.data.code!==1) return;
			setGlobalInfo(res.data.data,store)
		},  
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>  

<style>
	/*每个页面公共css */
</style>
