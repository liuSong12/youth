<template>
	<view>

		<swiper :indicator-dots="true" :autoplay="true" :interval="5000" circular :duration="1000">
			<swiper-item v-for="(item,index) in store.data.swiper" :key="item.id">
				<view class="swiper-item">
					<image class="swiper-item-img" :src="GlobalConfig.pathName+'/images/swiper/'+item.content" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
		
		<view v-if="store.data.identity==1">
			<view class="noum" v-if="state.list.length===0">
				<image src="/static/tabbar/form.png" mode="widthFix" style="width: 50%;"></image>
				<view class="texttip">来晚了,下拉刷新试试~</view>
			</view>
			<view v-else>
				<OrderList :list="state.list" :isCenter="false" :identity="store.data.identity" @getOrders="getOrders"></OrderList>
			</view>
		</view>

		<view v-if="store.data.identity===4">
			<view class="box">
				<view class="text">
					登录后尽享更多权益
				</view>
				<button type="primary" open-type="getPhoneNumber" class="submit" @getphonenumber="login">登录</button>
			</view>
		</view>

		<view v-if="store.data.identity===0||store.data.identity===2||store.data.identity===3">
			<view class="box">
				<view class="text">
					加入我们可见
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {onPullDownRefresh,onShow} from "@dcloudio/uni-app";
	import {reactive} from 'vue';
	import useGlobalStore from '/store/globalStore.js';
	import OrderList from '../../components/orderList.vue'
	import https from '../../utils/https.js'
	import setUserInfo from "../../utils/setGlobalInfo.js"
	import GlobalConfig from "../../GlobalConfig.js"
	
	const store = useGlobalStore();
	 
	const state = reactive({
		list: []
	})
	
	const login = async (e)=>{
		if(!e.detail.code){
			wx.showToast({
				title:"登录失败",
				icon:'none'
			})
			return;
		}
		uni.showToast({
			title:"登录中...",
			icon:'loading'
		})

		let res = await https({
			method:"POST",
			url:"/api/login",
			data:{
				code:e.detail.code
			}
		})
		if(res.data.code!==1) return;
		setUserInfo(res.data.data[0],store)
		wx.login({
			success(e){
				https({url:"/api/getOpenid",data:{code:e.code},method:"POST"}).then(res=>{
					uni.hideToast()
				})
			},
			fail(e){
				console.log("err:",e)
			}
		})
	}
	onPullDownRefresh(async ()=>{
		await getOrders()
		uni.stopPullDownRefresh()
	})

	async function getOrders(){
		let token = wx.getStorageSync("token")
		if(!token) return;
		let res = await https({url:"/api/orders"})
		if(res.data.code!==1) return;
		setUserInfo(res.data.data.userInfo,store)
		if(res.data.data.result){
			state.list = res.data.data.result
		}
	}
	
	onShow(async () => {
		//管他什么人，带token发请求去校验,回来再覆盖globalstore
		await getOrders()
	})
</script>



<style lang="scss">
	.order-img-box {
		display: flex;
		flex-wrap: wrap;
		flex: 1;
		width: 100%;

		.fi {
			width: 50px;
			height: 50px;
			margin: 5px 7px;
		}
	}

	swiper {
		width: 100%;
		height: 146px;
		background-color: white;
		swiper-item {
			width: 100%;
			height: 100px;
			.swiper-item{
				width: 100%;
				height: 100%;
				.swiper-item-img{
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
		}
	}

	.submit[type=primary] {
		background-color: #e56b00;
		color: #fff;
		margin-top: 20px;
		width: 50%;
	}

	.box {
		margin-top: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.text {
			font-size: 12px;
			color: #a2a2a2;
		}
	}

	.noum {
		margin-top: 100px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.texttip {
			margin-top: 20px;
			font-size: 16px;
			color: gray;
		}
	}
	page {
		background-color: #efefef;
	}

</style>