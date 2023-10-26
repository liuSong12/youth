<template>
		<view class="goods-item" v-for="(item,index) in props.goodsList" :key="item.id">
			<image :src="GlobalConfig.pathName+'/images/commondityImg/'+item.img" style="width: 50px; height:50px;margin-right: 10px;border-radius: 5px;" mode="aspectFill"></image>
			<view class="store-item-right">
				<view class="store-item-top">
					{{item.name}}
				</view>
				<view class="store-item-bottom">
					<view class="price">
						<text style="font-size: 12px;">￥</text>
						<text>{{item.price}}</text>
						<text class="dayan" v-if="item.iswork===1 || props.working===0">已打烊</text>
					</view>
					<view class="store-btn-right" v-if="item.iswork!==1 && props.working!==0">
						<button class="store-btn" @click="buceClick(0,item)">-</button>
						<text>{{shownum(item)}}</text>
						<button class="store-btn" @click="buceClick(1,item)">+</button>
					</view> 
				</view>
			</view>
		</view>
</template>

<script setup>
	import {defineProps,defineEmits,computed} from 'vue';
	import GlobalConfig from "../GlobalConfig.js"
	const emit =  defineEmits(["changenum"])
	const props = defineProps({
		goodsList:{
			type:Array,
			default:[]
		},
		selectgoods:{
			type:Array,
			default:[]
		},
		working:{
			type:Number,
			default:1
		}
	})
	
	const shownum = computed(()=>(item)=>{
		if(item.num){
			return item.num
		}else{
			let resobj = props.selectgoods.find(e=>e.id===item.id)
			return resobj?resobj.num:0
		}
	})
	
	const buceClick = (flag,item)=>{
		emit("changenum",flag,item)
	}
	
</script>

<style lang="scss" scoped>
	.dayan{
		font-size: 7px;
		color: white;
		margin-left: 5px;
		background-color: #76787b;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1px;
		height: 13px;
	}
	.store-btn-right{
		display: flex;
		height: 24px;
		line-height: 24px;
		box-sizing: border-box;
		margin-right: 5px;
		text{
			margin: 0 10px;
		}
		.store-btn{
			height: 24px;
			width: 24px;
			line-height: 21px;
			text-align: center;
			padding: 0;
			border-radius: 50%;
			background-color: #e56b00;
			color: white;
			font-size: 25px;
			font-weight: 600
		}
	}
	.goods-item {
		display: flex;
		height: 70px;
		align-items: center;
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
</style>