<template>
	<view>
		<Concat v-if="state.isShow" @event="state.isShow=false" :concat="state.concat"></Concat>
		<view class="top-nav">
			<view class="nav-left">
				<button class="nav-ava avatar-wrapper" open-type="chooseAvatar" @chooseavatar="ChooseAvatar">
					<img class="ava-img-center" :src="computedAvatar">
				</button>
				<view class="nicknamearea">
					<view class="say">
						Hi,<input type="nickname" @blur="updataName" :readonly="true" v-model="computedName" class="weui-input myinput" />
					</view>
					<view class="color">
						热派，让生活更加精彩
					</view>
				</view> 
			</view>
			<view class="nav-right" @click="state.isShow = true">
				<view class="phone-icon">
					<img style="width: 20px;height: 20px;" src="/static/icons/phone.png">
				</view>
				<view class="cousom-service">
					<view class="kf">
						专属客服
					</view>
					<view class="wdkf">
						我的客服
					</view>
				</view>
			</view>
		</view>

		<view class="tips">
			<view class="tips-item">
				<view class="tips-item-top">
					{{store.data.orderNumber}}
				</view>
				<view class="tips-item-bottom">
					订单数量
				</view>
			</view>
			<view class="tips-item">
				<view class="tips-item-top">
					{{store.data.receiveNumber}}
				</view>
				<view class="tips-item-bottom">
					接单数量
				</view>
			</view>
			<view class="tips-item">
				<view class="tips-item-top">
					{{timeFormate(store.data.lastOperateTime)}}
				</view>
				<view class="tips-item-bottom">
					上次操作时间
				</view>
			</view>
		</view>

		<view class="center-nav">
			<view class="center-tips">
				{{date}}
			</view>
			<view class="noOrder" v-if="state.orderList.length===0">
				<view class="">
					今日未下单
				</view>
				<view style="line-height: 0;">
					<img style="width: 30px; height: 30px;" src="/static/icons/list.png" alt="">
				</view>
			</view>
			<view class="order-list" v-else @click="pagenavigate('/subpackage/order/order',item.flag)">
				<view class="order" v-for="item in state.orderList" :key="item.orderTime">
					<view class="order-list-left">
						{{item.inputData}}
					</view>
					<view class="order-list-right">
						{{timeFormate(item.orderTime)}}
					</view>
				</view>
			</view>
		</view>

		<view class="controller-list">
			<uni-list>
				<uni-list-item title="我的包裹" @click="pagenavigate('/subpackage/order/order')" :thumb="GlobalConfig.pathName+'/images/icons/allorders.png'" thumb-size="min" link></uni-list-item>
				<uni-list-item title="我的零食" @click="pagenavigate('/subpackage/food/food')" :thumb="GlobalConfig.pathName+'/images/icons/food.png'" thumb-size="min" link></uni-list-item>
				<uni-list-item title="收货地址" @click="pagenavigate('/subpackage/address/address')" :thumb="GlobalConfig.pathName+'/images/icons/address.png'" thumb-size="min" link></uni-list-item>
				<uni-list-item title="加入我们" @click="pagenavigate('/subpackage/cooperate/cooperate')" :thumb="GlobalConfig.pathName+'/images/icons/comp.png'" thumb-size="min" link></uni-list-item>
				<uni-list-item title="入驻热派" @click="pagenavigate('/subpackage/business/business')" :thumb="GlobalConfig.pathName+'/images/icons/comcat.png'" thumb-size="min" link></uni-list-item>
				<uni-list-item v-if="state.topUp==1" title="结算充值" @click="pagenavigate('/subpackage/topUp/topUp')" :thumb="GlobalConfig.pathName+'/images/icons/floor.png'" thumb-size="min" link></uni-list-item>
				<uni-list-item title="遇到问题？  联系我们" @click="pagenavigate('/subpackage/contact/contact')" :thumb="GlobalConfig.pathName+'/images/icons/help.png'" thumb-size="min" link></uni-list-item>
			</uni-list>
		</view>

	</view>
</template>

