<template>
	<view class="category">
		<view class="leftscrollview" :style="{height:state.height+'px'}">
			<scroll-view class="bg" scroll-y="true" :scroll-with-animation="true">
				<view class="nav-item" :class="{'ac':state.active == index}" v-for="(item,index) in chooseLft" :key="index" @click="leftTap(index)">
					{{item}}
				</view>
				
			</scroll-view>
		</view>
		
		<view class="goodsBox" :style="{height:state.height+'px'}">
			<view class="notice">
				<uni-notice-bar :speed="50" scrollable single class="titleInfo"  showIcon :text="computedText"></uni-notice-bar>
			</view>
			<view class="ps" v-if="computedps">无配送费</view>
			<scroll-view scroll-y="true">
				<view class="goods">
					<GoodsList :goodsList="chooseRight" :working="state.list[state.active]?.working" :selectgoods="state.orderList" @changenum="buceClick"></GoodsList>
				</view>
			</scroll-view>
		</view>
		
		<view class="bottom-bar">
			<view class="bottom-left" @click="state.showSelectGoods=!state.showSelectGoods">
				<view class="bull" v-show="numcomputed">{{numcomputed}}</view>
				<img class="icon" :class="state.clicked?'shake':''" src="/static/icons/waimai.png" alt="">
				<view class="le-ri">
					<view class="bottom-prince">
						￥{{pricecomputed}}
					</view>
					<view class="peisong">
						配送费 ￥{{computedPeiSong}}
					</view>
				</view>
			</view>
			<view class="bottom-right" @click="createOrder">
				去结算
			</view>
		</view>
		
		<view class="model" @click="state.showSelectGoods=false" v-show="state.showSelectGoods">
			<view class="selected-item" @click.stop :class="state.showSelectGoods?'showit':''">
				<view class="selec-clear">
					<view class="sele-goods">
						已选商品：<text style="color: red;">(打包费￥{{computedPeiSong}})</text>
					</view>
					<view class="clear-goods" @click="state.orderList=[]">
						<img style="width: 12px; height: 12px;margin-right: 7px;" src="/static/icons/delete.png">
						<text>清空购物车</text>
					</view>
				</view>
				<view class="selectAddr">收货地址：{{state.address}}</view>
				<GoodsList :goodsList="state.orderList" @changenum="buceClick"></GoodsList>
			</view>
		</view>
		
	</view>
