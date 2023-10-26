<template>
	<view>
		<view class="form">
			<view class="title">
				欢迎商家入驻热派
			</view>
			<view class="store-select-form">
				<view class="item">
					<view>负责人姓名：</view>
					<input class="input" :disabled="!storeState.isShow" v-model.trim="storeState.responseName">
				</view>
				<view class="item">
					<view>负责人电话：</view>
					<input type="number" :disabled="!storeState.isShow" maxlength="11" class="input" v-model.trim="storeState.responsePhone">
				</view>
				<view class="student-img" style="justify-content: flex-start; ">
					<view style="width: 120px; align-items: flex-start;">商铺照片：</view>
					<view class="img-box">
						<image v-for="(item, index) in storeState.imgArr" @click="showImg(index)" :key="item.tempFilePath" :src="item.tempFilePath" mode="aspectFill" class="fi"></image>
						<view class="pto" @click="chooseImg(1)" v-if="storeState.isShow">
							+
						</view>
						<view v-if="storeState.imgArr.length!=0 && storeState.isShow" class="pto" style="font-size: 10px;" @click="storeState.imgArr=[]">
							清空
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="title" style="margin: 0 auto; width:95%;">
			<button type="primary" class="submit" @click="createStore" v-if="storeState.isShow">提交审核</button>
			<button type="primary" class="submit" disabled v-if="storeState.storeStatus==2">审核中...</button>
			<button type="primary" class="submit" disabled v-if="storeState.storeStatus==0||storeState.storeStatus==1">合作愉快</button>
		</view>
	</view>
</template>

<script setup>
	import {reactive} from 'vue';
	import {onShow} from '@dcloudio/uni-app'
	import upload from '../../utils/upload';
	import GlobalConfig from '../../GlobalConfig';
	import https from '../../utils/https';
	
	const storeState = reactive({
		storeStatus:4,
		isShow:true,
		responseName:"",
		responsePhone:"",
		imgArr:[]
	})
	
	
	const showImg = (index)=>{
		let imgUrl = storeState.imgArr.map(item=>item.tempFilePath)
		wx.previewImage({
		  current: imgUrl[index], // 当前显示图片的http链接
		  urls: imgUrl // 需要预览的图片http链接列表
		})
	}
	
	
	async function createStore(){
		if(!(storeState.responseName&&storeState.responsePhone&&storeState.imgArr.length)){
			uni.showModal({
				title: "提示",
				content: "请输入负责人，电话，商铺照片"
			})
			return
		};
		uni.showToast({
			title:"",
			icon:'loading'
		})
		try{
			await upload(storeState.imgArr,{responseName:storeState.responseName,responsePhone:storeState.responsePhone},GlobalConfig.pathName+"/api/createStore")
		}catch(e){
			wx.showToast({
				title:"出错了",
				icon:"none"
			})
			return;
		}
		await getStoreInfo()
		uni.hideToast()
	}
	
	async function getStoreInfo(){
		const res = await https({url:"/api/checkUserInfo"})
		if(res.data.code!==1) return
		const {storeStatus,info} = res.data.data
		if(info.length==0) return
		const {responseName,responsePhone,storeImgArr} = info[0]
		let imgs = storeImgArr.split(",").map(item=>({tempFilePath:GlobalConfig.pathName+"/images/storeImg/"+item}))
		storeState.responseName = responseName
		storeState.responsePhone = responsePhone
		storeState.imgArr = imgs
		storeState.isShow = false
		storeState.storeStatus = storeStatus[0].storeStatus
	}
	
	onShow(async()=>{
		//如果没有登录就进不来，但是已有可能登录之后没有写地址
		let localAddress = wx.getStorageSync("address")
		if(localAddress){
			let {phone} = JSON.parse(localAddress)
			storeState.responsePhone = phone
		}
		//拿注册信息
		await getStoreInfo()
	})
	
	const chooseImg = function(flag) {
		wx.chooseMedia({
			count: 9,
			mediaType: ['image'],
			success(res) {
				storeState.imgArr = [...storeState.imgArr, ...res.tempFiles]
			},
			fail(err) {
				console.log(err)
			}
		})
	}
</script>


<style lang="scss" scoped>
	
	
	
	.pto {
		box-sizing: border-box;
		width: 75px;
		height: 75px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 45px;
		color: #efefef;
		border: 1px dashed #efefef;
	}
	.img-box {
		display: flex;
		flex-wrap: wrap;
		flex:1;
	}
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
	}
	
	.form {
		margin: 50px auto 10px;
		z-index: 2;
		position: relative;
		padding: 0 10px;
		box-sizing: border-box;
		width: 100%;
		background-color: white;
		border-radius: 5px;
		padding-bottom: 10px;
		.store-select-form{
			margin-top: 20px;
		}
	
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
		background-color: #e56b00;
		color: #fff;
	}
</style>