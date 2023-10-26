<template>
	<view class="container">
		<uni-swipe-action ref="swipeAction">
			<uni-swipe-action-item v-for="(item, index) in state.swipeList" :right-options="options" :key="item.id" @click="swipeClick($event,item)">
				<view class="content-box">
					<view class="top">
						<view class="address-name">昵称：{{ item.addressName }}</view>
						<view class="address-phone">电话：{{ item.phone }}</view>
					</view>
					<view class="content-text">{{ item.addressInfo }}</view>
					<view v-if="item.isdefault===1" class="tag">默认</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<view class="top-text">左滑删除</view>
		<button type="primary" class="submit" @click="addAddress">添加收货地址</button>
		<selectAddress v-show="store.data.showModel" @addevent="add"></selectAddress>
	</view>
</template>

<script setup>
	import selectAddress from '../../components/addAddress.vue'
	import useModelStore from '../../store/addressStore.js'
	import {onShow} from "@dcloudio/uni-app";
	import {reactive} from 'vue'
	import https from '../../utils/https.js'
	const store = useModelStore()
	const state = reactive({
		swipeList: []
	})
	const options = [{text: '设为默认'},{text: '删除',style: {backgroundColor: 'rgb(255,58,49)'}}]
	async function getAddress(){
		let res = await https({url:"/api/address"})
		state.swipeList = res.data.data
	}
	onShow(async()=>{
		await getAddress()
		state.swipeList.forEach(item=>{
			if(item.isdefault===1){
				wx.setStorageSync("address",JSON.stringify({
					nickname:item.addressName,phone:item.phone,address:item.addressInfo
				}))
			}
		})
	})
	const add = async ()=>{
		await getAddress()
	}
	const addAddress = function() {
		store.data.showModel = true
	}
	const swipeClick =async function(e,item) {
		let {content} = e;
		if (content.text === '删除') {
			uni.showModal({
				title: '提示',
				content: '是否删除',
				success: async (res) => {
					if (res.confirm) {
						let removeAddRes = await https({url:`/api/removeAddress/${item.id}`,method:"DELETE"})
						if(removeAddRes.data.code!==1) return;
						if(item.isdefault) wx.removeStorageSync("address");
						state.swipeList = state.swipeList.filter(sitem=>{
							return sitem.id!==item.id
						})
					}
				}
			});
		} else {
			let updateRes = await https({url:`/api/updateAddress/${item.id}`,method:"PUT"})
			if(updateRes.data.code!==1) return;
			let {addressInfo,addressName,phone} = state.swipeList.find(sitem=>sitem.id===item.id)
			wx.setStorageSync("address",JSON.stringify({
				nickname:addressName,phone,address:addressInfo
			}))
			state.swipeList.forEach((sitem,i)=>{
				if(sitem.id===item.id){
					sitem.isdefault = 1
				}else{
					sitem.isdefault = 0
				}
			})
		}
	}
</script>

<style lang="scss">
	.piker{
		width: 100%;
		height: 50px;
	}
	.submit[type=primary] {
		background-color: #e56b00;
		color: #fff;
		margin: 20px 10px !important;
	}

	.top-text {
		color: #e2e2e2;
		padding: 10px 15px;
		border-bottom-color: #e56b00;
		text-align: right;
	}

	.content-box {
		padding: 14px 15px 5px 15px;
		background-color: #fff;
		border-bottom-color: #f5f5f5;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		height: 60px;
		.tag {
			position: absolute;
			right: 10px;
			top: 30px;
			background-color: green;
			border-radius: 5px;
			padding: 5px;
			color: white;
			font-size: 10px;
			width: 50px;
			text-align: center;
			letter-spacing: 5px;
		}

		.top {
			.address-name {
				margin-right: 20px;
			}

			display: flex;
			height: 20px;
			font-size: 16px;
		}
	}

	.content-text {
		line-height: 45px;
		font-size: 15px;
		height:30px;
	}
</style>