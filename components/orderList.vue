<template>
	<view style="padding-bottom: 40px;">
	<view class="list" v-for="item in props.list" :key="item.id">
		<text class="title b">
			{{item.inputData}}
		</text>
		<view class="body">
			<view class="avatar">
				<image :src="item.avatar?GlobalConfig.pathName+'/images/avatar/'+item.avatar:'/static/icons/avatar.png'"
					style="width: 50px;height: 50px; border-radius: 50%; overflow: hidden;"></image>
				<view class="creatTime">{{computedTime(item.orderTime)}}</view>
			</view>
			<view class="detail">
				<view class="detail-box">
					<view class="a">昵称：</view>
					<view class="b">{{item.nikeName||"微信用户"}}</view>
				</view>
				<view class="detail-box">
					<view class="a">地址：</view>
					<view class="b">{{item.addressInfo}}</view>
				</view>
				<view class="detail-box">
					<view class="a">重量：</view>
					<view class="b">{{item.weight}}斤</view>
				</view>
				<view class="detail-box">
					<view class="a">数量：</view>
					<view class="b">{{item.number}}个</view>
				</view>
				<view class="detail-box">
					<view class="a">金额：</view>
					<view class="b">{{item.money}}元</view>
				</view>
				<view class="detail-box" v-if="props.isCenter">
					<view class="a c">订单状态：</view>
					<view class="b" v-if="item.status==1" >派送中</view>
					<view class="b" v-if="item.status==2" >已送达</view>
					<view class="b" v-if="item.status==3" >已退款</view>
					<view class="b" v-if="item.status==0" >暂无人接单</view>
				</view>
				<view class="detail-box" v-if="item.orderImgArr?.length>0">
					<view class="a c">订单详情：</view>
					<view class="order-img-box">
						<image v-for="(src,i) in item.orderImgArr" :key="i" :src="GlobalConfig.imgUrl+src" mode="aspectFill"
							class="fi" @click="clickImg(item.orderImgArr,i)"></image>
					</view>
				</view>
				<view class="detail-box" v-if="props.isCenter && item.finishImgArr?.length>0">
					<view class="a c">送达照片：</view>
					<view class="order-img-box">
						<image v-for="(src,i) in item.finishImgArr" :key="i" :src="GlobalConfig.imgUrl+src" mode="aspectFill" class="fi" @click="clickImg(item.finishImgArr,i)"></image>
					</view>
				</view>
				<view class="btn">
					<button v-if="props.identity==1 && !props.isCenter" @click="takeOrder(item)">接单</button>
					<button v-if="props.isCenter && item.status==0 && item.userId==props.selfId" @click="retrnfun(item)">退款</button>
					<button v-if="props.identity==1 && item.status==1 && props.isCenter" @click="finishOrder(item)">通知取件</button>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script setup>
	import {defineProps,computed,defineEmits} from 'vue';
	import moment from 'moment'
	import https from '../utils/https.js'
	import GlobalConfig from '../GlobalConfig.js'
	
	const emits = defineEmits(["getOrders","eventFininsh"])
	
	const computedTime = computed(()=>(time)=>{
		return moment(time).format("YYYY-MM-DD HH:mm:ss")
	})
	const finishOrder = (item)=>{
		emits("eventFininsh",item)
	}
	const retrnfun = (item)=>{
		emits("retrnmoney",item)
	}
	
	const props = defineProps({
		list:{
			type:Array,
			default:[]
		},
		selfId:{
			type:Number,
			default:0
		},
		isCenter:{
			type:Boolean,
			default:false
		},
		identity:{
			type:Number,
			default:0
		}
	})
	
	
	const clickImg = (imgUrlArr, i) => {
		imgUrlArr = imgUrlArr.map(item=>GlobalConfig.imgUrl+item)
		wx.previewImage({
			current: imgUrlArr[i], // 当前显示图片的http链接
			urls: imgUrlArr // 需要预览的图片http链接列表
		})
	}
	const takeOrder = async (item) => {
		let res = await https({url:"/api/takeOrder",data:{orderId:item.id},method:"POST"})
		if(res.data.code!==1) return;
		if(res.data.data==-1){
			wx.showToast({
				title:"来晚了",
				icon:"none"
			})
		}else{
			wx.showToast({
				title:"成功",
				icon:"none"
			})
		}
		emits("getOrders")
	}
	
</script>

<style lang="scss" scoped>
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
	.btn {
		background-color: #ebebeb;
		margin-top: 5px;
		border-radius: 5px;
		button{
			background-color: #e56b00;
			color: #fff;
			margin-top: 20px;
		}
	}
	
	
	.list {
		display: flex;
		flex-direction: column;
		padding: 15px;
		border-radius: 12px;
		margin: 10px 5px;
		background-color: white;
	
		.title {
			font-size: 17px;
			padding: 10px 0;
			width: 100%;
			word-break: break-all;
			border-bottom: 1px solid #e56b00;
		}
	
		.body {
			.avatar {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 90px;
			}
	
			.detail {
				.detail-box {
					display: flex;
					width: 100%;
					padding: 4px;
	
					.a {
						width: 100px;
						letter-spacing: 10px;
					}
	
					.c {
						width: 100px;
						letter-spacing: 2px !important;
					}
	
					.b {
						flex: 1;
						letter-spacing: 2px;
						width: 100%;
						word-break: break-all;
					}
				}
			}
		}
	}
</style>