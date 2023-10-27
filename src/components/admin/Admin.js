import { JumboTabs } from 'antd-mobile'
import { useState} from 'react'
import StoreInfo from "./StoreInfo"
import WorkerInfo from "./WorkerInfo"
import Commondity from "../Commondity"
import {connect} from "react-redux"
import style from "../store/store.module.css"
 
function Admin({storeInfo,workerInfo}){
	let [defalutKey,setKey] = useState(storeInfo?"storeInfo":"workerInfo")
	
	
	return (
		<>
			<div className={style["top-nav"]}>
				<JumboTabs activeKey={defalutKey} onChange={setKey}>
				  {storeInfo && <JumboTabs.Tab title='商家个人信息' key='storeInfo'></JumboTabs.Tab>}
				  {storeInfo && <JumboTabs.Tab title='上传新品' key='upload'></JumboTabs.Tab>}
				  {workerInfo&&<JumboTabs.Tab title='快递员个人信息' key='workerInfo'></JumboTabs.Tab>}
				</JumboTabs>
			</div>
			
			{defalutKey=="storeInfo" && <StoreInfo/>}
			{defalutKey=="workerInfo" && <WorkerInfo info={workerInfo}/>}
			{defalutKey=="upload" && <Commondity/>}
		</>
	)
}

const mapStateToProps = (state)=>{
	return {
		storeInfo:state.GlobalStoreReducer.storeInfo,
		workerInfo:state.GlobalStoreReducer.workerInfo
	}
}

export default connect(mapStateToProps)(Admin)
