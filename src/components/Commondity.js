import {Form,Button,Switch,Input,ImageUploader,Toast,Avatar } from 'antd-mobile'
import { DeleteOutline } from 'antd-mobile-icons'
import { useEffect, useState } from "react"
import axios from "axios"
import style from "./store/detail/detail.module.css"
import GlobalConfig from "../GlobalConfig.js"
import {connect} from "react-redux"

function Commondity({info,detailInfo,changDetail}) {
	detailInfo = detailInfo ? detailInfo : {}
	
	
	const [imgUrl,setImgUrl] = useState()
	const [status,setStatus] = useState(detailInfo.commonditystatus || 0)//0有货
	const [img,setImg] = useState()
	const [form] = Form.useForm()
	
	const [disAble,setDisAble] = useState(detailInfo.id ? true : false)
	
	const cancel = ()=>{
		form.setFieldsValue({
			name: detailInfo.commondityName || "",
			price: detailInfo.commondityPrice  || ""
		})
		setStatus(detailInfo.commonditystatus || 0)
		setDisAble(true)
	}
	
	const mockUpload = (file)=>{
		setImg(file)
		return {
			url:URL.createObjectURL(file)
		}
	}
	const hande = (e)=>{
		setStatus(e?0:1)
	}
	const handlerClick =async ()=>{
		console.log(form.getFieldsValue())
		if(!info.packagePrice || !info.storeName){
			Toast.show({
				content: '请输入商家名称，打包费',
				position: 'top',
			  })
			return
		}
		const {price,name} = form.getFieldsValue()
		if(!(name&&price&&img)){
			Toast.show({
				content: '请输入名称，价格，图片',
				position: 'top',
			  })
			return
		}
		try {
			let reg = /^\d+(\.\d{1,2})?$/
			let flag = reg.test(Number(price))
			if(!flag){
				Toast.show({
					content: '打包费最多两位小数',
					position: 'top'
				})
				return
			}
		} catch (error) {
			Toast.show({
				content: '打包费最多两位小数',
				position: 'top'
			})
			return
		}
		let fd = new FormData()
		fd.append("name",name)
		fd.append("price",price)
		fd.append("status",status)
		fd.append("commondityId",detailInfo.id)//id并不是商家id，而是商家商品id
		fd.append("img",img)
		fd.append("superStoreId",detailInfo.flag?detailInfo.id:undefined)
		let res = await axios.post("/manage/upload",fd).then(res=>res.data)
		if(res.code!==1) return;
		let {name:nm,price:pr,status:st,filename:fi} = res.data
		if(detailInfo.id){
			changDetail({
				commondityName: nm,
				commondityPrice: pr,
				commondityimg: fi,
				commonditystatus: st,
				id:detailInfo.id,
				storeId:detailInfo.storeId,
				saleNum: detailInfo.saleNum
			})
			setDisAble(true)
		}else{
			form.resetFields()
			setImg(null)
			setImgUrl([])
			setStatus(0)
			Toast.show({
				content: '成功',
				position: 'top'
			})
		}
	}
	const update = ()=>{
		axios(`/manage/getImg?url=${detailInfo.commondityimg}`,{responseType:"blob"}).then(res=>{
			let file = new File([res.data],"a.png",{type:"image/png"})
			setImg(file)
			setImgUrl([{
				url:URL.createObjectURL(res.data)
			}])
		}).catch(err=>{
			if(err.response.status==404){
				Toast.show({
					content: '出错了，请联系管理员',
					position: 'top'
				})
				return
			}
		})
		setDisAble(false)
	}
	return (
	<>
	<Form className={style.form} layout='horizontal' form={form} initialValues={{
		price:detailInfo.commondityPrice || "",
		name:detailInfo.commondityName || "",
		commondityId:detailInfo.id,
		storeId:detailInfo.storeId
		}}
		footer={
			disAble?
			<Button block type='submit' color='primary' size='large' onClick={()=>{
				update()
			}} >
	            修改
	        </Button>:
			<div>
				{
					detailInfo.id?<div style={{display:"flex",justifyContent:"space-evenly"}}>
						<Button block type='submit' color="danger" size='large' onClick={handlerClick}>
							更新
						</Button>
						<Button block type='button' color="primary" size='large' onClick={cancel}>
							取消
						</Button>
					</div>:
					<Button block type='submit' color='primary' size='large' onClick={handlerClick} >
					    上传
					</Button>
				}
			</div>
		}>
		{
			detailInfo.storeId && <Form.Item className={style.inp} name='commondityId' label='商品id' >
			  <Input className={style.inpitem} disabled/>
			</Form.Item>
		}
		{
			detailInfo.storeId && <Form.Item name='storeId' label='商店id' className={style.inp}>
				<Input className={style.inpitem} disabled/>
			</Form.Item>
		}
		<Form.Item className={style.inp} name='name' label='商品名称' >
		  <Input placeholder='请输入商品名称' className={style.inpitem} disabled={disAble}/>
		</Form.Item>
		<Form.Item name='price' label='价格' className={style.inp}>
			<Input placeholder='请输入商品价格,最多两位小数' type="number" className={style.inpitem} disabled={disAble}/>
		</Form.Item>
		<Form.Item className={style.inp} label={status==0?'已上架':'无货'} childElementPosition='right'>
		  <Switch className={style.swith} checked={status==0} onChange={hande} disabled={disAble}/>
		</Form.Item>
		<Form.Item className={style.inp} label='商品图片'>
			{
				detailInfo.id && disAble && <Avatar src={ GlobalConfig.DEFAULT_URL+"/images/commondityImg/"+detailInfo.commondityimg} style={{ '--size': '80px' }}/>
			}
			{ (!detailInfo.id || !disAble) && <ImageUploader
					onDelete={(e)=>{setImg(null)}}
					deleteIcon={<DeleteOutline />}
					maxCount={1}
				    value={imgUrl}
				    onChange={setImgUrl}
				    upload={mockUpload}
					preview={true}
				/>
			}
		</Form.Item>
	</Form>
	</>
	)
}

const mapStateToProps = (state)=>{
	return {
		info:state.GlobalStoreReducer.storeInfo
	}
}
const mapDispatchToProps = {
	changDetail(payload){
		return {
			type:"changeDetail",
			payload
		}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Commondity)
