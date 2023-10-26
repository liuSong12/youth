import {defineStore} from 'pinia'
import {reactive} from 'vue'

const useGlobalStore = defineStore("globalModel",()=>{
	const data = reactive({
		id:0,
		avatar:null,
		identity:4,//0普通人，1快递员，2小黑屋，3审核中,4未登录
		nikeName:null,
		defaultAddress:null,
		orderNumber:0,//下单数量
		receiveNumber:0,//接单数量
		lastOperateTime:null,
		//下面是全局，上面是用户信息
		notice:[],//通知栏通知
		swiper:[],//接单页面轮播
		priceTable:[[1.4,1.8,2.7,3.7,4.7,5.5],[1.7,2,3,4,5,6],[2,2.3,3.5,4.5,5.5,6.5],[2.7,3,3.5,4.2,5.5,7],[3.2,3.7,4.2,5.5,6.5,7.5],[3.7,4.5,5.3,6.2,7.1,7.9],[4.5,5.4,6.1,7,7.8,8.5]]
		//重量0~7，每一个又依次表示0~6数量的价格
	})
	return {
		data
	}
})

export default useGlobalStore