import { Input, List, Switch,Button,Modal } from "antd-mobile"
import axios from "axios"
import { useRef, useState } from "react"

export default function IndexNotice({getNotice,notice}){
	const [value,setValue] = useState("")
	const [isShow,setIsshow] = useState(false)
	const [id,setId] = useState("")
	const [add,setAdd] = useState("")
	
	const handleChange = async (item,type)=>{
		// type:1更新上下班，2：更新默认通知，3更新内容
		let res = await axios.patch(`/manage/changenotice?type=${type}&work=${item.work}&id=${item.id}&text=${item.text}&isDefalut=${item.isdefault}`).then(res=>res.data)
		if(res.code!==1) return;
		getNotice()
	}
	
	const handleblur = async ()=>{
		await handleChange({id,text:value},3)
		setIsshow(false)
	}
	
	const handleClick = (item)=>{
		setValue(item.text)
		setId(item.id)
		setIsshow(true)
	}
	
	const addnotice = async ()=>{
		if(!add) return;
		let res = await axios.post("/manage/addnotice",{type:"notice",val:add}).then(res=>res.data)
		if(res.code!==1) return;
		setAdd("")
		await getNotice()
	}
	
	const hadnleClci = async (item)=>{
		
		Modal.confirm({
			content: '确认后执行',
			onConfirm:async () => {
				let res = await axios.delete(`/manage/deletenotice?type=notice&id=${item.id}`).then(res=>res.data)
				if(res.code!==1) return;
				await getNotice()
			}
		})
		
		
	}
	
	return (
	<>
		<List>
			{
				notice.map(item=>
				<List.Item key={item.id} extra={
					<div style={{"transform":"scale(.8)"}}>
						<Button size="mini" onClick={()=>{hadnleClci(item)}} color="danger">删除</Button>
						<Switch style={{marginRight:"5px"}} uncheckedText='下班' checkedText='上班' checked={item.work==1} onChange={()=>{handleChange(item,1)}}/>
						<Switch uncheckedText='其他' checkedText='通知' checked={item.isdefault!==null} onChange={()=>{handleChange(item,2)}}/>
					</div>
					}>
					<div style={{color:"gray"}} onClick={(e)=>handleClick(item)}>{item.text}</div>
				</List.Item>)
			}
			{isShow&&<div style={{margin:"5px 10px",padding:"9px 5px",background:"#eeeeee",borderRadius:"5px"}}>
				<Input style={{background:"white",borderRadius:"3px"}} value={value} onChange={setValue} onBlur={handleblur} clearable/>
			</div>}
			
			{!isShow&&<div style={{margin:"5px 10px",padding:"9px 5px",background:"#eeeeee",borderRadius:"5px",display:"flex"}}>
				<Input style={{background:"white",borderRadius:"3px",flex:'1'}} value={add} onChange={setAdd} clearable/>
				<Button onClick={addnotice} style={{width:"61px"}} size="mini" color="primary">添加</Button>
			</div>}
		</List>
	</>
	)
}