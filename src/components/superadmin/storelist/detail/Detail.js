import { NavBar } from "antd-mobile"
import { useEffect } from "react"
import { connect } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import MyCard from "../../../store/MyCard"

function Deatil({changeTabbar}){
	const {storeId,storeName} = useParams()
	const navigate = useNavigate()
	useEffect(()=>{
		changeTabbar(false)
		return ()=>{
			changeTabbar(true)
		}
	},[])
	return (
	<>
		<NavBar onBack={()=>navigate(-1)} style={{background:'white',position:"sticky",top:0,zIndex:10}}>{storeName||"这家未设置名字"}</NavBar>
		<MyCard super={10} storeId={storeId}/>
	</>
	)
}

const mapDispatchToProps = {
	changeTabbar(state){
		return {
			type:"change-tabbar",
			payload:state
		}
	}
}

export default connect(null,mapDispatchToProps)(Deatil)