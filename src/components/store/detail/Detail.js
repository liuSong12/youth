import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {connect} from "react-redux"
import { NavBar} from 'antd-mobile'
import style from "./detail.module.css"
import Commondity from "../../Commondity"

function Detail({changeTabbar,changDetail,detailInfo}){
	const navigate = useNavigate()
	useEffect(()=>{
		changeTabbar(false)
		return function(){
			changDetail(null)
			changeTabbar(true)
		}
	},[])
	
	
	
	return (
	<>
		<div>
			<NavBar onBack={()=>navigate(-1)} style={{background:'white',position:"sticky",top:0}}>{detailInfo.commondityName}</NavBar>
		</div>
		<div>
			 <Commondity detailInfo={detailInfo}/>
		</div>
	</>
	)
}

const mapDispatchToProps = {
	changeTabbar(state){
		return {
			type:"change-tabbar",
			payload:state
		}
	},
	changDetail(payload){
		return {
			type:"changeDetail",
			payload
		}
	}
}
const mapStateToProps = (state)=>{
	return {
		detailInfo:state.DetailReducer.detailInfo
	}
}


export default connect(mapStateToProps,mapDispatchToProps)(Detail)