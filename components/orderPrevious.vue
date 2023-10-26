<template>
	<view class="nodel">
		<view class="order">
			<view class="mod" @click="hidePrevious">+</view>
			<view class="title">订单预览</view>
			<view class="name item">
				<view class="left">
					昵称：
				</view>
				<view class="right">
					{{name}}
				</view>
			</view>
			
			<view class="address item">
				<view class="left">
					地址：
				</view>
				<view class="right">
					{{props.Info.address}}
				</view>
			</view>
			<view class="weight item">
				<view class="left">
					重量：
				</view>
				<view class="right">
					{{props.Info.weight}}斤
				</view>
			</view>
			<view class="num item">
				<view class="left">
					数量：
				</view>
				<view class="right">
					{{props.Info.number}}个
				</view>
			</view>
			<view class="money item">
				<view class="left">
					金额：
				</view>
				<view class="right">
					{{props.Info.money}}元
				</view>
			</view>
			<view class="address item" v-show="props.Info.isChecked">
				<view class="left">
					备注：
				</view>
				<view class="right">
					校外取件
				</view>
			</view>
			<view class="address item">
				<view class="left">
					备注：
				</view>
				<view class="right">
					{{props.Info.inputData}}
				</view>
			</view>
			<view class="item" v-show="props.Info.imgArr.length>0">
				<view class="left">
					详情：
				</view>
				<view class="right">
					<view class="order-img-box">
						<image @click="showBigImg(index)" v-for="(item,index) in props.Info.imgArr" :src="item.tempFilePath" :key="item.tempFilePath" mode="aspectFill" class="fi"></image>
					</view>
				</view>
			</view>
			<button type="primary" class="submit" @click="createOrder">生成订单</button>
		</view>
	</view>
</template>

<script setup>
	import {defineEmits,defineProps,computed} from 'vue';
	import GlobalConfig from '../GlobalConfig.js';
	import https from '../utils/https.js'
	import upload from "../utils/upload.js"
	import useGlobalStore from "../store/globalStore.js"
	import pay from "../utils/wx_pay.js"
	
	const store = useGlobalStore()
	
	const props = defineProps({
		Info:{
			type:Object,
			default:{}
		}
	})
	
	const name = computed(()=>{
		return store.data.nikeName||"微信用户"
	})
	
	const emits = defineEmits(["hideEvent"])
	const hidePrevious = ()=>emits("hideEvent")
	
	const createOrder =async ()=>{
		
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
		
		
		uni.showToast({
			title:"支付中...",
			icon:'loading'
		})
		const {imgArr,inputData,money,number,weight} = props.Info
		let time = Date.now().toString()
		if(imgArr.length>0){
			try{
				await upload(imgArr,{weight,number,inputData,money,time},GlobalConfig.pathName+"/api/createOrder")
			}catch(e){
				wx.showToast({
					title:"出错了",
					icon:"none"
				})
				return;
			}
		}else{
			let res = await https({url:"/api/createO",method:"POST",data:{weight,number,inputData,money,timeStamp:time}})
			if(res.data.code!==1) return
		}
		
		 try{
		 	await pay(money,time,0)
		 }catch(e){
			 wx.showToast({
				title:"取消",
				icon:"none"
			 })
			 return
		 }
		 hidePrevious()
		 uni.hideToast()
	}
	
	const showBigImg = (index)=>{
		let imgUrl = props.Info.imgArr.map(item=>{
			return item.tempFilePath
		})
		wx.previewImage({
		  current: imgUrl[index], // 当前显示图片的http链接
		  urls: imgUrl // 需要预览的图片http链接列表
		})
	}
	
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
	.mod{
		position: absolute;
		top:15px;
		right: 18px;
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
	.title{
		width: 100%;
		text-align: center;
		height:35px;
		line-height: 35px;
	}
	.nodel{
		position: fixed;
		left: 0;
		top:0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, .3);
		z-index: 20;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		.order{
			overflow-y: scroll;
			overflow-x: hidden;
			position: relative;
			max-height: 85vh;
			z-index: 21;
			background-color: white;
			top: 18px;
			box-sizing: border-box;
			width: 95%;
			box-sizing: border-box;
			border-radius: 5px;
			padding: 5px 5px 5px 20px;
		}
	}
	.item{
		display: flex;
		margin:20px 5px;
		.left{
			width: 80px;
		}
		.right{
			letter-spacing: 2px;
			font-size: 17px;
			width: 100%;
			word-break: break-all;
			border-bottom: 1px solid rgba(229, 107, 0, 0.5);
		}
	}
	.submit[type=primary] {
	    background-color: #e56b00;
	    color: #fff;
		margin: 15px 5px 15px 0;
	}
</style>