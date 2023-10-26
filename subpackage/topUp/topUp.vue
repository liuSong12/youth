<template>
	<view>
		<input class="myinpu" type="number" v-model="state.money" placeholder="请输入充值金额">
		<button class="btn" @click="handleClick">提交</button>
	</view>
</template>

<script setup>
	import { reactive } from "vue";
	import https from "../../utils/https.js";
	import pay from "../../utils/wx_pay.js"
	
	const state = reactive({
		money:""
	})
	
	const handleClick = async ()=>{
		let reg = /^[0-9]+(\.[0-9]{1,2})?$/
		try{
			if(!reg.test(Number(state.money))){
				wx.showToast({
					title:"金额有误",
					icon:"none"
				})
				return
			}
			let time = Date.now().toString()
			await https({url:`/api/createup?money=${state.money}&time=${time}`})
			await pay(state.money,time,2)
		}catch(e){
			wx.showToast({
				title:"出错了："+e,
				icon:"none"
			})
		}
	}
	
</script>

<style lang="scss" scoped>
	.myinpu{
		width: 90%;
		margin: 20px auto;
		border-radius: 5px;
		height: 50px;
		padding-left: 10px;
		font-size: 30px;
		border-bottom: 1px solid #e56b00;
		background: #eeeeee;
	}
	.btn{
		width: 50%;
		margin: 10px auto;
		background-color: #e56b00;
	}

</style>
