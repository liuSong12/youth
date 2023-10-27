import { useEffect } from "react";
import axios from "axios"
import { useState } from "react";
import moment from "moment"
import {Button, Calendar, List,Modal,Toast} from "antd-mobile"

export default function SettlEment(){
	const [list,setList] = useState([])
	const [total,settotal] = useState("")
	const [supposedMoney,setSupposedMoney] = useState("")
	const [visible,setVisibal] = useState(false)
	const [date,setDate] = useState(null)
	
	function getsettlement(){
		axios("/manage/getsettlement").then(res=>{
			if(res.data.code!==1) return;
			console.log(res.data.data)
			setList(res.data.data.topUpdata)
			settotal(res.data.data.total)
			setSupposedMoney(res.data.data.supposedMoney)
		})
	}
	
	useEffect(()=>{
		getsettlement()
	},[])
	
	const handleClick = (flag)=>{
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let res = await axios(`/manage/settle?type=${flag}`).then(res=>res.data)
				console.log(res)
				if(res.code!==1) return;
				Toast.show({
					content: res.data,
					position: 'top'
				})
				getsettlement()
			}
		})
	}
	const handleUnfrezz = ()=>{
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let res = await axios(`/manage/unfrezz`).then(res=>res.data)
				if(res.code!==1) return;
				Toast.show({
					content: res.data,
					position: 'top'
				})
				getsettlement()
			}
		})
	}
	
	const downLoad = async (e)=>{
			if(e.key!="confirm") return;
			if(!date) return;
			let res = await axios.post("/manage/getWxOrders",{date}).then(res=>res.data)
			console.log(res)
			if(res.code!==1){
				Toast.show({
					content: res.msg,
					position: 'top'
				})
				return;
			}
			let blob = new Blob([res.data.data],{type:"text/plain:charset=utf-8"})
			let url = URL.createObjectURL(blob)
			let a = document.createElement("a")
			a.download = "微信资金流水.txt"
			a.href = url
			a.style.display = "none"
			document.body.appendChild(a)
			a.click()
			a.remove()
		}

	
	return (
	<>
		<Modal
			closeOnMaskClick={true}
	        visible={visible}
	        content={<Calendar selectionMode='single' defaultValue={new Date()} onChange={val => {
				console.log(val)
				if(!val) return;
				setDate(moment(val).format("yyyy-MM-DD"))
			  }}/>}
	        closeOnAction
	        onClose={() => {
	          setVisibal(false)
	        }}
			onAction={downLoad}
	        actions={[
	          {
	            key: 'confirm',
	            text: '下载',
	          },
	        ]}
	      />
		 <List header={
			 <div>
				<div>
					<span style={{marginRight:"10px"}}>待结算:{total}元</span>
					<span style={{marginRight:"10px"}}>应有余额:{supposedMoney}元</span>
				</div>
				<span style={{marginRight:"10px"}}>我的余额:{list[0]?list[0].totalMoney:0}元</span>
				<div style={{display:"flex"}}>
					<Button color="danger" size="mini" onClick={()=>handleClick(1)}>结算并解冻</Button>
					<Button color="primary" size="mini" onClick={()=>handleClick()}>结算不解冻</Button>
					<Button color="warning" size="mini" onClick={handleUnfrezz}>解冻剩余金额</Button>
				</div>
				<div style={{marginTop:'10px'}}>
					<Button size="mini" color="success" onClick={()=>setVisibal(true)}>下载账单</Button>
				</div>
			 </div>
		 }>
			{
				list.map(item=>
				<List.Item key={item.id} style={{paddingRight:"10px"}}>
					<div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
						<div>
							{moment(item.updateTime).format("yyyy-MM-DD HH:mm:ss")}
						</div>
						<div style={{width:"120px",display:"flex",justifyContent:"start"}}> 
							<span style={{minWidth:"55px",color:item.money.startsWith("-")?"red":"#57a800"}}>{item.money.startsWith("-")?item.money:"+"+item.money}</span>
							<span>余{item.totalMoney}</span>
						</div>
					</div>
				</List.Item>
				)
			}
		</List>
	</>
	)
}