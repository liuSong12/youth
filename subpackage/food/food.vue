<template>
	<view>
		<wly-tabnav  :fixed="true" lineStyle="#e56b00" :tabnav="tabnav" @ontype_='ontype'></wly-tabnav>
		<view style="padding-top: 50px;">
			<uni-collapse >
				<uni-collapse-item v-for="(item,index) in state.list" :key="item.storeImg">
					<template v-slot:title>
						<view class="top-title">
							<view  class="top-title-left">
								<img style="width: 40px;height: 40px;margin-right: 10px;" mode="aspectFill" :src="GlobalConfig.pathName+'/images/storeImg/'+item.storeImg">
								<text>{{item.storeName}}</text>
							</view>
							<view  class="top-title-right">
								<text v-if="item.status===0" style="color: #f53647;">正在派送</text>
								<text v-if="item.status===1">已送达</text>
								<text v-if="item.status===2">已退款</text>
							</view>
						</view>
					</template>
					<view class="content">
						<view class="text">
							<view class="item">
								<view>收货地址： {{item.address}}</view>
								<view>商家电话：{{item.storePhone}}</view>
							</view>
							<view class="item">
								<view>打包费：￥{{item.packagePrice}}</view>
								<view>{{timeComputed(item.createTime)}}</view>
							</view>
						</view>
						<view class="goods-item" v-for="(e,i) in item.commondities" :key="index">
							<view class="goods-item">
								<image :src="GlobalConfig.pathName+'/images/commondityImg/'+e.commondityImg" style="width: 40px; height:40px;margin-right: 10px;" mode="aspectFill"></image>
								<view class="store-item-right">
									<view class="store-item-top">
										{{e.commondityName}}
									</view>
									<view class="store-item-bottom">
										<view class="price">
											<text style="font-size: 12px;">￥</text>
											<text>{{e.commondityPrice}}</text>
										</view>
									</view>
								</view>
							</view>
							<view>X{{e.num}}</view>
						</view>
						<view class="finishImg" v-if="item.finishImg?.length>0">
							<view>
								送达照片：
							</view>
							<view class="finishImg-item">
								<image :key="t" v-for="(t,myi) in item.finishImg" @click="handleShowImage(item.finishImg,myi)" :src="GlobalConfig.pathName+'/images/commondityImg/'+t" style="width: 40px; height:40px;margin-right: 10px;" mode="aspectFill"></image>
							</view>
						</view>
					</view>
				</uni-collapse-item>
			</uni-collapse>
		</view>
		<view class="noting" v-if="state.list.length==0">
			暂无订单
		</view>
	</view>
</template>

<script setup>
	import {reactive,computed} from "vue"
	import GlobalConfig from "../../GlobalConfig.js"
	import https from "../../utils/https.js";
	import {onShow} from "@dcloudio/uni-app";
	import moment from "moment"
	
	const state = reactive({
		list:[]
	})
	
	const handleShowImage = (arr,i)=>{
		let imgUrlArr = arr.map(item=>GlobalConfig.pathName+'/images/commondityImg/'+item)
		wx.previewImage({
			current: imgUrlArr[i], // 当前显示图片的http链接
			urls: imgUrlArr // 需要预览的图片http链接列表
		})
	}
	
	const tabnav = [{
		type: '0', 
		name: '我的订单',
		list: []
	}, {
		type: '1', 
		name: '正在派送',
		list: []
	}, {
		type: '2', 
		name: '已退款',
		list: []
	}]
	onShow(async()=>{
		await getCenterOrders(0)
	})
	const timeComputed = computed(()=>(time)=>{
		return moment(time).format("YYYY/MM/DD HH:mm:ss")
	})
	
	let nowType = 0
	const ontype =async function(e){
		//根据不同的type发送数据
		nowType = e.type
		await getCenterOrders(e.type)
	}
	async function getCenterOrders(type){
		let res = await https({url:`/api/getCommondities?type=${type}`})
		if(res.data.code!==1) return;
		state.list = res.data.data
		console.log(res.data.data)
	}

</script>

<style lang="scss" scoped>
	.noting{
		text-align: center;
		color: gray;
		font-size: 15px;
		margin: 10px auto;
	}
.goods-item {
	display: flex;
	height: 70px;
	align-items: center;
	justify-content: space-between;
	padding: 10px 5px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(80, 86, 96, .3);
	.store-item-right{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex:1;
		height: 100%;
		.store-item-top{
			font-size: 16px;
			font-weight: 400;
		}
		.store-item-bottom{
			display: flex;
			justify-content: space-between;
			width: 100%;
			.price{
				font-size: 18px;
				color: red;
				display: flex;
				align-items: center;
			}
		}
	}
	uni-image {
		display: block;
		width: 100rpx;
		height: 100rpx;
		margin: 0 auto 32rpx;
		border-radius: 4rpx;
	}

	uni-text {
		font-size: 24rpx;
		color: #505660;
	}
}
.content{
	padding: 0px 23px;
	.text{
		color: #929292;
		display: flex;
		flex-direction: column;
		.item{
			display: flex;
			justify-content: space-between;
			
		}
	}
}
.top-title{
	display: flex;
	justify-content: space-between;
	height: 60px;
	padding: 0px 5px 0px 18px;
	.top-title-right{		
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100px;
		color: #505660;
	}
	.top-title-left{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 100%;
		flex:1;
	}
}
</style>
