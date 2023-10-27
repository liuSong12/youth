import { Input } from "antd-mobile"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import style from "./pricetable.module.css"

export default function PriceTable(){
	const [list,setList] = useState([])
	const [isShow,setIsshow] = useState(false)
	const [value,setValue] = useState("")
	const [id,setId] = useState("")
	const myref = useRef()
	const inpRef = useRef()
	
	function getPrice(){
		axios("/manage/getPrice").then(res=>{
			if(res.data.code!==1) return;
			setList(res.data.data)
		})
	}
	useEffect(()=>{
		getPrice()
	},[])
	
	const handleClick = (tag,obj)=>{
		setId(obj.id)
		setValue(obj.price)
		const {top,left}  = tag.target.getBoundingClientRect()
		myref.current.style.left = left +'px'
		myref.current.style.top = top - 50+'px'
		setIsshow(true)
	}
	const handleblur = async ()=>{
		if(!/^\d+(\.\d{0,2})?$/.test(value)) return;
		let res = await axios.patch(`/manage/changeProce?id=${id}&price=${value}`).then(res=>res.data)
		if(res.code!==1) return;
		getPrice()
		setIsshow(false)
	}
	return (
	<>
		<div className={style.rules}>
			<div className={style.title}>计费规则:（数量与重量的计算）</div>
			<div className={style.rulesBody}>
				<div className={style.pricetitle}>
					<div className={style.iten}>数量（个）</div> 
					<div className={style.iten}>重量（斤）</div>
					<div className={style.iten}>价格（元）</div>
				</div>
				<div className={style.body}>
					{
						list.map((itema,index)=>
						<div key={index}>
						 {
							 itema.map((e,i)=>
							 <div className={style.item} key={e.id}>
								<div className={style.view}>{i+1}</div>
								<div className={style.view}>{index+1}</div>
								<div className={style.view} onClick={(tag)=>handleClick(tag,e)}>{e.price}</div>
							</div>)
						 }
					</div>)
					}
				</div>
			</div>
		</div>
		<div ref={myref} style={{position:'absolute',background:"#eeeeee",display:isShow?'block':'none',width:'100px'}}>
			<Input ref={inpRef} value={value} onChange={setValue} onBlur={handleblur}/>
		</div>
	</>
	)
}