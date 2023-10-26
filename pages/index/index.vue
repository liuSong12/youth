<template>
	<view style="overflow: hidden;" :style="{height:state.windowHeight?state.windowHeight+'px':'auto'}">
		<OrderPrevious @click.stop v-show="state.showPrevious" :Info="{...state,money:price}" @hideEvent="hideMyPricePrevious"></OrderPrevious>
		<view class="notice">
			<uni-notice-bar :speed="50" scrollable single class="titleInfo"  showIcon :text="globalStore.data.notice[0]?.text || '热派，致力于全校便利'"></uni-notice-bar>
		</view>
		<view>
			<view class="box">
				<view class="title">
					填写信息
				</view>
				<view class="tip">
					温馨提示：每个取件码用“，”隔开
				</view>
				<view class="input">
					<textarea placeholder="请输入取件码和备注等,如:中通2451,圆通15-54" maxlength=1000 v-model="state.inputData">
					</textarea>
				</view>
				<view class="address" @click="chooseAddre">
					<text class="address-left">收货地址</text>
					<text class="address-right">
						{{state.address||"-"}}
						<text>></text>
					</text>
				</view>
				<view class="inputnum">
					<view class="section section_gap">
						<view class="section__title">大概重量（总重量/斤）</view>
						<slider name="slider" show-value max='7' @change="weightChange" activeColor="#e56b00"></slider>
					</view>
					<view class="section section_gap">
						<view class="section__title">数量（个）</view>
						<slider name="slider" show-value max='6' @change="numberChange" activeColor="#e56b00"></slider>
					</view>
				</view>
				<checkbox :checked="state.isChecked" @click="state.isChecked=!state.isChecked"
					style="padding-bottom: 18px;">校外取件或跨校区(过天桥)取件</checkbox>
				<view class="img">
					<text class="pl">照片（非必需）</text>
					<view class="img-box">
						<image v-for="(item, index) in state.imgArr" :key="item.tempFilePath" :src="item.tempFilePath" mode="aspectFill" class="fi" @click="showBigImg(index)"></image>
						<view class="pto" @click="chooseImg">
							+
						</view>
						<view v-show="state.imgArr.length>0" class="pto" style="font-size: 10px; margin-left: 7px;" @click="clear">
							清空
						</view>
					</view>
				</view>
				<view class="extrameney">
					<view class="extrameney-left">
						跑腿费(元)
					</view>
					<view class="extrameney-right">
						<button class="store-btn" @click="addprice(0)">-</button>
						<text>{{price}}</text>
						<button class="store-btn" @click="addprice(1)">+</button>
					</view>
				</view>
				<view class="bottom">
					跑腿费越多，同学跑得越快哦
				</view>
			</view>
			<view class="submit1">
				<button type="primary" :disabled="globalStore.data.notice[0]?.work==0" class="submit" @click="createOrder">{{globalStore.data.notice[0]?.work==0?'快递员已下班':'预览订单'}}</button>
			</view>
		</view>
		
		<view class="rules">
			<view class="title">计费规则:（数量与重量的计算）</view>
			<view class="rulesBody">
				<view class="pricetitle">
					<view class="iten">数量（个）</view> 
					<view class="iten">重量（斤）</view>
					<view class="iten">价格（元）</view>
				</view>
				<view class="body" :style="{height:state.hei+'px',overflow:'hidden'}">
					<view v-for="(itema,index) in globalStore.data.priceTable" :key="index">
						<view class="item" v-for="(e,i) in itema" :key="e">
							<view>{{i+1}}</view>
							<view>{{index+1}}</view>
							<view>{{e}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bton">
			<view  @click="setHeight(1)" class="btncontrol" v-if="state.hei==300">
				<image src="/static/icons/pulldown.png" mode="widthFix" class="minicon"></image>
			</view>
			<view @click="setHeight(2)" class="btncontrol" v-else>
				<image src="/static/icons/pulldown.png" mode="widthFix" class="minicon" style="transform: rotate(180deg);"></image>
			</view>
		</view>
		
		<view class="fooder">
			<view class="itemeg">
				0~1斤：订书机，发泥，一包圆珠笔；刮胡刀，u盘
			</view>
			<view class="itemeg">
				1~2斤：杯子，鼠标，键盘，衣服裤子裙子帽子，一瓶洗发水，手机
			</view>
			<view class="itemeg">
				2~3斤：小包装洗衣粉，一箱零食，一套洗发水，笔记本电脑，一套卷纸
			</view>
			<view class="itemeg">
				3~4斤：大瓶洗衣液，床帘
			</view>
			<view class="itemeg">
				5斤及以上：一双鞋，一箱牛奶，折叠椅，机箱
			</view>
		</view>
		
	</view>
</template>

<script setup>
	import useHomeStore from '../../store/homeStore.js'
	import useGlobalStore from '../../store/globalStore.js'
	import {onShow,onShareAppMessage,onShareTimeline} from '@dcloudio/uni-app'
	import {reactive,computed} from 'vue'
	import Decimal from 'decimal.js'
	import OrderPrevious from '../../components/orderPrevious.vue'
	
	onShareAppMessage(()=>{
		return {
		   title: '来热派，大放送', //分享的名称
		   path: 'pages/index/index',   //页面的路径
		}
	}) 
	//分享到朋友圈
	onShareTimeline(()=>{
		return {
		   title: '来热派，大放送',
		   type: 0,
		   path: 'pages/index/index'
		}
	})
	
	
	const store = useHomeStore();//homestore
	const globalStore = useGlobalStore();//globalStore
 
	const state = reactive({
		inputData: "",
		address: "",
		weight: 0,
		number: 0,
		reward:0,//打赏
		isChecked: false,//校外取件
		imgArr: [],//选中的图片
		showPrevious:false,//预览组件
		hei : 300,
		windowHeight:null
	})
	
	
	const setHeight = (num)=>{
		if(num==1){
			state.hei = 42*50
		}else{
			state.hei = 300
		}
	}
	
	const hideMyPricePrevious = ()=>{
		state.showPrevious=false
		state.windowHeight = null
	}
	
	const addprice = (flag)=>{
		if(state.weight==0||state.number==0) return;
		if(flag){
			//加
			state.reward = new Decimal(state.reward).add(new Decimal(0.1)).toNumber()
		}else{
			//减
			if(state.reward==0) return;
			state.reward = new Decimal(state.reward).sub(new Decimal(0.1)).toNumber()
		}
	}
	
	const price = computed(()=>{
		const {priceTable} = globalStore.data
		const {weight,number} = state
		if(weight==0||number==0) {
			state.reward = 0
			return 0
		};
		let res = new Decimal(priceTable[weight-1][number-1]).add(new Decimal(state.reward)).toNumber()
		return state.isChecked ? new Decimal(res).add(new Decimal("0.8")).toNumber():res
	})
	
	
	const showBigImg = (index)=>{
		let imgUrl = state.imgArr.map(item=>item.tempFilePath)
		wx.previewImage({
		  current: imgUrl[index], // 当前显示图片的http链接
		  urls: imgUrl // 需要预览的图片http链接列表
		})
	}
	const clear = ()=>{
		state.imgArr = []
	}

	const createOrder = () => {
		if(!wx.getStorageSync("token")){
			wx.showToast({
				title:"请先登录",
				icon:"none"
			})
			return;
		}
		if (!(state.inputData && state.address!="-" && state.weight && state.number)) {
			uni.showModal({
				title: "提示",
				content: "备注，收货地址，重量，数量必填"
			})
			return
		}
		
		state.showPrevious = true
		
		//防止滚动
		wx.getSystemInfo({
			success(res){
				state.windowHeight = res.windowHeight
			}
		})
		
		
	}
	const weightChange = (e) => {
		state.weight = e.detail.value
	}
	const numberChange = (e) => {
		state.number = e.detail.value
	}
	onShow(() => {
		
		if (wx.getStorageSync("address")) {
			state.address = JSON.parse(wx.getStorageSync("address")).address
		} else {
			state.address = "-"
			state.nickname = "微信用户"
		}
	})

	//收货地址
	const chooseAddre = function() {
		if(!wx.getStorageSync("token")){
			wx.showToast({
				title:"请先登录",
				icon:"none"
			})
			return;
		}
		wx.navigateTo({
			url: '/subpackage/address/address'
		})
	}

	const chooseImg = function() {
		wx.chooseMedia({
			count: 9,
			mediaType: ['image'],
			success(res) {
				state.imgArr = [...state.imgArr, ...res.tempFiles]
			},
			fail(err) {
				console.log(err)
			}
		})
	}
</script>

<style lang="scss" scoped>
	.bton{
		margin: auto;
		width: 300px;
		background-color: #e3e3e3;
		height: 30px;
		overflow: hidden;
		.btncontrol{
			text-align: center;
			line-height: 30px;
			width: 100%;
			height: 30px;
			font-size: 35px;
			color: white;
			.minicon{
				width: 20px;
				margin-bottom: 2px;
			}
		}
	}
	.fooder{
		margin:10px auto;
		width: 300px;
		padding-bottom: 20px;
		.itemeg{
			font-size: 12px;
			color: gray;
			padding: 3px;
		}
	}
	.rules{
		margin: 20px auto 0 auto;
		width: 300px;
		.title{
			width: 300px;
			height: 50px;
			line-height: 50px;
			text-align: center;
		}
		.rulesBody{
			width: 300px;
			.pricetitle{
				background-color: #d9d9d9;
				display: flex;
				width: 300px;
				height: 50px;
				justify-content: space-evenly;
				align-items: center;
				.iten{
					border: 1px solid #efefef;
					width: 100%;
					height: 100%;
					text-align: center;
					line-height: 50px;
				}
			}
			.body{
				transition: 0.5s;
				width: 300px;
				.item{
					width: 300px;
					display: flex;
					view{
						border: 1px solid #efefef;
						width: 100px;
						height: 50px;
						text-align: center;
						line-height: 50px;
						background-color: #ececec;
						box-sizing: border-box;
					}
				}
			}
		}
	}
</style>
<style lang="scss" scoped>
	.store-btn{
		height: 16px;
		width: 16px;
		line-height: 14px;
		text-align: center;
		padding: 0;
		border-radius: 50%;
		background-color: #e56b00;
		color: white;
		font-size: 25px;
		font-weight: 600
	}
	.img-box {
		display: flex;
		flex-wrap: wrap;
	}

	.notice {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		height: 25px;
		line-height: 25px;
		font-size: 12px;
		letter-spacing: 3px;
		position: relative;
	}

	.fi {
		width: 50px;
		height: 50px;
		margin: 5px 7px;
	}

	.img {
		display: flex;
		flex-direction: column;
	}

	.pto {
		width: 50px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 45px;
		color: #efefef;
		border: 1px dashed #efefef;
		margin: 5px 7px;
	}

	.submit[type=primary] {
		background-color: #e56b00;
		color: #fff;
	}

	.submit {
		margin: 20px 10px !important;
	}

	.box {
		margin: 50rpx 10px;
		border-radius: 10px;
		padding: 30rpx;
		box-shadow: 0 0 10px #aaaaaa;

		.title {
			width: 100%;
			line-height: 20px;
			text-align: center;
			color: #e56b00;
			padding: 10rpx 0;
			font-size: 25px;
			padding: 0 0 10px 0;
		}

		.tip {
			color: #b5b5b5;
			font-size: 12px;
			padding: 10px 0;
		}
 
		.input {
			width: 100%;
			height: 100px;
			background-color: #cfcfcf;
			transform: translateX(-6px);
			border-radius: 10px;
			padding: 5px;

			textarea {
				width: 100%;
				height: 100%;
			}
		}

		.address {
			display: flex;
			margin: 20px 0 10px 0;
			line-height: 50px;
			width: 100%;
			justify-content: space-between;
			z-index: 1;
			.address-right {
				display: flex;
				text {
					padding-left: 5px;
				}
			}
		}

		.extrameney {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;

			.extrameney-right {
				display: flex;
				text {
					width: 28px;
					height: 28px;
					text-align: center;
					line-height: 28px;
				}
				button {
					width: 28px;
					height: 28px;
					text-align: center;
					line-height: 23px;
					margin-left: 10px;
					margin-right: 10px;
				}
			}
		}

		.inputnum {
			height: 140px;
			overflow: hidden;

			slider {
				width: 90%;
			}
		}

		.intro {
			margin: 30px;
			text-align: center;
		}

		.bottom {
			color: #7e7e7e;
			font-size: 12px;
		}
	}
</style>