</template>
<script setup>
	import {onShow,onShareAppMessage,onShareTimeline} from '@dcloudio/uni-app'
	import {reactive,computed} from 'vue'
	import GoodsList from '../../components/goodsList.vue'
	import Decimal from 'decimal.js';
	import https from "../../utils/https.js"
	import GlobalConfig from "../../GlobalConfig.js"
	import pay from "../../utils/wx_pay.js"
	onShareAppMessage(()=>{
		return {
		   title: '来热派，大放送', //分享的名称
		   path: 'pages/store/store',   //页面的路径
		}
	}) 
	//分享到朋友圈
	onShareTimeline(()=>{
		return {
		   title: '布吃莽莽镀紫给会沃',
		   type: 0,
		   path: 'pages/store/store'
		}
	})
	
	const state = reactive({
		active: 0,
		height: 0,
		address:"",
		clicked:false,
		showSelectGoods:false,
		orderList:[],//这个是选中的
		list:[]
	})
	
	function fz(){
		let total = 0
		let storeArr = [...new Set(state.orderList.map(item=>item.storeId))]
		state.list.forEach(item=>{
			if(storeArr.includes(item.id)){
				total = new Decimal(total).add(new Decimal(item.packagePrice)).toNumber()
			}
		})
		return total
	}
	
	const computedPeiSong = computed(()=>{
		return fz()
	})
	
	//结算
	const createOrder = async ()=>{
		if(!wx.getStorageSync("token")){
			wx.showToast({
				title:"请先登录",
				icon:"none"
			})
			return;
		}
		if(!wx.getStorageSync("address")){
			wx.showToast({
				title:"请选择收货地址",
				icon:"none"
			})
			return;
		}
		if(state.orderList.length===0) return;
		await new Promise((resolve,resject)=>{
			// 先获取openi，在获取模版权限，在支付
			wx.requestSubscribeMessage({
			  tmplIds: [GlobalConfig.PACKAGE_TEMPLATE_ID],
			  success (res) {
				  resolve()
			  },
			  fail(err){
				  resolve()
			  }
			})
		})
		
		let updateArr = []
		state.orderList.forEach(item=>{
			let index = updateArr.findIndex(i=>{
				return i.storeId == item.storeId
			})
			if(index==-1){
				//里面没有
				updateArr.push({
					storeId:item.storeId,
					commondityId:[{id:item.id,num:item.num}],
					address:state.address,
				})
			}else{
				let checkNumIndex = updateArr[index].commondityId.findIndex(i=>{
					return i.id == item.id
				})
				if(checkNumIndex==-1){
					updateArr[index].commondityId.push({id:item.id,num:item.num})
				}else{
					updateArr[index].commondityId[checkNumIndex].num++
				}
			}
		})
		let timestamp = Date.now()
		//上传数据
		let res = await https({url:'/api/CreateStoreOrder',method:"POST",data:{timestamp,order:updateArr,price:TotalPrice()}}).then(res=>res.data)
		if(res.code!==1) return
		
		//支付
		uni.showToast({
			title:"支付中...",
			icon:'loading'
		})
		
		 try{
		 	await pay(TotalPrice(),timestamp,1)
		 }catch(e){
			 console.log("错误：",e)
			 wx.showToast({
				title:"取消",
				icon:"none"
			 })
			 return
		 }
		 uni.hideToast()
		wx.showToast({
			title:"支付成功",
			icon:"none"
		})
	}
	
	const numcomputed = computed(()=>{
		//小红点
		let total = 0
		state.orderList.forEach(item=>{
			total += item.num
		})
		return total
	})
	
	function TotalPrice(){
		let total = 0
		state.orderList.forEach(item=>{
			total = new Decimal(total).add(new Decimal(item.num).mul(new Decimal(item.price)).toNumber()).toNumber()
		})
		total = new Decimal(total).add(new Decimal(fz())).toNumber()
		return total
	}
	
	const pricecomputed = computed(()=>{
		//总费用
		return TotalPrice()
	})
	
	const buceClick = (flag,item)=>{
		state.clicked = true
		setTimeout(()=>{
			state.clicked = false
		},500)
		if(flag){
			let resIndex = state.orderList.findIndex(e=>e.id==item.id)
			if(resIndex!=-1){
				state.orderList[resIndex].num++;
			}else{
				state.orderList.push({
					...item,
					num:1
				})
			}
		} else{
			let resIndex = state.orderList.findIndex(e=>e.id==item.id)
			if(resIndex==-1) return;
			if(state.orderList[resIndex].num>1){
				state.orderList[resIndex].num--
			}else if(state.orderList[resIndex].num==1){
				state.orderList.splice(resIndex,1)
			}
		}
	}
	
	const chooseLft = computed(()=>{
		return state.list.map(item=>item.title)
	})
	
	const chooseRight = computed(()=>{
		return state.list[state.active]?.children
	})
	
	
	onShow(async ()=>{
		// 获取导航'.nav-item'的高度，在点击导航触发changeNav时，使其向下滚动
		const sysInfo = uni.getSystemInfoSync();
		state.height = sysInfo.windowHeight;
		if(wx.getStorageSync("address")){
			state.address = JSON.parse(wx.getStorageSync("address"))?.address
		}else{
			state.address = "请选择收货地址"
		}
		let res = await https({url:'/api/getStore'})
		if(res.data.code!==1) return;
		state.list = res.data.data
	})
	const computedText = computed(()=>{
		return state.list[state.active]?.notice || "欢迎光临"
	})
	const computedps = computed(()=>{
		return state.list[state.active]?.packagePrice == '0'
	})
	
	const leftTap = function(index) {
		state.active = index
	}
