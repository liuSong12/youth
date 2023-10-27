import {JumboTabs } from 'antd-mobile'
import { useState } from 'react'
import styles from "./store.module.css"
import {connect} from "react-redux"
import Sending from "./sending/Sending"
import All from "./all/All"
import AllOrder from "./allorder/AllOrder"
import Stop from "./stop/Stop"
import {set,get} from "../../utils/setLocal.js"

function Store(props) {
	//展示所有商品，打烊商品
	let [defalutKey,setKey] = useState(get("store-nav")||"sending")
	
	const handleChange = (e)=>{
		set("store-nav",e)
		setKey(e)
	}
	
  return (
   <>
		{
			props.isShow && <div className={styles["top-nav"]}>
			<JumboTabs activeKey={defalutKey} onChange={(e)=>{handleChange(e)}} >
			  <JumboTabs.Tab title='正在派送' key='sending'></JumboTabs.Tab>
			  <JumboTabs.Tab title='所有订单' key='allorder'></JumboTabs.Tab>
			  <JumboTabs.Tab title='已停售' key='stop'></JumboTabs.Tab>
			  <JumboTabs.Tab title='我的商品' key='all'></JumboTabs.Tab>
			</JumboTabs>
			</div>
		}
		<div style={{paddingBottom:"1.1rem"}}>
			{defalutKey=="sending" && <Sending/>}
			{defalutKey=="allorder" && <AllOrder/>}
			{defalutKey=="stop" && <Stop/>}
			{defalutKey=="all" && <All/>}
		</div>
		
		
		
		
   </>
  )
}

const mapStateToProps = (state)=>{
	return {
		isShow:state.TabbarReducer.isShow
	}
}
export default connect(mapStateToProps)(Store)