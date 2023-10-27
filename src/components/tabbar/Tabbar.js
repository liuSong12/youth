import {TabBar } from 'antd-mobile'
import {useState} from "react"
import style from "./tabbar.module.css"
import {
  UnorderedListOutline,
  ReceivePaymentOutline,
  UserSetOutline,
  GlobalOutline,
} from 'antd-mobile-icons'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {connect} from "react-redux"
import checkSuper from "../../utils/checkSuper"

function MyTabBar({isWorker,isStore,packageNum,storeNum,changeStoreNum,changePackageNum}){
	const [tabs,setTabs] = useState([])
	const location = useLocation()
	  useEffect(()=>{
		  let newTabs = [
			{
			  key: '/store',
			  title: '商店',
			  icon: <UnorderedListOutline />,
			  badge: storeNum?storeNum:undefined,
			},
			{
			  key: '/package',
			  title: '包裹',
			  icon: <ReceivePaymentOutline />,
			  badge: packageNum?packageNum:undefined,
			},
			{
			  key: '/admin',
			  title: '个人中心',
			  icon: <UserSetOutline />,
			},
			{
				key: '/superAdmin',
				title: 'super',
				icon: <GlobalOutline />,
			}
		  ]
		  //这里有待提升
		  if(checkSuper(isWorker,isStore)){
				if(isStore !==null && isWorker == null){
					newTabs = newTabs.filter(i=>i.key!=="/package")
				}else if(isStore==null && isWorker!==null){
					newTabs = newTabs.filter(i=>i.key!=="/store")
				}
				setTabs(newTabs)
				return
		  }
		  
		  if(isStore !==null && isWorker==null){
			  //是 商店 不是 快递员
			newTabs = newTabs.filter(i=>(i.key!=="/package" && i.key!=="/superAdmin"))
		  }else if(isStore==null&&isWorker!==null){
			  //是 快递员 不是 商店
			newTabs = newTabs.filter(i=>(i.key!=="/store" && i.key!=="/superAdmin"))
		  }else{
			  //两样都是
			  newTabs = newTabs.filter(i=>(i.key!=="/superAdmin"))
		  }
		  setTabs(newTabs)
	  },[packageNum,storeNum,isWorker,isStore])
  

	const [activeKey, setActiveKey] = useState()
	useEffect(()=>{
		setActiveKey(location.pathname)
	},[location.pathname])
	const navigate = useNavigate()
	const handleClik = (e)=>{
		e=="/store" && changeStoreNum(0)
		e=="/package" && changePackageNum(0)
		navigate(e)
	}

  return (
    <>
        <TabBar className={style.mytabbar} safeArea  activeKey={activeKey} onChange={handleClik}>
          {tabs.length && tabs.map(item => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              badge={item.badge}
            />
          ))}
        </TabBar>
    </>
  )
}

const mapStateToProps = (state)=>{
	return {
		isWorker:state.GlobalStoreReducer.workerInfo,
		isStore:state.GlobalStoreReducer.storeInfo,
		storeNum:state.TabbarReducer.storeNum,
		packageNum:state.TabbarReducer.packageNum
	}
}
const mapDispatchToProps = {
	changeStoreNum(payload){
		return {
			type:"change-storenum",
			payload
		}
	},
	changePackageNum(payload){
		return {
			type:"change-packageNum",
			payload
		}
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(MyTabBar)