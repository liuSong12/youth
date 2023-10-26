<template>
	<view class="form">
		<view class="title">
			注册成为快递员
		</view>
		<view class="name item">
			<view >姓名：</view>
			<input :disabled="!state.isShow" type="text" class="input" v-model.trim="state.workerName">
		</view>
		<view class="phone item">
			<view >手机号：</view>
			<input type="number" :disabled="!state.isShow" maxlength=11 class="input" v-model.trim="state.workerPhone">
		</view>
		<view class="student-img" style="justify-content: flex-start; ">
			<view style="align-items: flex-start;">学生证照片：</view>
			<image v-show="state.imgurl.length" :src="state.imgurl[0]?.tempFilePath" mode="aspectFill" class="fi" @click="showBigImg"></image>
			<text v-if="state.imgurl.length==0" class="select-img" @click="chooseImg">
				+
			</text>
			<text v-if="state.imgurl.length!=0 && state.isShow" style="font-size: 12px;" class="select-img" @click="chooseImg">
				重选
			</text>
		</view>
		<view class="title">
			<button type="primary" v-if="state.isShow" class="submit" @click="submit">提交审核</button>
			<button type="primary" class="submit" disabled v-if="state.identity == 3">审核中...</button>
			<button type="primary" class="submit" disabled v-if="state.identity == 1">正式快递员</button>
			<button type="primary" class="submit" disabled v-if="state.identity == 2">小黑屋</button>
		</view>
	</view>
</template>


<script setup>
	import {reactive} from 'vue';
	import GlobalConfig from '../../GlobalConfig.js';
	import https from '../../utils/https.js';
	import testPhone from '../../utils/testPhone.js'
	import upload from '../../utils/upload.js';
	import {onShow} from '@dcloudio/uni-app'
	import useGlobalStore from "../../store/globalStore.js"
	const store = useGlobalStore();
	
	const state = reactive({
		isShow:true,
		identity:0,
		imgurl:[],
		workerPhone:"",
		workerName:""
	})
	const showBigImg = ()=>{
		let imgUrlArr = state.imgurl.map(item => item.tempFilePath)
		wx.previewImage({
		  current: imgUrlArr[0], // 当前显示图片的http链接
		  urls: imgUrlArr // 需要预览的图片http链接列表
		})
	}
	async function setInfo(){
		let res = await https({url:"/api/checkInfo"})
		if(res.data.code!==1) return;
		const {identityflag,info} = res.data.data
		if(info.length==0) return
		let {identity} = identityflag[0]
		const {studentImg,wokerName,workerPhone} = info[0]
		state.isShow = false
		state.workerName = wokerName
		state.workerPhone = workerPhone
		state.imgurl = [{tempFilePath:GlobalConfig.pathName+"/images/workerImg/"+studentImg}]
		state.identity = identity
	}
	onShow(async()=>{
		await setInfo()
	})
	const chooseImg = function() {
		wx.chooseMedia({
			count: 1,
			mediaType: ['image'],
			success(res) {
				state.imgurl = res.tempFiles
			},
			fail(err) {
				console.log(err)
			}
		})
	}
	const submit =async ()=>{
		if(!(state.workerName&&testPhone(state.workerPhone)&&state.imgurl.length!=0)){
			uni.showModal({
				title: "提示",
				content: "请输入姓名，11位手机号，学生证照片"
			})
			return
		}
		uni.showToast({
			title:"",
			icon:'loading'
		})
		try{
			await upload(state.imgurl,{wokerName:state.workerName,workerPhone:state.workerPhone},GlobalConfig.pathName+"/api/toBeWorker")
		}catch(e){
			console.log(e)
			wx.showToast({
				title:"出错了",
				icon:"none"
			})
			return;
		}
		store.data.identity = 3;
		await setInfo()
		uni.hideToast()
	}
</script>


<style lang="scss" scoped>
	.fi {
		width: 75px;
		height: 75px;
	}
	.student-img{
		margin-top: 18px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		view {
			width: 120px;
		}
		.select-img {
			width: 75px;
			height: 75px;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 45px;
			color: #efefef;
			border: 1px dashed #efefef;
		}
	}
	
	.form {
		margin: 50px auto;
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
	
	.item {
		line-height: 50px;
		height: 50px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		view {
			width: 120px;
		}
		input {
			border-bottom-style: solid;
			border-bottom-color: #e56b00;
			border-bottom-width: 1px;
			flex: 1;
			color: black;
		}
	}
	.submit[type=primary] {
		margin-top: 80px;
		background-color: #e56b00;
		color: #fff;
	}
</style>