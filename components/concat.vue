<template>
	<view class="model">
		<view class="form">
			<view class="mod" @click="handleClcik()">+</view>
			<view class="name item">
				<text selectable class="aaa">
					{{props.concat || "【请先登录】"}}
				</text>
			</view>
			<view class="title">
				tips： 沟通是交流的开端;沟通是友谊的桥梁;沟通是心与心的交流;沟通是真诚和友谊的伙伴
			</view>
		</view>
	</view>
</template>

<script setup>
	import {defineEmits,defineProps} from 'vue'
	const emit = defineEmits(["event"])
	const props = defineProps({
		concat:{
			type:String||null,
			default:null
		}
	})
	const handleClcik = ()=>{
		emit('event')
	}
	
</script>

<style lang="scss">
	.submit[type=primary] {
	    background-color: #e56b00;
	    color: #fff;
	}
	.submit{
		margin-top: 35px !important;
	}
	.item{
		line-height: 50px;
		height: 50px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		view{
			width: 70px;
		}
		input{
			
			flex:1;
			color: black;
		}
	}
	.aaa{
		text-align: center;
		width: 100%;
	}
	.model{
		position: fixed;
		left: 0;
		right:0;
		top:0;
		bottom:0;
		background-color: rgba(0, 0, 0, .3);
		overflow: hidden;
		z-index: 20;
		.mod{
			position: absolute;
			top:-15px;
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
		.form{
			z-index: 2;
			position: relative;
			padding: 50px 20px;
			margin: 150px auto;
			box-sizing: border-box;
			width: 90%;
			height: 200px;
			background-color: white;
			border-radius: 5px;
			.title{
				font-size: 12px;
				color: #3a3a3e;
				text-align: center !important;
				height: 50px;
				width: 100%;
			}
		}
	}
</style>