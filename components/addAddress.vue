<template>
	<view class="model">
		<view class="form">
			<view class="mod" @click="closeModel">+</view>
			<view class="title">
				添加收货地址
			</view>
			<view class="name item">
				<view class="">收货人：</view>
				<input type="text" class="input" v-model.trim="state.nickname">
			</view>
			<view class="phone item">
				<view class="">手机号：</view>
				<input type="number" maxlength=11 class="input" v-model.trim="state.phone">
			</view>
			<view class="address item">
				<view class="">地址：</view>
				<picker @change="PickerChange" :value="0" :range="array" class="piker">{{state.address||"请选择"}}</picker>
			</view>
			<view class="phone item" v-if="state.address=='其他位置'">
				<view style="width: 100px;">其他位置：</view>
				<input class="input" v-model="state.otherAddress">
			</view>
			<view class="title">
				<button type="primary" class="submit" @click="finish">新增</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {reactive,toRefs,defineEmits} from 'vue';
	import useModelStore from '../store/addressStore.js';
	import testPhone from '../utils/testPhone.js';
	import https from '../utils/https.js'
	const emits = defineEmits(["addevent"])
	
	const store = useModelStore()
	const array = ["立信1", "立信2", "立信3", "立信4", "立信5", "立信6", "立信7", "立德1", "立德2", "立德3", "立德4", "立德5", "立志1", "立志2", "立志3",
		"立志4", "立志5", "立志6", "立志7", "其他位置"
	]

	const state = reactive({
		nickname: "",
		phone: "",
		address: "",
		otherAddress: ""
	})

	const finish = async () => {
		let flag = false
		//这里判断两种位置情况
		if((state.address!=="其他位置")&&(state.nickname && testPhone(state.phone) && state.address)){
			flag = true
		}else if((state.address=="其他位置")&&(state.nickname && testPhone(state.phone) && state.otherAddress)){
			flag = true
		}
		
		if(!flag){
			uni.showModal({
				title: "提示",
				content: "请输入昵称，11位电话，收货地址"
			})
			return;
		}
		let resAddress = {
			...state,
			address:state.otherAddress||state.address
		}
		let addRes = await https({url:"/api/addAddress",data:resAddress,method:"POST"})
		if(addRes.data.code!==1) return;
		emits("addevent")
		wx.setStorageSync("address",JSON.stringify(resAddress))
		closeModel()
	}

	const closeModel = () => {
		store.data.showModel = false
	}

	const PickerChange = (e) => {
		state.address = array[e.detail.value]
	}
</script>

<style lang="scss">
	.piker {
		width: 100%;
		height: 50px;
	}

	.submit[type=primary] {
		background-color: #e56b00;
		color: #fff;
		margin-top: 20px;
	}

	.item {
		line-height: 50px;
		height: 50px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		view {
			width: 70px;
		}

		input {
			border-bottom-style: solid;
			border-bottom-color: #e56b00;
			border-bottom-width: 1px;
			flex: 1;
			color: black;
		}
	}

	.model {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .3);
		display: flex;
		justify-content: center;
		align-items: start;
		overflow: hidden;
		z-index: 20;

		.mod {
			position: absolute;
			top: -15px;
			right: -15px;
			width: 30px;
			height: 30px;
			border-radius: 50%;
			text-align: center;
			line-height: 30px;
			font-size: 26px;
			color: white;
			transform: rotate(45deg);
			background-color: gray;
		}

		.form {
			margin-top: 50px;
			z-index: 2;
			position: relative;
			padding: 0 20px;
			box-sizing: border-box;
			width: 90%;
			background-color: white;
			border-radius: 5px;
			padding-bottom: 10px;

			.title {
				line-height: 50px;
				text-align: center !important;
				height: 50px;
				width: 100%;
			}
		}
	}
</style>