import { useState,useEffect} from "react"
import { Card, Button,Toast,Avatar,JumboTabs } from 'antd-mobile'
import style from "./package.module.css"
import GetOrder from "./getorder/GetOrder"
import Sending from "./sending/Sending"
import AllOrder from "./allorder/AllOrder"
import { set,get } from "../../utils/setLocal"

export default function Package() {
	let [defalutKey,setKey] = useState(get("package-nav") || "getorder")
	
	const handleChange = (e)=>{
		setKey(e)
		set("package-nav",e)
	}
	
	
  return (
   <>
		<div className={style["top-nav"]}>
			<JumboTabs activeKey={defalutKey} onChange={(e)=>handleChange(e)}>
			  <JumboTabs.Tab title='抢单' key='getorder'></JumboTabs.Tab>
			  <JumboTabs.Tab title='正在派送' key='sending'></JumboTabs.Tab>
			  <JumboTabs.Tab title='所有订单' key='allorder'></JumboTabs.Tab>
			</JumboTabs>
		</div>
		
		
		{defalutKey=="getorder" && <GetOrder/>}
		{defalutKey=="sending" && <Sending/>}
		{defalutKey=="allorder" && <AllOrder/>}
		
   </>
  )
}