</script>
<style scoped lang="scss">
	.selectAddr{
		font-size: 10px;
		color: #a1a1a1;
		padding-left: 5px;
	}
	.notice {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		letter-spacing: 3px;
		position: relative;
	}
	.ps{
		font-size: 10px;
		color: #e56b00;
	}
	.showit{
		animation: btot .5s;
	}
	@keyframes btot {
		0%{
			transform: translateY(400px);
		}
		100%{
			transform: translateY(0);
		}
	}
	.model{
		position: absolute;
		inset: 0;
		background-color: rgba(0, 0, 0, .3);
	}
	.selec-clear{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 10px;
		color: #a1a1a1;
		padding: 10px 5px 2px;
		border-bottom: 1px solid rgba(161, 161, 161, .1);
		.clear-goods{
			display: flex;
			align-items: center;
		}
	}
	.selected-item{
		box-sizing: border-box;
		padding: 0 20px;
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: white;
		padding-bottom: 60px;
		transition: .3s;
	}
	.shake{
		animation: shake .5s linear;
	}
	@keyframes shake {
		0%{
			transform: rotateZ(0deg);	
		}
		25%{
			transform: rotateZ(20deg);
		}
		50%{
			transform: rotateZ(-20deg);
		}
		75%{
			transform: rotateZ(20deg); 
		}
		100%{
			transform: rotateZ(0deg);
		}
	}
	.bull{
		position: absolute;
		left: 37px;
		top: 15px;
		width: 20px;
		height: 20px;
		background-color: red;
		color: white;
		border-radius: 50%;
		text-align: center;
		line-height: 20px;
		z-index: 20;
	}
	.bottom-bar{
		z-index: 2;
		position: fixed;
		overflow: hidden;
		bottom: 0;
		width: 90%;
		height: 50px;
		display: flex;
		align-items: center;
		left: 50%;
		border-radius: 25px;
		transform: translate(-50% ,0);
		margin-bottom: 5px;
		.bottom-left{
			height: 100%;
			flex: 1;
			display: flex;
			align-items: center;
			background-color: #303030;
			position: relative;
			.le-ri{
				display: flex;
				flex-direction: column;
				.bottom-prince{
					color: white;
					font-size: 20px;
				}
				.peisong{
					color: #9d9d9d;
					font-size: 14px;
				}
			}
			.icon{
				width: 35px;
				height: 35px;
				margin: 0 10px;
			}
		}
		.bottom-right{
			height: 100%;
			background-color: #e56b00;
			width: 28%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 15px;
			font-weight: 600;
		}
	}
	
	.category {
		display: flex;
		position: absolute;
		width: 100%;
		height: calc(100% - var(--status-bar-height));

		/* 隐藏滚动条样式 */
		::-webkit-scrollbar {
			width: 0;
			height: 0;
		}

		uni-scroll-view {
			height: 100%;
		}

		.bg {
			background: #F7F8F9;
		}

		.leftscrollview {
			width: 200rpx;
			overflow-y: scroll;
			background: #F7F8F9;
			padding-bottom: 80px;
			box-sizing: border-box;
			.nav-item {
				width: 200rpx;
				height: 104rpx;
				line-height: 104rpx;
				background: #e9e9ea;
				font-size: 28rpx;
				color: #505660;
				text-align: center;
				position: relative;
			}

			.ac {
				color: #e56b00;
				font-size: 30rpx;
				background: #fff;
			}

			.ac:before {
				content: '';
				display: block;
				position: absolute;
				left: 0;
				top: 0;
				width: 6rpx;
				height: 104rpx;
				background: #e56b00;
				border-radius: 2rpx;
			}
		}

		.goodsBox {
			width: 550rpx;
			overflow-y: scroll;
			.goods {
				display: flex;
				flex-direction: column;
				padding: 0 0 80px 0;
			}
		}
	}
</style>