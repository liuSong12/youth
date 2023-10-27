import {useRoutes,Navigate} from 'react-router-dom'
import LazyLoad from "../utils/LazyLoad.js"
import AuthRoute from "../utils/AuthRoute.js"
import SandBox from "../views/mainbox/SandBox"
import { Children, useEffect, useState } from 'react'
import {connect} from "react-redux"
import checkSuper from "../utils/checkSuper.js"

function useIndexRouter({isWorker,isStore}) {
	const [HomeChildren,setHomeChildren] = useState()
	useEffect(()=>{
		let chidrenArr = [
			{
				path:"store",
				element:LazyLoad("components/store/Store")
			},
			{
				path:"detail",
				element:LazyLoad("components/store/detail/Detail"),
			},
			{
				path:"package",
				element:LazyLoad("components/package/Package"),
			},
			{
				path:"admin",
				element:LazyLoad("components/admin/Admin")
			},
			{
				path:"superAdmin",
				element:LazyLoad("components/superadmin/SuperAdmin")
			},
			{
				path:"storeDetail/:storeId/:storeName",
				element:LazyLoad("components/superadmin/storelist/detail/Detail")
			},
			{
				path:'/',
				element:isStore?<Navigate to="store"/>:<Navigate to="package"/>
			}
		]
		
		if(checkSuper(isWorker,isStore)){
			if(isWorker==null && isStore!==null ){
				chidrenArr = chidrenArr.filter(i=>i.path!=="package"&&i.path!=="storeDetail/:storeId/:storeName")
			}else if(isWorker!==null && isStore==null){
				chidrenArr = chidrenArr.filter(i=>(i.path!=="store" && i.path!=="detail" &&i.path!=="storeDetail/:storeId/:storeName"))
			}else{
				setHomeChildren(chidrenArr)
			}
			return
		}
		
		if(isWorker==null && isStore!==null ){
			chidrenArr = chidrenArr.filter(i=>(i.path!=="package" && i.path!=="superAdmin"))
		}else if(isWorker!==null && isStore==null){
			chidrenArr = chidrenArr.filter(i=>(i.path!=="store" && i.path!=="detail" && i.path!=="superAdmin"))
		}else{
			chidrenArr = chidrenArr.filter(i=>(i.path!=="superAdmin"))
		}
		setHomeChildren(chidrenArr)
	},[isWorker,isStore])
	
	let route = [
		{
			path:"/",
			element:<AuthRoute>
				<SandBox></SandBox>
			</AuthRoute>,
			children:HomeChildren
		},
		{
			path:"/login",
			element:LazyLoad("views/login/Login")
		},
		{
			path:"*",
			element:LazyLoad("views/notfound/NotFound")
		}
	]
	return useRoutes(route)
}

const mapStateToProps = (state)=>{
	return {
		isWorker:state.GlobalStoreReducer.workerInfo,
		isStore:state.GlobalStoreReducer.storeInfo
	}
}

export default connect(mapStateToProps)(useIndexRouter)
