import { JumboTabs } from 'antd-mobile'
import { useState} from 'react'
import { get, set } from '../../utils/setLocal'
import CustomCard from '../store/CustomCard'
import MyCard from '../store/MyCard'
import style from "../store/store.module.css"
import StoreList from "./storelist/StoreList"
import User from "./users/User"
import PackageList from "./packagelist/PackageList"
import Notice from "./notice/Notice"
import SettlEment from './settlement/SettlEment'
import PriceTable from './pricetable/PriceTable'
import { useEffect } from 'react'
import Concat from './concat/Concat'


export default function SuperAdmin(){
	let [defalutKey,setKey] = useState(get("super-nav") || "storelist")
	const handleChange = (e)=>{
		setKey(e)
		set("super-nav",e)
	}
	return (
	<>
		<div className={style["top-nav"]}>
			<JumboTabs activeKey={defalutKey} onChange={(e)=>handleChange(e)} >
			  <JumboTabs.Tab title='商家列表' key='storelist'></JumboTabs.Tab>
			  <JumboTabs.Tab title='商品列表' key='commonditylist'></JumboTabs.Tab>
			  <JumboTabs.Tab title='商家订单' key='commondityorder'></JumboTabs.Tab>
			  <JumboTabs.Tab title='包裹订单' key='packagelist'></JumboTabs.Tab>
			  <JumboTabs.Tab title='用户列表' key='user'></JumboTabs.Tab>
			  <JumboTabs.Tab title='通知' key='notice'></JumboTabs.Tab>
			  <JumboTabs.Tab title='价格表' key='pricetable'></JumboTabs.Tab>
			  <JumboTabs.Tab title='金额结算' key='settlement'></JumboTabs.Tab>
			  <JumboTabs.Tab title='联系方式' key='concat'></JumboTabs.Tab>
			</JumboTabs>
		</div>
		<div style={{paddingBottom:"1.1rem",position:'relative'}}>
			{defalutKey=="commonditylist" && <MyCard super={1}/>}
			{defalutKey=="commondityorder" && <CustomCard type={10}/>}
			{defalutKey=="packagelist" && <PackageList/>}
			{defalutKey=="storelist" && <StoreList/>}
			{defalutKey=="user" && <User/>}
			{defalutKey=="notice" && <Notice/>}
			{defalutKey=="pricetable" && <PriceTable/>}
			{defalutKey=="settlement" && <SettlEment/>}
			{defalutKey=="concat" && <Concat/>}
			
			
		</div>
		
		
	</>
	)
}