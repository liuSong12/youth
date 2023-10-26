<template>
	<view>
		<wly-tabnav  :fixed="true" lineStyle="#e56b00" :tabnav="tabnav" @ontype_='ontype'></wly-tabnav>
		<view class="show-item">
			<OrderList :list="state.list" :isCenter="true" :identity="identity" @retrnmoney="retrunFun" @eventFininsh="Fininsh" :selfId="id"></OrderList>
		</view>
		<view class="noting" v-if="state.list.length==0">
			暂无订单
		</view>
	</view> 
</template>

<script setup>
	import OrderList from '../../components/orderList.vue';
	import {reactive} from 'vue';
	import useGlobalStore from '/store/globalStore.js';
	import https from '../../utils/https.js'
	import {onShow} from "@dcloudio/uni-app";
	import upload from "../../utils/upload.js"
	import GlobalConfig from '../../GlobalConfig.js'
	
	const store = useGlobalStore(); 
	const {identity,id} = store.data
	let nowType = 0
	//0.人人都有（只能看自己的）  2.人人都有（包括客户的，不包括无人接单） 3.只有快递员有（所有状态下的单） 4.人人都有（只能看自己的单）
	onShow(()=>{
		getCenterOrders(nowType)
	})
	const state = reactive({
		list: []
	})
	
	const retrunFun = (item)=>{
		uni.showModal({
			title: "提示",
			content: "是否退款？",
			success: async function (res) {
				if (res.confirm) {
					let res = await https({url:"/api/returnMoney",data:{"orderId":item.id},method:"POST"})
					if(res.data.code!==1) return;
					getCenterOrders(nowType)
				}
			}
		})
		
	}
	const Fininsh = async (item)=>{
		wx.chooseMedia({
			count:9,
			mediaType:['image'],
			async success(res){
				const tempFilesArr = res.tempFiles
				uni.showToast({
					title:"上传中...",
					icon:'loading'
				})
				try{
					await upload(tempFilesArr,{"orderId":item.id},GlobalConfig.pathName+"/api/uploadImg")
				}catch(e){
					wx.showToast({
						title:"出错了",
						icon:"none"
					})
					return;
				}
				//这里要增加接单数量，并且发送订阅信息
				let addOrderRes = await https({url:"/api/addOrder",data:{"orderId":item.id}}).then(res=>res.data)
				if(addOrderRes.code!==1) return;
				await getCenterOrders(nowType)
				uni.hideToast()
			},
			fail(err) {
				wx.showModal({
					title:'提示',
					content:'必需上传送达照片'
				})
			},
			complete(){
				uni.hideToast()
			}
		})
	}
	
	const tabArr = [{
			type: '0', 
			name: '我的订单',
			list: []
		}, {
			type: '1', 
			name: '正在派送',
			list: []
		}, {
			type: '2', 
			name: '客户的单',
			list: []
		}, {
			type: '3', 
			name: '暂无人接单',
			list: []
		}]
		
	const tabnav = tabArr.filter(item=>{
		if(identity!==1){
			return item.type != '2'
		}else{
			return true
		}
	})
	const ontype = function(e){
		//根据不同的type发送数据
		nowType = e.type
		getCenterOrders(e.type)
	}
	
	async function getCenterOrders(type){
		let res = await https({url:`/api/myOrders?type=${type}`})
		if(res.data.code!==1) return;
		state.list = res.data.data
	}
	
	
</script>

<style>
	.noting{
		text-align: center;
		color: gray;
		font-size: 15px;
		margin: 10px auto;
	}
	.show-item{
		margin-top: 50px;
	}
	
	page {
		background-color: #efefef;
	}

</style>
