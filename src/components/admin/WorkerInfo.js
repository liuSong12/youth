import {  Button,Avatar,Form, Modal } from 'antd-mobile'
import style from "../store/detail/detail.module.css"
import GlobalConfig from "../../GlobalConfig.js"
import {useNavigate} from "react-router-dom"

export default function WorkerInfo({info}){
	const navigate = useNavigate()
	function handleUnlog() {
		Modal.confirm({
			content: '确认后执行',
			onConfirm: () => {
				localStorage.clear()
				navigate("/")
			}
		})
	}
	const setsrc = (image)=>{
		 Modal.alert({
			image
		})
	}
	
	return (
	<>
		<Form className={style.form} layout='horizontal' footer={
			<Button block type='submit' color='danger' size='large' onClick={handleUnlog}>
				退出登录
			</Button>
		}>
			<Form.Item className={style.inp} label='快递员姓名' >
				<div style={{fontSize:"0.16rem"}}>{info.wokerName}</div>
			</Form.Item>
			<Form.Item className={style.inp} label='快递员电话' >
				<div style={{fontSize:"0.16rem"}}>{info.workerPhone}</div>
			</Form.Item>
			 
			<Form.Item className={style.inp} label='身份信息'>
			  <Avatar onClick={()=>setsrc(GlobalConfig.DEFAULT_URL+"/images/workerImg/"+info.studentImg)} src={GlobalConfig.DEFAULT_URL+"/images/workerImg/"+info.studentImg} style={{ '--size': '48px' }} />
			</Form.Item>
		</Form>
	</>
	)
}