<script setup>
	import {computed,reactive} from 'vue';
	import useGlobalStore from '/store/globalStore.js';
	import moment from 'moment';
	import {onShow} from "@dcloudio/uni-app";
	import https from '../../utils/https.js'
	import setGlobalInfo from '../../utils/setGlobalInfo.js'
	import Concat from "../../components/concat.vue"
	import GlobalConfig from '../../GlobalConfig.js'
	import upload from '../../utils/upload.js';
   
	const store = useGlobalStore();
	const timeFormate =  computed(()=>(time)=>{
		return moment(time).format("MM/DD HH:mm:ss")
	})
	const computedAvatar = computed(()=>{
		if(store.data.avatar){
			if(store.data.avatar.includes("http")){
				return store.data.avatar
			}else{
				return GlobalConfig.pathName+'/images/avatar/'+store.data.avatar
			}
		}else{
			return '/static/icons/avatar.png'
		}
	})
	const computedName = computed(()=>{
		return store.data.nikeName ? store.data.nikeName : '微信用户'
	})
	const updataName =  (e)=>{
		let {value} =  e.detail
		if(value == "") return;
		https({url:`/api/updatename?value=${value}`}).then(res=>{
			store.data.nikeName = value
		})
	}
	//用于匹配时间  
	const date = computed(() => {
		let dateHour = new Date().getHours();
		let timecase = [{
				date: [0, 1, 2, 3, 4],
				tips: "是有什么心事吗？"
			},
			{
				date: [5],
				tips: "还没睡觉的人一定是在享受时间吧"
			},
			{
				date: [6, 7, 8, 9],
				tips: "该吃早点了"
			},
			{
				date: [10, 11, 12],
				tips: "努力过好每一天"
			},
			{
				date: [13, 14, 15, 16, 17],
				tips: "骄阳似火，热情如我"
			},
			{
				date: [18, 19, 20, 21],
				tips: "客服在线"
			},
			{
				date: [22, 23],
				tips: "夜深了，喝杯咖啡吧"
			}
		]
		let res = timecase.find(item => {
			return item.date.includes(dateHour)
		})
		return res.tips
	})
	
	const state = reactive({
		orderList: [],
		isShow:false,
		topUp:0,
		concat:null
	})
	
	async function ChooseAvatar(e){
		const { avatarUrl } = e.detail
		try{
			await upload([{"tempFilePath":avatarUrl}],{},GlobalConfig.pathName+"/api/updateavatar")
			store.data.avatar = avatarUrl
		}catch(e){
			wx.showToast({
				title:"出错了",
				icon:"none"
			})
		}
	}
	
	const pagenavigate = (url,flag)=>{
		if(!wx.getStorageSync("token")&&url!='/subpackage/contact/contact'){
			wx.showToast({
				title:"请先登录",
				icon:"none"
			})
			return;
		}
		if(url=='/subpackage/contact/contact'){
			state.isShow = true
			return;
		}
		if(flag){
			wx.navigateTo({url:'/subpackage/food/food'})
		}else{
			wx.navigateTo({url})
		}
	}
	
	
	onShow(async () => {
		let token = wx.getStorageSync("token")
		if(!token) return;
		let res = await https({url:"/api/center"})
		if(res.data.code!==1) return;
		let ui = res.data.data.userInfo
		state.concat = res.data.data.concat
		state.orderList = res.data.data.todayOrders
		state.topUp = ui.topUp
		setGlobalInfo(ui,store)
	})
	
</script>

<style lang="scss">
	.controller-list{
		margin: 20px auto;
		background-color: white;
		width: 85%;
		padding: 0 15px;
		border-radius: 7px;
	}
	
	.chat-custom-right {
	    flex: 1;
	    /* #ifndef APP-NVUE */
	    display: flex;
	    /* #endif */
	    flex-direction: column;
	    justify-content: space-between;
	    align-items: flex-end;
	}
	
	.chat-custom-text {
	    font-size: 12px;
	    color: #999;
	}
	
	
	.center-nav {
		margin: 20px auto;
		background-color: white;
		width: 85%;
		padding: 7px 15px;
		border-radius: 7px;

		.noOrder {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 50px;
			line-height: 50px;
		}

		.order-list {
			.order {
				height: 50px;
				line-height: 50px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.order-list-left {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					flex:1;
				}

				.order-list-right {
					padding-left: 10px;
				}
			}
		}

		.center-tips {
			height: 50px;
			line-height: 50px;
			font-size: 16px;
			font-weight: 600;
			border-bottom: 1px solid #d5d5d5;
		}
	}

	.tips {
		display: flex;
		justify-content: space-around;
		align-items: center;

		.tips-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.tips-item-top {
				font-size: 18px;
				font-weight: 600;
			}

			.tips-item-bottom {
				color: #515151;
				font-size: 13px;
			}
		}
	}
	button{
		border: none;
	}
	.top-nav {
		height: 100px;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.nav-left {
			display: flex;
			flex:1;
			.nav-ava:active{				
				background-color: #eeeeee;
			}
			.nav-ava {
				background-color: #eeeeee;
				margin: 0;
				padding:0;
				width: 43px;
				height: 43px;
				border-radius: 50%;
				margin-right: 8px;
				margin-left: 10px;
				margin-top: 5px;
				//头像
				.ava-img-center {
					width: 45px !important;
					height: 45px !important;
				}
			}

			.nicknamearea {
				display: flex;
				flex-direction: column;

				.say {
					font-size: 20px;
					font-weight: 600;
					display: flex;
					align-items: baseline;
					.myinput{
						margin: 5px 0 0 4px;
						max-width: 170px;
						overflow: hidden;
						display: block;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}

		.nav-right {
			display: flex;
			background-color: rgba(229, 107, 0, .6);
			color: white;
			border-radius: 23px 0 0 23px;
			padding: 6px;

			.phone-icon {
				margin-right: 5px;
				display: flex;
				align-items: center;
			}

			.cousom-service {
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				.kf {
					font-size: 8px;
				}

				.wdkf {
					font-size: 10px;
					font-weight: 400;
				}
			}
		}
	}

	page {
		height: 100%;
		background-color: #eeeeee;
	}
</style>