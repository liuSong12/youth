import {  Button,Avatar,Form,Input,Switch,TextArea,Toast,Modal } from 'antd-mobile'
import {  useState } from 'react'
import style from "../store/detail/detail.module.css"
import GlobalConfig from "../../GlobalConfig.js"
import axios from "axios"
import {connect} from "react-redux"
import {useNavigate} from "react-router-dom"

function StoreInfo({info,updateStoreInfo}){
	const [status,setStatus] = useState(info.storeStatus)//0打烊1工作
	const [showStatus,setShowStore] = useState(info.showStatus)//null:展示 1：不展示	
	const [isDisAbled,setIsDisAbled] = useState(true)
	const navigate = useNavigate()
	 const [form] = Form.useForm()
	const hande = (e)=>{
		setStatus(e?1:0)
	}
	const cahangeShowStore = (e)=>{
		setShowStore(e?null:1)
	}
	
	const setsrc = (image)=>{
		 Modal.alert({
			image
		})
	}
	
	
	function handleUnlog() {
		Modal.confirm({
			content: '确认后执行',
			onConfirm: () => {
				localStorage.clear()
				navigate("/")
			}
		})
	}
	
	const handlerClick =async ()=>{
		let {name,price,title} = form.getFieldsValue()
		if(!(name&&price)){
			Toast.show({
				content: '请输入商家名称，打包费',
				position: 'top'
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
		
		let res = await axios.post("/manage/updateStore",{name,price,status,title,id:info.id,showStatus}).then(res=>res.data)
		if(res.code!==1) return
		let updateStoreInf = {...info,storeName:name,packagePrice:price,storeStatus:status,notice:title,showStatus}
		updateStoreInfo(updateStoreInf)
		setIsDisAbled(true)
		Toast.show({
			content: '更新成功',
			position: 'top'
		})
	}
	const cancel = ()=>{
		form.setFieldsValue({
			name: info.storeName || "",
			price: info.packagePrice || "",
			title:info.notice||"",
			responsePhone:info.responsePhone,
			responseName:info.responseName
		})
		setIsDisAbled(true)
	}
	return (
	<>
		<div style={{paddingBottom:"1.1rem"}}>
			<Form className={style.form} layout='horizontal' form={form} initialValues={{
			  name: info.storeName || "",
			  price: info.packagePrice || "",
			  title:info.notice||"",
			  responsePhone:info.responsePhone,
			  responseName:info.responseName
			}} footer={
				isDisAbled?<Button block type='submit' color='primary' size='large' onClick={()=>setIsDisAbled(false)}>
					修改
				</Button>
				:
				<div style={{display:"flex",justifyContent:"space-evenly"}}>
					<Button block type='submit' color="danger" size='large' onClick={handlerClick}>
						更新
					</Button>
					<Button block type='submit' color="primary" size='large' onClick={cancel}>
						取消
					</Button>
				</div>
			}>
				<Form.Item className={style.inp} name='name' label='商家名称'>
				  <Input placeholder='请输入商家名称' className={style.inpitem} disabled={isDisAbled}/>
				</Form.Item>
				<Form.Item className={style.inp} name='price' label='打包费(元)'>
				  <Input placeholder='请输入打包费' type="number"  className={style.inpitem} disabled={isDisAbled}/>
				</Form.Item>
				<Form.Item className={style.inp} label='商家负责人' name="responseName">
					<Input className={style.inpitem} disabled/>
				</Form.Item>
				<Form.Item className={style.inp} label='商家电话' name="responsePhone">
					<Input className={style.inpitem} disabled/>
				</Form.Item>
				
				<Form.Item className={style.inp} name='title' label='商家标语' >
				  <TextArea style={{"--font-size":"0.16rem"}} disabled={isDisAbled} placeholder='例如：欢迎大家光临' rows={3}/>
				</Form.Item>
				 
				<Form.Item className={style.inp} label={status==1?'上班中':'已打烊'}>
				  <Switch className={style.swith} disabled={isDisAbled} checked={status==1} onChange={hande}/>
				</Form.Item>
				<Form.Item className={style.inp} label={showStatus==null?'展示商店':'不展示'}>
				    <Switch className={style.swith} disabled={isDisAbled} checked={showStatus==null} onChange={cahangeShowStore}/>
				</Form.Item>
				<Form.Item className={style.inp} label='商家图片'>
					<div className={style.flexImg}>
						{
							 info.storeImgArr.split(",").map(item=>
							<Avatar preview={true} key={item} onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/storeImg/"+item)} src={GlobalConfig.DEFAULT_URL+"/images/storeImg/"+item} style={{ '--size': '48px' }} />)
						}
					</div>
				</Form.Item>
			</Form>
			<Button block type='submit' color='danger' style={{width:"95%",margin:"0px auto"}} size='large' onClick={handleUnlog}>
				退出登录
			</Button>
		</div>
	</>
	)
}

const mapStateToProps = (state)=>{
	return {
		info:state.GlobalStoreReducer.storeInfo
	}
}

const mapDisPatchToProps = {
	updateStoreInfo(payload){
		return {
			type:"initStore",
			payload
		}
	}
}

export default connect(mapStateToProps,mapDisPatchToProps)(StoreInfo)
