import { Button, Input } from "antd-mobile";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function Concat(){
	const [value,setValue] = useState("")
	const [oldValue,setOldvalue] = useState("")
	function get(){
		axios("/manage/getconcat").then(res=>{
			if(res.data.code!==1) return;
			setOldvalue(res.data.data)
		})
	}
	useEffect(()=>{
		get()
	},[])
	const handleClick = ()=>{
		console.log(value)
		if(!value) return;
		axios.patch(`/manage/updateconcat?value=${value}`).then(res=>{
			if(res.data.code!==1) return;
			get()
		})
	}
	return (
	<>
		<h1 style={{textAlign:'center'}}>
			{oldValue}
		</h1>
		<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgb(218, 217, 217)",padding:"3px 5px"}}>
			<Input style={{margin:"3px 5px",background:"white",borderRadius:"5px",height:"40px"}} value={value} onChange={setValue}/>
			<Button onClick={handleClick} color="warning" style={{height:"40px",width:"80px"}} size="mini">更新</Button>
		</div>
	</>
	)
}