import { Button,Toast, Form,Input } from 'antd-mobile'
import { useEffect, useState } from 'react'
import style from "./login.module.css"
import axios from "axios"
import {connect} from "react-redux"
import { useNavigate } from 'react-router-dom'


function Login(props){
	//电话号码与姓名，查身份和商店注册情况
	const [name,setName] = useState("")
	const [phone,setPhone] = useState("")
	const navigate = useNavigate()
	const login =async ()=>{
		if(!(name&&phone)){
			 Toast.show({
				content: '请输入姓名和手机号',
				position: 'top',
			  })
			  return
		}
		let res = await axios.post("/manage/login",{name,phone}).then(res=>res.data)
		if(res.code!==1){
			Toast.show({
				content: res.msg,
				position: 'top',
			})
			return
		}
		props.setStoreInfo(res.data.storeInfo)
		props.setWorkerInfo(res.data.workerInfo)
		navigate("/")
	}
	useEffect(()=>{
		props.ChangeTabbar(false)
		return ()=>{
			props.ChangeTabbar(true)
		}
	},[])
	return (
		<div className={style.model}>
			<div className={style.form}>
			
			 <Form  layout='horizontal' mode='card'>
				 <Form.Item label='姓名'>
				   <Input placeholder='请输入' onChange={(e)=>setName(e)}/>
				 </Form.Item>
				<Form.Item label='手机号'>
				  <Input placeholder='请输入' onChange={(e)=>setPhone(e)}/>
				</Form.Item>
		     </Form>
			 <Button color="primary" className={style.subbtn} onClick={login}>登录</Button>
			 
			</div>
		</div>
	)
}
const mapDispathToProps = {
	setStoreInfo(payload){
		return {
			type:"initStore",
			payload
		}
	},
	setWorkerInfo(payload){
		return {
			type:"initWorker",
			payload
		}
	},
	ChangeTabbar(payload){
		return {
			type:"change-tabbar",
			payload
		}
	}
}

export default connect(null,mapDispathToProps)(Login)